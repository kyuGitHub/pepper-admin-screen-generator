import { describe, expect, it } from 'vitest';
import { loanApplicationDetailScreen } from '../screens/loanApplicationDetail/schema';
import { validateScreenSchema } from './validateSchema';

describe('validateScreenSchema', () => {
  it('accepts the v3 sample schema round-tripped through JSON', () => {
    const r = validateScreenSchema(JSON.stringify(loanApplicationDetailScreen));
    expect(r.ok).toBe(true);
    expect(r.schema?.title).toBe('대출신청 상세정보');
  });

  it('reports the line and column of a JSON syntax error', () => {
    const r = validateScreenSchema('{\n  "title": "x",\n  "tabs": [\n}');
    expect(r.ok).toBe(false);
    expect(r.errors[0]).toMatch(/JSON 문법 오류 \(4행/);
  });

  it('names each missing top-level part', () => {
    const r = validateScreenSchema('{"title":"x"}');
    expect(r.ok).toBe(false);
    expect(r.errors.join('\n')).toMatch(/"shell"/);
    expect(r.errors.join('\n')).toMatch(/"tabs"/);
    expect(r.errors.join('\n')).toMatch(/"data"/);
  });

  it('checks column items inside tab layouts', () => {
    const base = {
      ...loanApplicationDetailScreen,
      tabs: [{ label: 't', layout: { heightMode: 'max', height: '1px', align: 'start', columns: [{ items: [{ kind: 'oops' }] }] } }],
    };
    const r = validateScreenSchema(JSON.stringify(base));
    expect(r.ok).toBe(false);
    expect(r.errors[0]).toMatch(/kind 는 "panel" 또는 "repeat"/);
  });

  it('fills a missing id', () => {
    const noId = { ...loanApplicationDetailScreen, id: undefined };
    const r = validateScreenSchema(JSON.stringify(noId));
    expect(r.ok).toBe(true);
    expect(r.schema?.id).toMatch(/^screen-/);
  });
});
