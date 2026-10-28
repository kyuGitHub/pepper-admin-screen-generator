import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { validateScreenSchema } from '../src/lib/validateSchema';
import {
  MODELS,
  SYSTEM_PROMPT,
  applyOps,
  estimateCostUsd,
  extractAssumptions,
  extractJson,
  generateUserText,
  modifyUserText,
  parseModifyResult,
  referenceText,
  type AiEvent,
  type AiRequest,
  type AiUsage,
} from '../src/server/ai';
import type { ScreenSchema } from '../src/schema/types';

/* Vercel Function: POST /api/generate — calls Claude for a logged-in PM and streams NDJSON events back.
   The API key lives only here (ANTHROPIC_API_KEY). Each run is written to `ai_runs` (supabase/schema.sql). */

export const config = { maxDuration: 300 };

const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT ?? 30);

const env = (k: string) => process.env[k] ?? process.env[`VITE_${k}`];

/** GET /api/generate — configuration check without calling Claude: whether the key, Supabase and the model are set. */
export async function GET(): Promise<Response> {
  const key = process.env.ANTHROPIC_API_KEY ?? '';
  return json({
    ok: key.length > 0,
    anthropicKey: key ? `설정됨 (${key.slice(0, 10)}…, ${key.length}자)` : '없음 — Vercel 환경변수 ANTHROPIC_API_KEY를 등록하고 Redeploy 하세요',
    supabase: env('SUPABASE_URL') && env('SUPABASE_ANON_KEY') ? '설정됨' : '없음',
    models: MODELS,
    dailyLimit: DAILY_LIMIT,
    mock: process.env.AI_MOCK === '1',
    runtime: `node ${process.version}`,
  });
}

export async function POST(req: Request): Promise<Response> {
  try {
    return await handlePost(req);
  } catch (e) {
    console.error('generate failed before streaming', e);
    return json({ message: `서버 함수 오류: ${describeError(e)}`, stack: (e as Error).stack?.split('\n').slice(0, 4).join('\n') }, 500);
  }
}

