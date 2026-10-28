import type { ScreenSchema } from '../schema/types';
import { renderOffscreen } from './offscreen';

/* Exports of one screen: JSON, PNG, single HTML (viewer template + schema), share URL. The 화면정의서 lives in spec.ts. */

export function downloadBlob(name: string, blob: Blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a); // Chromium ignores `download` on a detached anchor in some cases
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 1000);
}

export const downloadText = (name: string, text: string, type = 'text/plain') => downloadBlob(name, new Blob([text], { type: `${type};charset=utf-8` }));

/** File-name safe version of a screen title. */
export const safeName = (title: string) =>
  title
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'screen';

export const exportJson = (schema: ScreenSchema, title = schema.title) =>
  downloadText(`${safeName(title)}.json`, JSON.stringify(schema, null, 2), 'application/json');

/** Puts the schema into the viewer template (public/viewer-template.html) and fixes the page title. */
export function injectSchema(template: string, schema: ScreenSchema, title = schema.title): string {
  const json = JSON.stringify(schema)
    .replace(/<\/script/gi, '<\\/script')
    .replace(/<!--/g, '<\\!--');
  const marker = /<script id="screen-schema" type="application\/json">[\s\S]*?<\/script>/;
  if (!marker.test(template)) throw new Error('뷰어 템플릿에 screen-schema 자리가 없습니다.');
  return template
    .replace(marker, () => `<script id="screen-schema" type="application/json">${json}</script>`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)} | Digital Admin</title>`);
}

export async function exportSingleHtml(schema: ScreenSchema, title = schema.title) {
  const res = await fetch('/viewer-template.html', { cache: 'no-cache' });
  if (!res.ok) throw new Error('뷰어 템플릿(viewer-template.html)을 불러오지 못했습니다. 빌드에 포함됐는지 확인하세요.');
  const html = injectSchema(await res.text(), schema, title);
  downloadText(`${safeName(title)}.html`, html, 'text/html');
}

export async function exportPng(schema: ScreenSchema, title = schema.title) {
  const blob = await renderOffscreen(schema, { pixelRatio: 1 });
  if (!blob) throw new Error('PNG 캡처에 실패했습니다.');
  downloadBlob(`${safeName(title)}.png`, blob);
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
