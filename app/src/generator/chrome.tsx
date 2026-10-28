import type { CSSProperties, ReactNode } from 'react';

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
