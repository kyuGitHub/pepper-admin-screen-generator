// Shared by build-single.mjs and build-viewer.mjs: builds one Vite entry into a single HTML file with
// JS, CSS, fonts and images inlined, so it opens offline by double-click.
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';

export async function buildSingleFile({ input, target }) {
  const out = mkdtempSync(join(tmpdir(), 'single-'));
  await build({
    root: process.cwd(),
    base: './',
    logLevel: 'warn',
    plugins: [react()],
    build: {
      outDir: out,
      emptyOutDir: true,
      assetsInlineLimit: 1e9,
      cssCodeSplit: false,
      modulePreload: false,
      rollupOptions: { input: join(process.cwd(), input) },
    },
  });
  let html = readFileSync(join(out, basename(input)), 'utf8');
  for (const f of readdirSync(join(out, 'assets'))) {
    const src = readFileSync(join(out, 'assets', f), 'utf8');
    if (f.endsWith('.js')) html = html.replace(new RegExp(`<script[^>]*src="\\./assets/${f}"[^>]*></script>`), () => `<script type="module">${src}</script>`);
    if (f.endsWith('.css')) html = html.replace(new RegExp(`<link[^>]*href="\\./assets/${f}"[^>]*>`), () => `<style>${src}</style>`);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  rmSync(out, { recursive: true, force: true });
  console.log(`wrote ${target} (${(html.length / 1024 / 1024).toFixed(1)} MB)`);
}
