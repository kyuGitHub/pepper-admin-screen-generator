import { useState, type CSSProperties } from 'react';

// Port of components/navigation/Pills.jsx — the joined segmented toggle.
export type PillItem = string | { value: string; label: string };

export interface PillsProps {
  items?: PillItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'md' | 'sm';
  style?: CSSProperties;
}

export function Pills({ items = [], value, defaultValue, onChange, size = 'md', style }: PillsProps) {
  const list = items.map((it) => (typeof it === 'string' ? { value: it, label: it } : it));
  const [inner, setInner] = useState(defaultValue ?? list[0]?.value);
  const cur = value !== undefined ? value : inner;
  const sm = size === 'sm';
  return (
    <ul role="tablist" style={{ display: 'inline-flex', margin: 0, padding: 0, listStyle: 'none', overflow: 'hidden', verticalAlign: 'middle', ...style }}>
      {list.map((it, i) => {
        const on = it.value === cur;
        const first = i === 0;
        const last = i === list.length - 1;
        const nextOn = list[i + 1]?.value === cur;
        const bc = on ? 'var(--pp-navy-800)' : 'var(--pp-gray-350)';
        return (
          <li key={it.value} style={{ position: 'relative' }}>
            <a
              role="tab"
              aria-selected={on}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setInner(it.value);
                onChange?.(it.value);
              }}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                minWidth: sm ? 40 : 90,
                minHeight: sm ? 20 : 'auto',
                padding: sm ? '2px 12px' : '2px 15px',
                fontSize: 12,
                lineHeight: 1.5,
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                borderTop: `1px solid ${bc}`,
                borderBottom: `1px solid ${bc}`,
                borderLeft: first ? `1px solid ${bc}` : 'none',
                borderRight: last ? `1px solid ${bc}` : 'none',
                borderRadius: first && last ? 4 : first ? '4px 0 0 4px' : last ? '0 4px 4px 0' : 0,
                background: on ? 'var(--pp-navy-800)' : '#fff',
                color: on ? '#fff' : 'var(--pp-gray-700)',
                fontWeight: on ? 700 : 400,
              }}
            >
              {it.label}
            </a>
            {!last && !on && !nextOn && (
              <span style={{ position: 'absolute', zIndex: 2, top: '50%', right: 0, marginTop: -4, width: 1, height: 8, background: 'var(--pp-gray-350)' }} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
