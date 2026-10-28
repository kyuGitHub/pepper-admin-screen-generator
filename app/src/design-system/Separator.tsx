import type { CSSProperties } from 'react';

// Port of components/core/Separator.jsx.
export function Separator({ type = 'hyphen', style }: { type?: 'hyphen' | 'bar'; style?: CSSProperties }) {
  const s: CSSProperties =
    type === 'bar'
      ? { width: 1, height: 10, margin: '0 14px', background: 'var(--pp-gray-180)' }
      : { width: 8, height: 1, margin: '0 8px', background: 'var(--pp-gray-550)' };
  return <span aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...s, ...style }} />;
}
