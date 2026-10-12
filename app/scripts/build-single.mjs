// Builds the app into one self-contained HTML file (JS, CSS, fonts and images inlined) that
// opens offline by double-click. Usage: npm run build:single  →  ../preview/대출신청 상세정보 v3.html
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const target = process.argv[2] ?? '../preview/대출신청 상세정보 v3.html';
const out = mkdtempSync(join(tmpdir(), 'single-'));
await build({
  root: process.cwd(),
  base: './',
  logLevel: 'warn',
  plugins: [react()],
  build: { outDir: out, emptyOutDir: true, assetsInlineLimit: 1e9, cssCodeSplit: false, modulePreload: false },
});
let html = readFileSync(join(out, 'index.html'), 'utf8');
for (const f of readdirSync(join(out, 'assets'))) {
  const src = readFileSync(join(out, 'assets', f), 'utf8');
  if (f.endsWith('.js')) html = html.replace(new RegExp(`<script[^>]*src="\\./assets/${f}"[^>]*></script>`), () => `<script type="module">${src}</script>`);
  if (f.endsWith('.css')) html = html.replace(new RegExp(`<link[^>]*href="\\./assets/${f}"[^>]*>`), () => `<style>${src}</style>`);
}
writeFileSync(target, html);
rmSync(out, { recursive: true, force: true });
console.log(`wrote ${target}`);
