import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/* Generator-only UI pieces. The admin screens themselves use the design-system components;
   these wrap them in a thin navy toolbar and a centred card so the tool is visibly not an admin page. */

export const toolbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  height: 40,
  padding: '0 16px',
  background: 'var(--pp-navy-800)',
  color: '#fff',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  flexShrink: 0,
};

export function Toolbar({ children }: { children: ReactNode }) {
  return <div style={toolbarStyle}>{children}</div>;
}

export function Brand() {
  return (
    <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.2 }}>
      화면 제너레이터 <span style={{ fontWeight: 400, color: 'var(--pp-gray-450)', marginLeft: 6 }}>Digital Admin</span>
    </span>
  );
}

export function CenterCard({ title, children, width = 400 }: { title: string; children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--pp-gray-80)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ width, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, padding: 30 }}>
        <h1 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: 'var(--pp-gray-900)' }}>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--pp-gray-800)', marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <div style={{ color: 'var(--bs-danger)', fontSize: 12, margin: '6px 0 12px', whiteSpace: 'pre-wrap' }}>{children}</div>;
}

export const inputStyle: CSSProperties = { display: 'block', width: '100%' };
export const inputInner: CSSProperties = { height: 34, fontSize: 13 };

export interface MenuItem {
  label: string;
  hint?: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}

/** Toolbar dropdown: a trigger button and a list of actions; closes on select, outside click or Esc. */
export function Menu({ label, items, busy }: { label: string; items: (MenuItem | 'divider')[]; busy?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={!!busy}
        style={{
          height: 26,
          padding: '0 10px',
          border: '1px solid var(--pp-navy-300)',
          borderRadius: 4,
          background: 'transparent',
          color: '#fff',
          font: 'inherit',
          fontSize: 12,
          cursor: busy ? 'default' : 'pointer',
        }}
      >
        {busy ?? label} {busy ? '' : '▾'}
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            right: 0,
            top: 30,
            minWidth: 220,
            background: '#fff',
            color: 'var(--pp-gray-900)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            boxShadow: '0 6px 20px rgba(0,0,0,.18)',
            padding: 4,
            zIndex: 50,
          }}
        >
          {items.map((it, i) =>
            it === 'divider' ? (
              <div key={i} style={{ height: 1, background: 'var(--pp-gray-150)', margin: '4px 0' }} />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                onClick={() => {
                  setOpen(false);
                  it.onSelect();
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '7px 10px',
                  border: 0,
                  background: 'none',
                  font: 'inherit',
                  fontSize: 12,
                  color: it.danger ? 'var(--bs-danger)' : it.disabled ? 'var(--pp-gray-400)' : 'inherit',
                  cursor: it.disabled ? 'default' : 'pointer',
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pp-gray-80)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                {it.label}
                {it.hint && <span style={{ display: 'block', fontSize: 11, color: 'var(--pp-gray-500)' }}>{it.hint}</span>}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