async function handlePost(req: Request): Promise<Response> {
  if (process.env.AI_MOCK === '1') return mock(req);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ message: 'ANTHROPIC_API_KEY가 설정되지 않았습니다. Vercel 환경변수에 등록하세요.' }, 503);

  const supabaseUrl = env('SUPABASE_URL');
  const anonKey = env('SUPABASE_ANON_KEY');
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!supabaseUrl || !anonKey || !token) return json({ message: '로그인이 필요합니다.' }, 401);
  const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: auth, error: authError } = await supabase.auth.getUser(token);
  if (authError || !auth.user) return json({ message: '로그인 세션이 만료되었습니다. 다시 로그인하세요.' }, 401);

  let body: AiRequest;
  try {
    body = (await req.json()) as AiRequest;
  } catch {
    return json({ message: '요청 본문이 JSON이 아닙니다.' }, 400);
  }
  if (!body.request?.trim()) return json({ message: '요청 내용이 비어 있습니다.' }, 400);
  if (body.mode === 'modify' && !body.schema) return json({ message: '수정할 화면 스키마가 없습니다.' }, 400);
  if ((body.images?.length ?? 0) > 4) return json({ message: '이미지는 최대 4장입니다.' }, 400);

  // Daily cap per user (skipped when the ai_runs table is missing, so the feature works before the SQL is applied).
  const since = new Date();
  since.setUTCHours(since.getUTCHours() - 24);
  const { count, error: countError } = await supabase.from('ai_runs').select('id', { count: 'exact', head: true }).gte('created_at', since.toISOString());
  if (!countError && (count ?? 0) >= DAILY_LIMIT)
    return json({ message: `하루 ${DAILY_LIMIT}회 한도를 넘었습니다. 내일 다시 시도하거나 관리자에게 한도 상향을 요청하세요.` }, 429);

  const modelKey = body.model === 'opus' ? 'opus' : 'sonnet';
  const model = MODELS[modelKey];
  const client = new Anthropic({ apiKey });
  const started = Date.now();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: AiEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + '\n'));
      const usage: AiUsage = {
        model,
        input_tokens: 0,
        output_tokens: 0,
        cache_read_input_tokens: 0,
        cache_creation_input_tokens: 0,
        cost_usd: 0,
        seconds: 0,
        attempts: 0,
      };
      const addUsage = (u: Anthropic.Usage) => {
        usage.input_tokens += u.input_tokens;
        usage.output_tokens += u.output_tokens;
        usage.cache_read_input_tokens += u.cache_read_input_tokens ?? 0;
        usage.cache_creation_input_tokens += u.cache_creation_input_tokens ?? 0;
      };
      const finish = () => {
        usage.seconds = Math.round((Date.now() - started) / 10) / 100;
        usage.cost_usd = Math.round(estimateCostUsd(modelKey, usage) * 1e4) / 1e4;
      };
      let status: 'ok' | 'error' = 'ok';
      let errorText = '';
      try {
        const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userContent(body) }];
        send({
          type: 'status',
          text: body.mode === 'modify' ? '수정 명령을 만드는 중…' : `화면을 생성하는 중… (${modelKey === 'opus' ? 'Opus 5.5' : 'Sonnet 5.5'})`,
        });

        let result: { schema: ScreenSchema; assumptions: string[]; summary?: string; ops?: ReturnType<typeof parseModifyResult>['ops'] } | null = null;
        for (let attempt = 1; attempt <= 2 && !result; attempt++) {
          usage.attempts = attempt;
          const text = await runStream(client, model, messages, (chars) => send({ type: 'delta', chars }), addUsage);
          const problem = body.mode === 'modify' ? tryModify(text, body.schema!) : tryGenerate(text);
          if ('ok' in problem) {
            result = problem.ok;
            break;
          }
          if (attempt === 2) throw new Error(problem.error);
          send({ type: 'status', text: `결과 검증 실패, 고쳐서 다시 받는 중… (${problem.error.split('\n')[0].slice(0, 80)})` });
          messages.push({ role: 'assistant', content: text });
          messages.push({
            role: 'user',
            content: `검증 오류:\n${problem.error}\n\n위 오류를 고친 ${body.mode === 'modify' ? '변경 명령 목록' : '전체 ScreenSchema JSON'}을 \`\`\`json 코드블록 하나로 다시 출력하세요.`,
          });
        }
        finish();
        send({ type: 'done', schema: result!.schema, assumptions: result!.assumptions, summary: result!.summary, ops: result!.ops, usage });
      } catch (e) {
        status = 'error';
        errorText = describeError(e);
        finish();
        send({ type: 'error', message: errorText });
      } finally {
        await supabase
          .from('ai_runs')
          .insert({
            user_id: auth.user!.id,
            email: auth.user!.email ?? null,
            mode: body.mode,
            model,
            input_tokens: usage.input_tokens,
            output_tokens: usage.output_tokens,
            cache_read_tokens: usage.cache_read_input_tokens,
            cost_usd: usage.cost_usd,
            seconds: usage.seconds,
            attempts: usage.attempts,
            status,
            error: errorText || null,
            request: body.request.slice(0, 2000),
          })
          .then(({ error }) => error && console.warn('ai_runs insert failed:', error.message));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' } });
}

function userContent(body: AiRequest): Anthropic.ContentBlockParam[] {
  const blocks: Anthropic.ContentBlockParam[] = [];
  if (body.mode === 'generate') {
    // The reference JSON is the bulk of the prompt and repeats across tries: cache it.
    if (body.reference) blocks.push({ type: 'text', text: referenceText(body.reference), cache_control: { type: 'ephemeral' } });
    for (const img of body.images ?? []) blocks.push({ type: 'image', source: { type: 'base64', media_type: img.media_type, data: img.data } });
    blocks.push({ type: 'text', text: generateUserText(body) });
  } else {
    for (const img of body.images ?? []) blocks.push({ type: 'image', source: { type: 'base64', media_type: img.media_type, data: img.data } });
    blocks.push({ type: 'text', text: modifyUserText(body) });
  }
  return blocks;
}

