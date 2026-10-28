import { toBlob } from 'html-to-image';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';

export const ADMIN_WIDTH = 1860;
export const ADMIN_HEIGHT = 1100;

/**
 * Renders a schema off-screen at admin size and captures it as a PNG blob.
 * Resolves to null when capture fails (fonts, canvas limits).
 *
 * The capture target is a plain inner div, not the off-screen host: html-to-image copies the
 * target's own styles into the clone, so capturing the `left: -20000px` host yields a blank image.
 */
export async function renderOffscreen(schema: ScreenSchema, { width = ADMIN_WIDTH, height = ADMIN_HEIGHT, pixelRatio = 1 } = {}): Promise<Blob | null> {
  const host = document.createElement('div');
  Object.assign(host.style, { position: 'fixed', left: '-20000px', top: '0', width: `${width}px`, height: `${height}px`, overflow: 'hidden' });
  const target = document.createElement('div');
  Object.assign(target.style, { width: `${width}px`, height: `${height}px`, overflow: 'hidden', background: '#fff' });
  target.style.setProperty('--screen-vh', `${height}px`);
  host.appendChild(target);
  document.body.appendChild(host);
  const root = createRoot(target);
  try {
    root.render(createElement(ScreenRenderer, { schema }));
    await new Promise((r) => setTimeout(r, 400));
    await document.fonts.ready;
    return await toBlob(target, { width, height, pixelRatio, cacheBust: true, backgroundColor: '#fff' });
  } catch (e) {
    console.warn('offscreen capture failed', e);
    return null;
  } finally {
    root.unmount();
    host.remove();
  }
}
