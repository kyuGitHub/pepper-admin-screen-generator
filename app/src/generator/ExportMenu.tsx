import { useState } from 'react';
import { copyText, exportJson, exportPng, exportSingleHtml, safeName, downloadText } from '../lib/export';
import { buildSpec, specToHtml, specToMarkdown, type SpecMeta } from '../lib/spec';
import type { ScreenSchema } from '../schema/types';
import { GenMenu, type GenMenuItem as MenuItem } from './ui';

/* [내보내기 ▾] in the screen toolbar. Everything runs in the browser from the schema; nothing is uploaded. */

export function ExportMenu({ schema, title, meta, extra = [] }: { schema: ScreenSchema; title: string; meta: SpecMeta; extra?: (MenuItem | 'divider')[] }) {
  const [busy, setBusy] = useState('');
  const [toast, setToast] = useState('');
  const run = (label: string, fn: () => Promise<void> | void) => async () => {
    setBusy(label);
    try {
      await fn();
      setToast(`${label} 완료`);
    } catch (e) {
      window.alert(`${label} 실패: ${(e as Error).message ?? e}`);
    } finally {
      setBusy('');
      setTimeout(() => setToast(''), 2500);
    }
  };
  const spec = () => buildSpec(schema, { ...meta, url: meta.url ?? window.location.href });
  const items: (MenuItem | 'divider')[] = [
    { label: 'URL 복사', hint: '로그인한 PM·개발자에게 공유', onSelect: run('URL 복사', () => copyText(window.location.href)) },
    'divider',
    {
      label: '화면정의서 열기 (HTML)',
      hint: '새 탭 · 인쇄/PDF 저장, 표 복사',
      onSelect: run('화면정의서 열기', () => {
        const url = URL.createObjectURL(new Blob([specToHtml(spec())], { type: 'text/html;charset=utf-8' }));
        window.open(url, '_blank');
      }),
    },
    {
      label: '화면정의서 내려받기 (Markdown)',
      hint: 'Confluence·Notion에 붙여넣기',
      onSelect: run('화면정의서 내려받기', () => downloadText(`${safeName(title)} 화면정의서.md`, specToMarkdown(spec()), 'text/markdown')),
    },
    'divider',
    {
      label: '단일 HTML 내려받기',
      hint: '오프라인에서 더블클릭으로 열림 (약 1.8MB)',
      onSelect: run('단일 HTML 내려받기', () => exportSingleHtml(schema, title)),
    },
    { label: 'PNG 내려받기', hint: '1860×1100, 첫 탭 화면', onSelect: run('PNG 내려받기', () => exportPng(schema, title)) },
    { label: 'JSON 내려받기', hint: '스키마 원본', onSelect: run('JSON 내려받기', () => exportJson(schema, title)) },
    ...(extra.length ? ['divider' as const, ...extra] : []),
  ];
  return <GenMenu label="내보내기" items={items} busy={busy ? `${busy} 중…` : undefined} toast={toast || undefined} />;
}
