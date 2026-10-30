import { describe, expect, it } from 'vitest';
import { authorLabel, formatKst } from './datetime';

describe('formatKst', () => {
  it('converts UTC timestamps to Korea time', () => {
    expect(formatKst('2026-10-28T13:05:09.123+00:00')).toBe('2026.10.28 22:05');
    expect(formatKst('2026-10-28T16:30:00Z')).toBe('2026.10.29 01:30');
  });
  it('handles empty and invalid input', () => {
    expect(formatKst(null)).toBe('-');
    expect(formatKst('not a date')).toBe('not a date');
  });
});

describe('authorLabel', () => {
  it('shows the e-mail id', () => {
    expect(authorLabel('pm.kim@example.com')).toBe('pm.kim');
    expect(authorLabel(null)).toBe('작성자 미상');
  });
});
