import { describe, expect, it } from 'vitest';
import { SAMPLE_SCREENS } from '../screens';
import { countEmpty, fillSampleData, sampleValue } from './sampleData';

describe('sampleValue', () => {
  it('guesses by unit, label and key', () => {
    expect(sampleValue({ label: '신청금액', key: 'amt', unit: '원' })).toMatch(/^[\d,]+$/);
    expect(sampleValue({ label: '휴대폰', key: 'x' })).toMatch(/^010-\d{4}-\d{4}$/);
    expect(sampleValue({ label: '등록일시', key: 'regAt' })).toMatch(/^2026-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(sampleValue({ label: '만기일', key: 'x' })).toMatch(/^2026-\d{2}-\d{2}$/);
    expect(['Y', 'N']).toContain(sampleValue({ label: '사용여부', key: 'x' }));
    expect(sampleValue({ label: '구분', key: 'x', options: ['선택', '개인', '법인'] })).not.toBe('선택');
    expect(sampleValue({ label: '처리자', key: 'x' })).toMatch(/^.+\(\d{6}\)$/);
    expect(sampleValue({ label: '이메일', key: 'x' })).toMatch(/@example\.com$/);
  });

  it('is deterministic for the same key', () => {
    expect(sampleValue({ label: '고객명', key: 'custName' })).toBe(sampleValue({ label: '고객명', key: 'custName' }));
  });
});

describe('fillSampleData', () => {
  it('fills only blanks by default and keeps existing values', () => {
    const schema = SAMPLE_SCREENS.loanApplicationDetail.schema;
    const blanked = { ...schema, data: { values: { ...schema.data.values, applyNo: '' }, tables: { ...schema.data.tables } } };
    const before = countEmpty(blanked);
    expect(before.values).toBeGreaterThan(0);
    const filled = fillSampleData(blanked);
    expect(filled.data.values.applyNo).not.toBe('');
    expect(filled.data.values.productName).toBe(schema.data.values.productName);
    expect(countEmpty(filled)).toEqual({ values: 0, tables: 0 });
    expect(blanked.data.values.applyNo).toBe(''); // source untouched
  });

  it('generates grid rows for empty tables and regenerates everything in `all` mode', () => {
    const schema = SAMPLE_SCREENS.channelList.schema;
    const empty = { ...schema, data: { values: {}, tables: {} } };
    const filled = fillSampleData(empty);
    const rows = filled.data.tables.channels;
    expect(rows.length).toBe(20);
    expect(rows[0].name).toBeTruthy();
    expect(rows[0].no).toBeUndefined();
    const again = fillSampleData(schema, { mode: 'all' });
    expect(again.data.tables.channels[0].name).not.toBe(schema.data.tables.channels[0].name);
  });

  it('fills repeat-group instance keys', () => {
    const schema = SAMPLE_SCREENS.loanApplicationDetail.schema;
    const empty = { ...schema, data: { values: {}, tables: {} } };
    const filled = fillSampleData(empty);
    const suffixed = Object.keys(filled.data.values).filter((k) => k.endsWith('_2'));
    expect(suffixed.length).toBeGreaterThan(0);
  });
});
