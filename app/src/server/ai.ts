import { schemaGuide } from '../lib/schemaGuide';
import { getAt, insertAt, moveAt, removeAt, setAt, type Path } from '../editor/paths';
import type { ScreenSchema } from '../schema/types';

/* Prompts and pure helpers for the AI generator. Shared by the Vercel function (api/generate.ts) and the browser
   (tests, previews). Nothing here touches the network. */

export type AiMode = 'generate' | 'modify';

export interface AiImage {
  media_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  data: string;
}

export interface AiRequest {
  mode: AiMode;
  /** The PM's requirements (generate) or change instruction (modify). */
  request: string;
  pattern?: string;
  area?: string;
  /** Reference screen the new one should follow (generate). */
  reference?: { title: string; schema: ScreenSchema };
  /** The screen being changed (modify). */
  schema?: ScreenSchema;
  images?: AiImage[];
  model?: 'sonnet' | 'opus';
}

/** One change the model asks for in modify mode; applied with the editor's path helpers. */
export type AiOp =
  | { op: 'set'; path: Path; value: unknown }
  | { op: 'insert'; path: Path; value: unknown }
  | { op: 'remove'; path: Path }
  | { op: 'move'; path: Path; delta: number };

export interface AiModifyResult {
  summary: string;
  ops: AiOp[];
}

export const MODELS = { sonnet: 'claude-sonnet-5-5', opus: 'claude-opus-5-5' } as const;

