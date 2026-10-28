import { describe, expect, it } from 'vitest';
import { SAMPLE_SCREENS } from '../screens';
import { EMPTY_INTAKE, buildPrompt, intakeMarkdown } from './intake';

describe('buildPrompt', () => {
  it('includes the request, the schema rules and the reference JSON', () => {
    const form = {
      ...EMPTY_INTAKE,
      title: '서류접수 목록',
      pattern: '목록',
      menuPath: '여신 > 모기지 > 서류접수 목록',
      purpose: '심사역 확인',
      items: '## 접수정보\n접수번호',
      listSpec: '열: No, 접수번호',
    };
    const p = buildPrompt(form, { title: '채널 목록', schema: SAMPLE_SCREENS.channelList.schema });
    expect(p).toContain('- 화면명: 서류접수 목록');
    expect(p).toContain('### 검색 조건 · 목록 열');
    expect(p).toContain('## 스키마 작성 규칙');
    expect(p).toContain('"type": "searchBar"');
    expect(p).toContain('## 참고 화면 스키마 — "채널 목록"');
    expect(p).toContain('"id": "settings-channel-list"'.slice(0, 7));
  });

  it('omits the list section for detail screens and works without a reference', () => {
    const p = buildPrompt({ ...EMPTY_INTAKE, title: 'x', listSpec: '열: a' });
    expect(p).not.toContain('### 검색 조건 · 목록 열');
    expect(p).not.toContain('## 참고 화면 스키마');
  });

  it('renders the questionnaire as Markdown', () => {
    expect(intakeMarkdown()).toContain('## 항목 목록 (패널별) *');
  });
});
