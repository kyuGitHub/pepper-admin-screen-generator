import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ScreenRenderer } from './renderer/ScreenRenderer';
import type { ScreenSchema } from './schema/types';
import './design-system';

/* Entry of the single-file viewer (scripts/build-viewer.mjs). The exported HTML carries the screen
   schema in <script id="screen-schema" type="application/json">; nothing is fetched. */

const raw = document.getElementById('screen-schema')?.textContent ?? 'null';
const schema = JSON.parse(raw) as ScreenSchema | null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {schema ? (
      <div style={{ height: '100vh' }}>
        <ScreenRenderer schema={schema} />
      </div>
    ) : (
      <div style={{ padding: 30, fontFamily: 'sans-serif' }}>화면 스키마가 없습니다. 제너레이터의 [내보내기 → 단일 HTML]로 만든 파일을 여세요.</div>
    )}
  </StrictMode>,
);
