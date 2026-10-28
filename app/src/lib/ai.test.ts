import { describe, expect, it } from 'vitest';
import { ndjson } from './ai';

describe('ndjson', () => {
  it('splits events across chunk boundaries', async () => {
    const parts = ['{"type":"status","text":"a"}\n{"type":"del', 'ta","chars":5}\n', '{"type":"error","message":"x"}'];
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        for (const p of parts) c.enqueue(new TextEncoder().encode(p));
        c.close();
      },
    });
    const out = [];
    for await (const e of ndjson(stream)) out.push(e.type);
    expect(out).toEqual(['status', 'delta', 'error']);
  });
});
