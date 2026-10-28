// Builds the single-file viewer template used by [내보내기 → 단일 HTML]: public/viewer-template.html.
// Runs before `vite build` (and `vite dev`) so the app can fetch it at /viewer-template.html.
import { buildSingleFile } from './single-file.mjs';

await buildSingleFile({ input: 'viewer.html', target: 'public/viewer-template.html' });