async function runStream(
  client: Anthropic,
  model: string,
  messages: Anthropic.MessageParam[],
  onChars: (n: number) => void,
  onUsage: (u: Anthropic.Usage) => void,
): Promise<string> {
  const stream = client.beta.messages.stream({
    model,
    max_tokens: 64000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium' },
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages,
  } as Parameters<typeof client.beta.messages.stream>[0]);
  let chars = 0;
  let lastSent = 0;
  stream.on('text', (delta) => {
    chars += delta.length;
    if (chars - lastSent >= 400) {
      lastSent = chars;
      onChars(chars);
    }
  });
  const final = await stream.finalMessage();
  onChars(chars);
  onUsage(final.usage as unknown as Anthropic.Usage);
  if (final.stop_reason === 'refusal') throw new Error('모델이 이 요청을 거절했습니다. 요청 내용을 바꿔 다시 시도하세요.');
  if (final.stop_reason === 'max_tokens') throw new Error('출력이 너무 길어 잘렸습니다. 화면을 둘로 나누거나 패널 수를 줄여 요청하세요.');
  return final.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

function tryGenerate(text: string): { ok: { schema: ScreenSchema; assumptions: string[] } } | { error: string } {
  const ex = extractJson(text);
  if (!ex) return { error: '```json 코드블록을 찾지 못했습니다.' };
  const v = validateScreenSchema(ex.json);
  if (!v.ok || !v.schema) return { error: v.errors.join('\n') };
  return { ok: { schema: v.schema, assumptions: extractAssumptions(ex.rest) } };
}

function tryModify(
  text: string,
  current: ScreenSchema,
): { ok: { schema: ScreenSchema; assumptions: string[]; summary: string; ops: ReturnType<typeof parseModifyResult>['ops'] } } | { error: string } {
  const ex = extractJson(text);
  if (!ex) return { error: '```json 코드블록을 찾지 못했습니다.' };
  try {
    const r = parseModifyResult(ex.json);
    const next = applyOps(current, r.ops);
    const v = validateScreenSchema(JSON.stringify(next));
    if (!v.ok || !v.schema) return { error: `변경 적용 결과가 스키마 규칙에 어긋납니다:\n${v.errors.join('\n')}` };
    return { ok: { schema: v.schema, assumptions: [], summary: r.summary, ops: r.ops } };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function describeError(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'Claude API 키가 올바르지 않습니다 (ANTHROPIC_API_KEY).';
  if (e instanceof Anthropic.RateLimitError) return 'Claude API 사용량 제한에 걸렸습니다. 잠시 후 다시 시도하세요.';
  if (e instanceof Anthropic.BadRequestError) return `요청 형식 오류: ${e.message}`;
  if (e instanceof Anthropic.APIError) return `Claude API 오류 ${e.status}: ${e.message}`;
  return (e as Error).message ?? String(e);
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

/** AI_MOCK=1 (local dev without a key): streams a canned result so the pages can be exercised end to end. */
async function mock(req: Request): Promise<Response> {
  const body = (await req.json()) as AiRequest;
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: AiEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + '\n'));
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      send({ type: 'status', text: '(모의) 화면을 생성하는 중…' });
      for (let c = 400; c <= 2000; c += 400) {
        await wait(150);
        send({ type: 'delta', chars: c });
      }
      const usage: AiUsage = {
        model: 'mock',
        input_tokens: 21000,
        output_tokens: 12000,
        cache_read_input_tokens: 0,
        cache_creation_input_tokens: 0,
        cost_usd: 0.16,
        seconds: 0.8,
        attempts: 1,
      };
      if (body.mode === 'modify' && body.schema) {
        const ops = [{ op: 'set' as const, path: ['title'], value: `${body.schema.title} (AI 수정)` }];
        send({ type: 'done', schema: applyOps(body.schema, ops), assumptions: [], summary: '(모의) 제목을 바꿨습니다', ops, usage });
      } else if (body.reference) {
        const title =
          body.request
            .split('\n')[0]
            .replace(/^화면명\s*[:：]\s*/, '')
            .slice(0, 40) || '새 화면';
        send({
          type: 'done',
          schema: { ...body.reference.schema, id: `ai-${Date.now().toString(36)}`, title },
          assumptions: ['(모의) 참고 화면을 복사했습니다'],
          usage,
        });
      } else send({ type: 'error', message: '(모의) 참고 화면이 없으면 모의 생성을 할 수 없습니다.' });
      controller.close();
    },
  });
  return new Response(stream, { headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' } });
}
