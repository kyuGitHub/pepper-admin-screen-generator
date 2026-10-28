import { toBlob } from 'html-to-image';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';

const WIDTH = 1860;
const HEIGHT = 1100;

/**
 * Renders a schema off-screen at admin size and captures the first tab as a small PNG.
 * Resolves to null when capture fails (fonts, canvas limits); callers then keep the placeholder.
 */
export async function captureThumbnail(schema: ScreenSchema): Promise<Blob | null> {
  const host = document.createElement('div');
  Object.assign(host.style, {
    position: 'fixed',
    left: '-20000px',
    top: '0',
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`,
    overflow: 'hidden',
    background: '#fff',
  });
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    root.render(createElement(ScreenRenderer, { schema }));
    await new Promise((r) => setTimeout(r, 400));
    await document.fonts.ready;
    return await toBlob(host, { width: WIDTH, height: HEIGHT, pixelRatio: 0.25, cacheBust: true, backgroundColor: '#fff' });
  } catch (e) {
    console.warn('thumbnail capture failed', e);
    return null;
  } finally {
    root.unmount();
    host.remove();
  }
}
