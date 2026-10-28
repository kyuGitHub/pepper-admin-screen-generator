import { describe, expect, it } from 'vitest';
import { loanApplicationDetailScreen } from '../screens/loanApplicationDetail/schema';
import { compileScreen, instantiateRepeat, panelFields } from './compile';
import type { RepeatGroupSchema } from '../schema/types';

describe('compileScreen', () => {
  const compiled = compileScreen(loanApplicationDetailScreen);

  it('collects every concrete panel, including repeat instances', () => {
    const ids = compiled.panels.map((p) => p.id);
    expect(ids).toContain('member');
    expect(ids).toContain('pCustomer');
    expect(ids).toContain('pCustomer_2');
    expect(compiled.repeats.providers).toHaveLength(2);
  });

  it('records checklist sizes for template counts', () => {
    expect(compiled.checklistSizes.precheck).toBe(4);
  });

  it('references only keys that exist in the sample data', () => {
    const missing = compiled.panels
      .flatMap(panelFields)
      .filter((f) => !(f.key in loanApplicationDetailScreen.data.values))
      .map((f) => f.key);
    expect(missing).toEqual([]);
  });
});

describe('instantiateRepeat', () => {
  const group: RepeatGroupSchema = {
    kind: 'repeat',
    id: 'g',
    title: 't',
    countText: '({n})',
    itemTitle: '항목 {no}',
    summaryKeys: ['x'],
    instances: [{ keySuffix: '' }, { keySuffix: '_2' }],
    panels: [
      { kind: 'panel', id: 'p', title: '패널 {no}', historySection: '구분 {no}', blocks: [{ type: 'fields', columns: 1, rows: [[{ label: 'X', key: 'x' }]] }] },
    ],
  };

  it('suffixes panel ids and field keys per instance and fills {no}', () => {
    const [a, b] = instantiateRepeat(group);
    expect(a.panels[0].id).toBe('p');
    expect(b.panels[0].id).toBe('p_2');
    expect(b.panels[0].title).toBe('패널 2');
    expect(b.panels[0].historySection).toBe('구분 2');
    expect(panelFields(b.panels[0])[0].key).toBe('x_2');
  });
});
