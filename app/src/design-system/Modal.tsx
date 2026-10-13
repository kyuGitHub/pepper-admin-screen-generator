import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

// Port of components/feedback/Modal.jsx.
export interface ModalProps {
  open?: boolean;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  width?: number | string;
  inline?: boolean;
  style?: CSSProperties;
}

export function Modal({ open = true, title, children, footer, onClose, width = '90%', inline = false, style }: ModalProps) {
  if (!open) return null;
  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 800,
        width,
        maxWidth: 1000,
        maxHeight: 'calc(100% - 3.5rem)',
        background: '#fff',
        borderRadius: 14,
        boxShadow: 'var(--shadow-modal)',
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        color: 'var(--pp-gray-900)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 0 20px', borderBottom: '1px solid var(--border-divider)' }}>
        <h5 style={{ margin: 0, padding: '5px 0', fontSize: 20, fontWeight: 700, lineHeight: 1.5 }}>{title}</h5>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          style={{ minWidth: 40, minHeight: 40, border: 0, background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="close" size={14} color="#93949a" />
        </button>
      </div>
      <div style={{ padding: '20px 20px 0', overflowY: 'auto', flex: 1 }}>{children}</div>
      {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, padding: '20px 20px 30px' }}>{footer}</div>}
    </div>
  );
  if (inline) return dialog;
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--backdrop-modal)' }}
    >
      {dialog}
    </div>
  );
}
