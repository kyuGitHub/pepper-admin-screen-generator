import { useEffect, useState } from 'react';
import { captureThumbnail } from '../lib/thumbnail';
import type { ScreenSchema } from '../schema/types';

/** Demo-mode page (`?thumb=1`): runs the thumbnail capture and shows the result or the failure. */
export function ThumbnailCheck({ schema }: { schema: ScreenSchema }) {
  const [state, setState] = useState<{ url?: string; size?: number; error?: string; ms?: number }>({});
  useEffect(() => {
    const t0 = performance.now();
    captureThumbnail(schema)
      .then((blob) =>
        setState(blob ? { url: URL.createObjectURL(blob), size: blob.size, ms: Math.round(performance.now() - t0) } : { error: 'capture returned null' }),
      )
      .catch((e) => setState({ error: String(e) }));
  }, [schema]);
  return (
    <div style={{ padding: 20, fontFamily: 'var(--font-sans)', fontSize: 13 }}>
      <h2 style={{ margin: '0 0 10px' }}>썸네일 캡처 확인 · {schema.title}</h2>
      {state.error && (
        <div data-testid="thumb-error" style={{ color: 'var(--bs-danger)' }}>
          실패: {state.error}
        </div>
      )}
      {state.url && (
        <>
          <div data-testid="thumb-ok">
            성공 · {state.size} bytes · {state.ms} ms
          </div>
          <img src={state.url} alt="thumbnail" style={{ border: '1px solid #ccc', marginTop: 10 }} />
        </>
      )}
      {!state.url && !state.error && <div>캡처 중…</div>}
    </div>
  );
}