/** USD per million tokens (input, output, cache read, cache write). */
export const PRICES: Record<keyof typeof MODELS, { input: number; output: number; cacheRead: number; cacheWrite: number }> = {
  sonnet: { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  opus: { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
};

export function estimateCostUsd(
  model: keyof typeof MODELS,
  u: { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null },
) {
  const p = PRICES[model];
  return (
    (u.input_tokens * p.input +
      u.output_tokens * p.output +
      (u.cache_read_input_tokens ?? 0) * p.cacheRead +
      (u.cache_creation_input_tokens ?? 0) * p.cacheWrite) /
    1e6
  );
}

/* ---------------------------------------------------------------- prompts */

/** Stable part, cached across calls: who the model is and the schema rules. */
export const SYSTEM_PROMPT = [
  '당신은 페퍼저축은행 디지털어드민(Digital Admin) 화면 제너레이터의 스키마 작성자입니다.',
  '디지털어드민은 PC(Chrome, 가로 1860px)에서 쓰는 내부 운영 화면이며, 모든 화면은 아래 규칙의 ScreenSchema JSON 하나로 정의됩니다.',
  '출력은 항상 ```json 코드블록 하나입니다. 코드블록 앞뒤의 설명은 짧게, 추론 과정은 쓰지 않습니다.',
  '실제 고객 정보는 절대 넣지 않습니다. 사람 이름·전화·주소·계좌는 가짜로, 직원명은 "정**(280123)" 형식입니다.',
  '',
  '# 스키마 작성 규칙',
  schemaGuide.replace(/^# .*\n/, '').trim(),
].join('\n');

export function generateUserText(req: AiRequest): string {
  const lines = [
    '## 요청',
    `- 화면명/패턴: ${req.pattern ?? '(요청에서 판단)'}${req.area ? ` · 영역 ${req.area}` : ''}`,
    '',
    req.request.trim(),
    '',
    '## 작성 지침',
    '- 참고 화면과 같은 shell(헤더·LNB)을 쓰되 active 메뉴와 LNB 열린 경로·activeId는 이 화면에 맞게 바꿉니다.',
    '- 패턴이 목록이면 body = [searchBar, grid] + 편집 팝업, 상세면 summary 패널 + tabs(2열)로 구성합니다.',
    '- 캡처 이미지가 있으면 그 레이아웃·항목 순서·버튼 위치를 최대한 그대로 따릅니다. 이미지의 실제 값은 쓰지 말고 샘플 값으로 바꿉니다.',
    '- 모든 필드에 샘플 값을 data.values에, 목록에는 20행을 data.tables에 넣습니다.',
    '- 요청에 없는 세부는 참고 화면의 관행을 따르고, 정한 가정은 JSON 뒤에 "가정:" 목록으로 3줄 이내로 적습니다.',
    '- 출력: ```json 코드블록 하나(전체 ScreenSchema) + 가정 목록.',
  ];
  return lines.join('\n');
}

export function referenceText(ref: { title: string; schema: ScreenSchema }): string {
  return `## 참고 화면 스키마 — "${ref.title}" (같은 형식·같은 shell로 작성)\n\`\`\`json\n${JSON.stringify(ref.schema, null, 1)}\n\`\`\``;
}

export function modifyUserText(req: AiRequest): string {
  return [
    '## 현재 화면 스키마',
    '```json',
    JSON.stringify(req.schema, null, 1),
    '```',
    '',
    '## 수정 요청',
    req.request.trim(),
    '',
    '## 출력 형식',
    '현재 스키마를 고치는 변경 명령 목록만 ```json 코드블록 하나로 출력합니다. 전체 스키마를 다시 쓰지 않습니다.',
    '{ "summary": "무엇을 바꿨는지 한 문장", "ops": [ ...명령 ] }',
    '명령 종류 (path는 스키마 루트부터의 키/인덱스 배열):',
    '- { "op": "set", "path": ["tabs", 0, "label"], "value": "새 값" }  — 값 교체 (없는 키는 추가)',
    '- { "op": "insert", "path": ["summary", 1], "value": {...} }  — 배열의 그 위치에 삽입',
    '- { "op": "remove", "path": ["tabs", 2] }  — 배열 요소 삭제',
    '- { "op": "move", "path": ["tabs", 2], "delta": -1 }  — 배열 요소 순서 이동',
    '규칙: 새 필드는 fields 블록의 rows 안에 셀로 넣고 data.values에 값도 set 합니다. 새 패널은 columns[i].items에 insert 합니다. 팝업을 여는 버튼은 modals[].id를 가리켜야 합니다. 요청하지 않은 것은 바꾸지 않습니다.',
  ].join('\n');
}

/* ---------------------------------------------------------------- output parsing */

/** First ```json block (or the largest {...}) and the text after it. */
export function extractJson(text: string): { json: string; rest: string } | null {
  const fence = /```(?:json)?\s*\n([\s\S]*?)\n```/m.exec(text);
  if (fence) return { json: fence[1], rest: text.slice(fence.index + fence[0].length).trim() };
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) return { json: text.slice(start, end + 1), rest: text.slice(end + 1).trim() };
  return null;
}

/** "가정:" list after the JSON, as plain lines. */
export function extractAssumptions(rest: string): string[] {
  return rest
    .split('\n')
    .map((l) => l.replace(/^[-*\d.)\s]+/, '').trim())
    .filter((l) => l && !/^가정\s*[:：]?$/.test(l));
}

export function isAiOp(v: unknown): v is AiOp {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  if (!Array.isArray(o.path) || !o.path.every((k) => typeof k === 'string' || typeof k === 'number')) return false;
  switch (o.op) {
    case 'set':
    case 'insert':
      return 'value' in o;
    case 'remove':
      return true;
    case 'move':
      return typeof o.delta === 'number';
    default:
      return false;
  }
}

export function parseModifyResult(json: string): AiModifyResult {
  const v = JSON.parse(json) as { summary?: unknown; ops?: unknown };
  if (!Array.isArray(v.ops)) throw new Error('ops 배열이 없습니다.');
  const bad = v.ops.findIndex((o) => !isAiOp(o));
  if (bad >= 0) throw new Error(`ops[${bad}] 형식이 잘못되었습니다: ${JSON.stringify(v.ops[bad]).slice(0, 120)}`);
  return { summary: typeof v.summary === 'string' ? v.summary : '', ops: v.ops as AiOp[] };
}

/** Applies ops in order; a path that does not exist (for set) is created, others throw with the op index. */
export function applyOps(schema: ScreenSchema, ops: AiOp[]): ScreenSchema {
  let cur = schema;
  ops.forEach((op, i) => {
    const parent = getAt(cur, op.path.slice(0, -1));
    if (op.op !== 'set' && (parent === undefined || parent === null)) throw new Error(`ops[${i}] 경로가 없습니다: ${JSON.stringify(op.path)}`);
    switch (op.op) {
      case 'set':
        cur = setAt(cur, op.path, op.value);
        break;
      case 'insert':
        if (!Array.isArray(parent)) throw new Error(`ops[${i}] insert 대상이 배열이 아닙니다: ${JSON.stringify(op.path)}`);
        cur = insertAt(cur, op.path, op.value);
        break;
      case 'remove':
        if (!Array.isArray(parent)) throw new Error(`ops[${i}] remove 대상이 배열이 아닙니다: ${JSON.stringify(op.path)}`);
        cur = removeAt(cur, op.path);
        break;
      case 'move':
        cur = moveAt(cur, op.path, op.delta).next;
        break;
    }
  });
  return cur;
}

/* ---------------------------------------------------------------- stream protocol (NDJSON) */

export type AiEvent =
  | { type: 'status'; text: string }
  | { type: 'delta'; chars: number }
  | { type: 'done'; schema: ScreenSchema; assumptions: string[]; summary?: string; ops?: AiOp[]; usage: AiUsage }
  | { type: 'error'; message: string };

export interface AiUsage {
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens: number;
  cost_usd: number;
  seconds: number;
  attempts: number;
}
