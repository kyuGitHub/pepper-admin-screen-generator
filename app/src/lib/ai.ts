import type { AiEvent, AiImage, AiRequest } from '../server/ai';
import { supabase } from './supabase';

/* Browser side of the AI generator: posts to /api/generate with the Supabase session and reads the NDJSON stream. */

export async function accessToken(): Promise<string> {
  const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
  const token = data.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');
  return token;
}

/** Runs one AI request; resolves with the `done` event, rejects with the `error` event or a transport error. */
export async function runAi(body: AiRequest, onEvent: (e: AiEvent) => void, signal?: AbortSignal): Promise<Extract<AiEvent, { type: 'done' }>> {
  const token = await accessToken().catch(() => '');
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    let message = `서버 오류 ${res.status}`;
    try {
      message = ((await res.json()) as { message?: string }).message ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }
  let done: Extract<AiEvent, { type: 'done' }> | null = null;
  for await (const e of ndjson(res.body!)) {
    onEvent(e);
    if (e.type === 'done') done = e;
    if (e.type === 'error') throw new Error(e.message);
  }
  if (!done) throw new Error('응답이 중간에 끊겼습니다. 다시 시도하세요.');
  return done;
}

export async function* ndjson(body: ReadableStream<Uint8Array>): AsyncGenerator<AiEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    buf += decoder.decode(value, { stream: !done });
    const lines = buf.split('\n');
    buf = done ? '' : (lines.pop() ?? '');
    for (const line of lines) if (line.trim()) yield JSON.parse(line) as AiEvent;
    if (done) break;
  }
}

/** Downscales a screenshot to ≤ 1600px JPEG so four of them stay well under the request limit. */
export async function toAiImage(file: File, max = 1600): Promise<AiImage> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  return { media_type: 'image/jpeg', data: dataUrl.slice(dataUrl.indexOf(',') + 1) };
}

export const formatUsage = (u: {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cost_usd: number;
  seconds: number;
  attempts: number;
}) =>
  `입력 ${u.input_tokens.toLocaleString()} · 캐시 ${u.cache_read_input_tokens.toLocaleString()} · 출력 ${u.output_tokens.toLocaleString()} 토큰 · 약 $${u.cost_usd.toFixed(3)} (약 ${Math.round(u.cost_usd * 1400).toLocaleString()}원) · ${u.seconds}초${u.attempts > 1 ? ` · ${u.attempts}회 시도` : ''}`;
