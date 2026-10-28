import { describe, expect, it } from 'vitest';
import { maskValue, resolveText, toNumber, type TemplateContext } from './text';

const ctx: TemplateContext = {
  values: { a: '1,000', b: '2,500', empty: '' },
  tables: {
    loans: [
      { bal: '28,000,000', yn: 'N' },
      { bal: '0', yn: 'Y' },
    ],
  },
  checked: { pre: { 0: true, 2: true, 3: false } },
  checklistSizes: { pre: 4 },
};

describe('toNumber', () => {
  it('parses comma-grouped amounts and ignores units', () => {
    expect(toNumber('106,062,209 원')).toBe(106062209);
    expect(toNumber('')).toBe(0);
    expect(toNumber('-')).toBe(0);
  });
});

describe('resolveText', () => {
  it('interpolates row counts, column sums and field sums', () => {
    expect(resolveText('당행기대출정보 ({rows:loans}건)', ctx)).toBe('당행기대출정보 (2건)');
    expect(resolveText('{sumCol:loans.bal}', ctx)).toBe('28,000,000');
    expect(resolveText('합계 {sum:a,b}원', ctx)).toBe('합계 3,500원');
  });

  it('counts checked checklist items and conditional rows', () => {
    expect(resolveText('({checked:pre}/{items:pre})', ctx)).toBe('(2/4)');
    expect(resolveText({ when: '{rowsWhere:loans.yn=N}', then: '미해제 {rowsWhere:loans.yn=N}건', else: '전체 {rows:loans}건' }, ctx)).toBe('미해제 1건');
    expect(resolveText({ when: '{rowsWhere:loans.yn=X}', then: 'then', else: 'else' }, ctx)).toBe('else');
  });
});

describe('maskValue', () => {
  it('masks by kind and leaves blanks alone', () => {
    expect(maskValue('name', '홍길동')).toBe('홍*동');
    expect(maskValue('phone', '010-1234-5678')).toBe('010-****-5678');
    expect(maskValue('email', 'pepper@bank.kr')).toBe('pe****@bank.kr');
    expect(maskValue('address', '경기도 김포시 사우동 123')).toBe('경기도 김포시 사우동 ****');
    expect(maskValue('default', '')).toBe('');
    expect(maskValue('default', '-')).toBe('-');
  });
});
