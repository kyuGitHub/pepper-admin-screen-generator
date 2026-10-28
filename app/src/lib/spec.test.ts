import { describe, expect, it } from 'vitest';
import { SAMPLE_SCREENS } from '../screens';
import { buildSpec, specToHtml, specToMarkdown } from './spec';

describe('buildSpec', () => {
  it('describes a detail screen: menu path, panels, fields with keys, buttons', () => {
    const doc = buildSpec(SAMPLE_SCREENS.loanApplicationDetail.schema, { area: '여신', pattern: '상세', url: 'https://x/screens/1' });
    expect(doc.title).toBe('대출신청 상세정보 화면정의서');
    expect(doc.meta.find(([k]) => k === '메뉴 경로')?.[1]).toBe('여신 > 모기지 > 대출신청 > 대출신청 상세정보');
    const titles = doc.sections.map((s) => s.title);
    expect(titles).toContain('1. 화면 개요');
    expect(titles.some((t) => /^3\.\d+ 신청정보$/.test(t))).toBe(true);
    const panel = doc.sections.find((s) => /^3\.\d+ 신청정보$/.test(s.title))!;
    const fields = panel.tables!.find((t) => t.caption === '항목')!;
    expect(fields.rows.some((r) => r[2] === '신청금액' && r[3].length > 0 && r[5] === '원')).toBe(true);
    const buttons = doc.sections.find((s) => s.title.endsWith('버튼 동작 정리'))!.tables![0];
    expect(buttons.rows.some((r) => r[1] === '정보변경이력' && r[2].startsWith('정보변경이력 팝업'))).toBe(true);
  });

  it('describes a list screen: search conditions, grid columns with popups, modal fields', () => {
    const doc = buildSpec(SAMPLE_SCREENS.channelList.schema);
    const body = doc.sections.find((s) => s.title.includes('본문'))!;
    const filters = body.tables!.find((t) => t.caption === '검색 조건')!;
    expect(filters.rows[0][1]).toBe('운영일자');
    const grid = body.tables!.find((t) => t.caption?.startsWith('목록'))!;
    expect(grid.columns).toContain('클릭 시');
    expect(grid.rows.some((r) => r[6].includes('팝업'))).toBe(true);
    expect(doc.sections.some((s) => s.title === '4. 팝업 정의')).toBe(true);
    const modal = doc.sections.find((s) => /^4\.1 /.test(s.title))!;
    expect(modal.tables!.find((t) => t.caption === '항목')!.rows.length).toBeGreaterThan(5);
  });

  it('renders Markdown tables and standalone HTML', () => {
    const doc = buildSpec(SAMPLE_SCREENS.channelList.schema);
    const md = specToMarkdown(doc);
    expect(md).toMatch(/^# 채널 목록 화면정의서/);
    expect(md).toContain('| No | 조건명 | 종류 |');
    const html = specToHtml(doc);
    expect(html).toContain('<table>');
    expect(html).toContain('window.print()');
    expect(html).not.toContain('<script>alert');
  });
});
