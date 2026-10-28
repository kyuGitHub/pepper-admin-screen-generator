import { describe, expect, it } from 'vitest';
import { SAMPLE_SCREENS } from '../screens';
import { SYSTEM_PROMPT, applyOps, estimateCostUsd, extractAssumptions, extractJson, generateUserText, modifyUserText, parseModifyResult } from './ai';

describe('prompts', () => {
  it('system prompt carries the schema rules and the no-PII rule', () => {
    expect(SYSTEM_PROMPT).toContain('## 최상위 구조');
    expect(SYSTEM_PROMPT).toContain('실제 고객 정보는 절대');
  });
  it('generate text includes the request and image guidance; modify text includes the schema and op formats', () => {
    const g = generateUserText({ mode: 'generate', request: '서류접수 목록', pattern: '목록', images: [{ media_type: 'image/jpeg', data: 'x' }] });
    expect(g).toContain('서류접수 목록');
    expect(g).toContain('캡처 이미지');
    const m = modifyUserText({ mode: 'modify', request: '탭 삭제', schema: SAMPLE_SCREENS.channelList.schema });
    expect(m).toContain('"id": "settings-channel-list"'.slice(0, 5));
    expect(m).toContain('"op": "move"');
  });
});

describe('extractJson', () => {
  it('takes the first fenced block and the text after it', () => {
    const r = extractJson('설명\n```json\n{"a":1}\n```\n가정:\n- 하나\n- 둘');
    expect(r?.json).toBe('{"a":1}');
    expect(extractAssumptions(r!.rest)).toEqual(['하나', '둘']);
  });
  it('falls back to the outermost braces', () => {
    expect(extractJson('x {"a":{"b":2}} y')?.json).toBe('{"a":{"b":2}}');
    expect(extractJson('nothing')).toBeNull();
  });
});

describe('modify ops', () => {
  const schema = SAMPLE_SCREENS.loanApplicationDetail.schema;
  it('parses and applies set/insert/remove/move', () => {
    const r = parseModifyResult(
      JSON.stringify({
        summary: 's',
        ops: [
          { op: 'set', path: ['title'], value: '새 제목' },
          { op: 'insert', path: ['toolbar', 'actions', 0], value: { type: 'button', label: '승인요청', variant: 'primary' } },
          { op: 'move', path: ['tabs', 1], delta: -1 },
          { op: 'remove', path: ['tabs', 2] },
        ],
      }),
    );
    const next = applyOps(schema, r.ops);
    expect(next.title).toBe('새 제목');
    expect(next.toolbar.actions[0]).toMatchObject({ label: '승인요청' });
    expect(next.tabs[0].label).toBe(schema.tabs[1].label);
    expect(next.tabs.length).toBe(schema.tabs.length - 1);
    expect(schema.title).not.toBe('새 제목');
  });
  it('rejects malformed ops and missing paths', () => {
    expect(() => parseModifyResult('{"ops":[{"op":"zap","path":[]}]}')).toThrow(/ops\[0\]/);
    expect(() => applyOps(schema, [{ op: 'remove', path: ['nope', 3] }])).toThrow(/경로/);
  });
});

describe('estimateCostUsd', () => {
  it('prices sonnet input/output/cache', () => {
    expect(estimateCostUsd('sonnet', { input_tokens: 1_000_000, output_tokens: 0 })).toBe(2);
    expect(estimateCostUsd('sonnet', { input_tokens: 0, output_tokens: 100_000, cache_read_input_tokens: 1_000_000 })).toBeCloseTo(1.2);
  });
});
