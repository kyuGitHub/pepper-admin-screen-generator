import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

/* Generator design system — React port of the Gen* components from the "화면 제너레이터 UI kit"
   (Claude Design, 2026-10-28). Dark workspace, IBM Plex Sans KR / Mono, editor-blue accent.
   The admin screens the generator renders keep the Digital Admin design system (src/design-system). */

const H = { sm: 24, md: 28, lg: 36 } as const;
export type GenSize = keyof typeof H;
export type GenVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/* ---------------------------------------------------------------- controls */

export interface GenButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: GenVariant;
  size?: GenSize;
  block?: boolean;
  style?: CSSProperties;
}

export function GenButton({ variant = 'secondary', size = 'md', disabled = false, type = 'button', children, style, block, ...rest }: GenButtonProps) {
  const [h, setH] = useState(false);
  const on = h && !disabled;
  const v: Record<GenVariant, CSSProperties> = {
    primary: { background: on ? 'var(--gen-accent-hover)' : 'var(--gen-accent)', color: '#fff', borderColor: 'transparent' },
    secondary: {
      background: on ? 'var(--gen-hover)' : 'var(--gen-control)',
      color: 'var(--gen-text)',
      borderColor: on ? 'var(--gen-border-hover)' : 'var(--gen-border-control)',
    },
    ghost: { background: on ? 'var(--gen-hover)' : 'transparent', color: on ? 'var(--gen-text)' : 'var(--gen-text-sub)', borderColor: 'transparent' },
    danger: { background: on ? 'rgba(240,82,95,.24)' : 'var(--gen-danger-soft)', color: 'var(--gen-danger)', borderColor: 'transparent' },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: H[size],
        padding: size === 'sm' ? '0 8px' : size === 'lg' ? '0 16px' : '0 12px',
        border: '1px solid',
        borderRadius: 6,
        fontFamily: 'var(--gen-font-ui)',
        fontSize: size === 'lg' ? 14 : 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background .12s, border-color .12s, color .12s',
        boxSizing: 'border-box',
        ...v[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

const fieldFrame = (f: boolean, invalid?: boolean, readOnly?: boolean): CSSProperties => ({
  background: readOnly ? 'var(--gen-bg-2)' : 'var(--gen-control)',
  color: readOnly ? 'var(--gen-text-sub)' : 'var(--gen-text)',
  border: `1px solid ${invalid ? 'var(--gen-danger)' : f ? 'var(--gen-accent)' : 'var(--gen-border-control)'}`,
  boxShadow: f ? 'var(--gen-focus-ring)' : 'none',
  borderRadius: 6,
  fontFamily: 'var(--gen-font-ui)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .12s, box-shadow .12s',
});

export interface GenInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'width'> {
  size?: GenSize;
  width?: number | string;
  invalid?: boolean;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

export function GenInput({ size = 'md', width = '100%', invalid, readOnly, style, inputStyle, onFocus, onBlur, ...rest }: GenInputProps) {
  const [f, setF] = useState(false);
  return (
    <span style={{ display: 'inline-block', width, verticalAlign: 'middle', ...style }}>
      <input
        readOnly={readOnly}
        onFocus={(e) => {
          setF(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setF(false);
          onBlur?.(e);
        }}
        style={{ width: '100%', height: H[size], padding: '0 10px', fontSize: size === 'lg' ? 14 : 12, ...fieldFrame(f, invalid, readOnly), ...inputStyle }}
        {...rest}
      />
    </span>
  );
}

export type GenOption = string | { value: string; label: string };

export interface GenSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'style' | 'width'> {
  options?: GenOption[];
  size?: GenSize;
  width?: number | string;
  invalid?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
}

export function GenSelect({ options = [], size = 'md', width = '100%', invalid, readOnly, style, onFocus, onBlur, ...rest }: GenSelectProps) {
  const [f, setF] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block', width, verticalAlign: 'middle', ...style }}>
      <select
        onFocus={(e) => {
          setF(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setF(false);
          onBlur?.(e);
        }}
        style={{
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
          height: H[size],
          padding: '0 26px 0 10px',
          fontSize: size === 'lg' ? 14 : 12,
          ...fieldFrame(f, invalid, readOnly),
        }}
        {...rest}
      >
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return (
            <option key={v} value={v} style={{ background: '#1d1e22', color: '#ececef' }}>
              {l}
            </option>
          );
        })}
      </select>
      <span
        style={{
          position: 'absolute',
          right: 9,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 10,
          color: 'var(--gen-text-hint)',
          pointerEvents: 'none',
        }}
      >
        ▾
      </span>
    </span>
  );
}

export interface GenTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  mono?: boolean;
  style?: CSSProperties;
}

export function GenTextarea({ rows = 3, mono = false, style, onFocus, onBlur, ...rest }: GenTextareaProps) {
  const [f, setF] = useState(false);
  return (
    <textarea
      rows={rows}
      spellCheck={false}
      onFocus={(e) => {
        setF(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setF(false);
        onBlur?.(e);
      }}
      style={{
        display: 'block',
        width: '100%',
        padding: '7px 10px',
        fontSize: 12,
        lineHeight: 1.6,
        resize: 'vertical',
        ...fieldFrame(f),
        fontFamily: mono ? 'var(--gen-font-mono)' : 'var(--gen-font-ui)',
        ...style,
      }}
      {...rest}
    />
  );
}

export function GenCheckbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  style,
}: {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange?.(!on);
  };
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: 'var(--gen-font-ui)',
        fontSize: 12,
        color: 'var(--gen-text)',
        userSelect: 'none',
        ...style,
      }}
    >
      <input type="checkbox" checked={on} readOnly disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span
        style={{
          width: 16,
          height: 16,
          flexShrink: 0,
          borderRadius: 4,
          boxSizing: 'border-box',
          border: `1px solid ${on ? 'var(--gen-accent)' : 'var(--gen-border-hover)'}`,
          background: on ? 'var(--gen-accent)' : 'var(--gen-control)',
          color: '#fff',
          fontSize: 11,
          lineHeight: '14px',
          textAlign: 'center',
          fontWeight: 700,
        }}
      >
        {on ? '✓' : ''}
      </span>
      {label}
    </label>
  );
}

/** Code / JSON / prompt text box on the canvas colour, monospace. */
export function GenCodeArea({
  value,
  onChange,
  readOnly,
  placeholder,
  height = 260,
  size = 'md',
  style,
  ...rest
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: number | string;
  size?: 'sm' | 'md';
  style?: CSSProperties;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'style'>) {
  const [f, setF] = useState(false);
  return (
    <textarea
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      spellCheck={false}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        display: 'block',
        width: '100%',
        height,
        padding: 12,
        border: `1px solid ${f && !readOnly ? 'var(--gen-accent)' : 'var(--gen-border)'}`,
        borderRadius: 8,
        background: 'var(--gen-canvas)',
        color: 'var(--gen-fg-code)',
        fontFamily: 'var(--gen-font-mono)',
        fontSize: size === 'sm' ? 11 : 12,
        lineHeight: 1.6,
        resize: 'vertical',
        outline: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    />
  );
}

/* ---------------------------------------------------------------- page, toolbar, chrome */

/** Full-height generator page shell: app background, UI font. */
export function GenPage({ children, style, fullHeight = false }: { children: ReactNode; style?: CSSProperties; fullHeight?: boolean }) {
  return (
    <div className="gen-root" style={{ ...(fullHeight ? { height: '100vh', display: 'flex', flexDirection: 'column' } : { minHeight: '100vh' }), ...style }}>
      {children}
    </div>
  );
}

export function GenToolbar({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="gen-root"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 44,
        padding: '0 12px',
        borderBottom: '1px solid var(--gen-border)',
        fontSize: 13,
        flexShrink: 0,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function GenBrand() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap', padding: '0 4px' }}>
      <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>화면 제너레이터</span>
      <span style={{ fontFamily: 'var(--gen-font-mono)', fontSize: 11, color: 'var(--gen-text-hint)' }}>for Digital Admin</span>
    </span>
  );
}

const vbar: CSSProperties = { width: 1, height: 18, background: 'var(--gen-border-control)', flexShrink: 0 };

export function GenToolbarHeading({ onBack, title, meta }: { onBack?: () => void; title?: ReactNode; meta?: ReactNode }) {
  return (
    <>
      {onBack && (
        <GenButton variant="ghost" size="sm" onClick={onBack}>
          ← 목록
        </GenButton>
      )}
      {onBack && <span style={vbar} />}
      <GenBrand />
      {title && <span style={vbar} />}
      {title && <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{title}</span>}
      {meta && (
        <span
          style={{
            fontFamily: 'var(--gen-font-mono)',
            fontSize: 11,
            color: 'var(--gen-text-sub)',
            background: 'var(--gen-control)',
            borderRadius: 4,
            padding: '2px 6px',
            whiteSpace: 'nowrap',
          }}
        >
          {meta}
        </span>
      )}
    </>
  );
}

export function GenToolbarButton({
  tone = 'outline',
  style,
  ...rest
}: Omit<GenButtonProps, 'variant' | 'size'> & { tone?: 'outline' | 'primary' | 'invert' | 'ghost' | 'danger' }) {
  const variant: GenVariant = tone === 'invert' || tone === 'primary' ? 'primary' : tone === 'ghost' ? 'ghost' : tone === 'danger' ? 'danger' : 'secondary';
  return <GenButton variant={variant} size="sm" style={{ height: 28, padding: '0 10px', ...style }} {...rest} />;
}

export function GenModeBadge({ dirty = false, children }: { dirty?: boolean; children?: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginLeft: 6,
        height: 22,
        padding: '0 9px',
        borderRadius: 11,
        background: dirty ? 'var(--gen-warn-soft)' : 'var(--gen-accent-soft)',
        color: dirty ? 'var(--gen-warn)' : 'var(--gen-accent-text)',
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 3, background: 'currentColor' }} />
      {children ?? (dirty ? '편집 중 · 저장 안 됨' : '편집 모드')}
    </span>
  );
}

export interface GenMenuItem {
  label: string;
  hint?: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}

/** Toolbar dropdown: closes on select, outside click or Esc. `busy` replaces the label while something runs. */
export function GenMenu({ label, items, busy, toast }: { label: string; items: (GenMenuItem | 'divider')[]; busy?: string; toast?: string }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
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
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {toast && <span style={{ fontSize: 12, color: 'var(--gen-ok)' }}>✓ {toast}</span>}
      <div ref={ref} style={{ position: 'relative' }}>
        <GenButton
          size="sm"
          onClick={() => setOpen((o) => !o)}
          disabled={!!busy}
          style={{ height: 28, padding: '0 10px', ...(open ? { borderColor: 'var(--gen-accent)' } : {}) }}
        >
          {busy ?? label}
          {!busy && <span style={{ fontSize: 10, color: 'var(--gen-text-hint)' }}>▾</span>}
        </GenButton>
        {open && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              right: 0,
              top: 34,
              minWidth: 248,
              background: 'var(--gen-surface)',
              color: 'var(--gen-text)',
              border: '1px solid var(--gen-border-control)',
              borderRadius: 8,
              boxShadow: 'var(--gen-shadow-menu)',
              padding: 4,
              zIndex: 50,
              fontFamily: 'var(--gen-font-ui)',
            }}
          >
            {items.map((it, i) =>
              it === 'divider' ? (
                <div key={i} style={{ height: 1, background: 'var(--gen-border)', margin: '4px 0' }} />
              ) : (
                <button
                  key={i}
                  type="button"
                  role="menuitem"
                  disabled={it.disabled}
                  onMouseEnter={() => setHi(i)}
                  onMouseLeave={() => setHi(-1)}
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
                    background: hi === i && !it.disabled ? 'var(--gen-hover)' : 'none',
                    font: 'inherit',
                    fontSize: 12,
                    color: it.danger ? 'var(--gen-danger)' : it.disabled ? 'var(--gen-text-hint)' : 'inherit',
                    cursor: it.disabled ? 'default' : 'pointer',
                    borderRadius: 5,
                  }}
                >
                  {it.label}
                  {it.hint && <span style={{ display: 'block', fontSize: 11, marginTop: 1, color: 'var(--gen-text-hint)' }}>{it.hint}</span>}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </span>
  );
}

/* ---------------------------------------------------------------- content */

export function GenTag({ kind = 'area', children }: { kind?: 'area' | 'pattern'; children: ReactNode }) {
  const a = kind === 'area';
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: a ? 600 : 500,
        color: a ? 'var(--gen-accent-text)' : 'var(--gen-text-sub)',
        background: a ? 'var(--gen-accent-soft)' : 'var(--gen-control)',
        borderRadius: 4,
        padding: '2px 7px',
        whiteSpace: 'nowrap',
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  );
}

export function GenScreenCard({
  title,
  area,
  pattern,
  updatedAt,
  author,
  thumbnail,
  onOpen,
  onDuplicate,
  onDelete,
}: {
  title: string;
  area: string;
  pattern: string;
  updatedAt: string;
  author?: string | null;
  thumbnail?: string | null;
  onOpen: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const [h, setH] = useState(false);
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: 'var(--gen-surface)',
        border: `1px solid ${h ? 'var(--gen-border-hover)' : 'var(--gen-border)'}`,
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--gen-text)',
        transition: 'border-color .12s',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
        aria-label={`${title} 열기`}
        style={{
          padding: 10,
          background: 'var(--gen-canvas)',
          backgroundImage: 'radial-gradient(#26282d 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          borderBottom: '1px solid var(--gen-border)',
          cursor: 'pointer',
        }}
      >
        <div style={{ aspectRatio: '1860 / 1100', overflow: 'hidden', borderRadius: 3, background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.45)' }}>
          {thumbnail ? (
            <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: 'var(--gen-text-hint)',
                background: 'var(--gen-bg-2)',
              }}
            >
              미리보기 없음
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '12px 14px 12px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <GenTag kind="area">{area}</GenTag>
          <GenTag kind="pattern">{pattern}</GenTag>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onOpen();
          }}
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--gen-text)', textDecoration: 'none', lineHeight: 1.4 }}
        >
          {title}
        </a>
        <div style={{ fontSize: 11, color: 'var(--gen-text-hint)', marginTop: 'auto', fontFamily: 'var(--gen-font-mono)' }}>
          {updatedAt} · {author || '-'}
        </div>
        <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
          <GenButton size="sm" onClick={onOpen}>
            열기
          </GenButton>
          {onDuplicate && (
            <GenButton size="sm" onClick={onDuplicate}>
              복제
            </GenButton>
          )}
          {onDelete && (
            <GenButton size="sm" variant="ghost" onClick={onDelete} style={{ marginLeft: 'auto', color: 'var(--gen-danger)' }}>
              삭제
            </GenButton>
          )}
        </div>
      </div>
    </article>
  );
}

export function GenEmptyState({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ padding: 60, textAlign: 'center', color: 'var(--gen-text-sub)', fontSize: 13, border: '1px dashed var(--gen-border-control)', borderRadius: 10 }}
    >
      {children}
    </div>
  );
}

export function GenStepItem({ n, title, children }: { n: number; title: ReactNode; children: ReactNode }) {
  return (
    <li
      style={{
        display: 'flex',
        gap: 14,
        background: 'var(--gen-surface)',
        border: '1px solid var(--gen-border)',
        borderRadius: 10,
        padding: '14px 16px',
        listStyle: 'none',
        fontSize: 13,
        lineHeight: 1.7,
        color: 'var(--gen-text)',
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          background: 'var(--gen-accent-soft)',
          color: 'var(--gen-accent-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--gen-font-mono)',
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {String(n).padStart(2, '0')}
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ color: 'var(--gen-text-sub)' }}>{children}</div>
      </div>
    </li>
  );
}

/** Surface card used for page sections (요청서, 생성). `n` prints a mono "01" marker before the title. */
export function GenSection({
  n,
  title,
  lead,
  children,
  style,
}: {
  n?: string;
  title?: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section style={{ background: 'var(--gen-surface)', border: '1px solid var(--gen-border)', borderRadius: 10, padding: 20, ...style }}>
      {title && (
        <h1 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 600 }}>
          {n && <span style={{ fontFamily: 'var(--gen-font-mono)', color: 'var(--gen-accent-text)', marginRight: 8 }}>{n}</span>}
          {title}
        </h1>
      )}
      {lead && <p style={{ margin: '0 0 18px', fontSize: 12, color: 'var(--gen-text-sub)', lineHeight: 1.7 }}>{lead}</p>}
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- auth */

export function GenCenterCard({ title, width = 400, children, fullPage = true }: { title: string; width?: number; children: ReactNode; fullPage?: boolean }) {
  return (
    <div
      className="gen-root"
      style={{
        minHeight: fullPage ? '100vh' : 0,
        padding: fullPage ? 0 : 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gen-canvas)',
        backgroundImage: 'radial-gradient(#26282d 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width,
          maxWidth: '100%',
          background: 'var(--gen-surface)',
          border: '1px solid var(--gen-border)',
          borderRadius: 12,
          padding: 32,
          boxSizing: 'border-box',
          boxShadow: 'var(--gen-shadow-dialog)',
        }}
      >
        <h1 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 600, color: 'var(--gen-text)', letterSpacing: '-0.01em' }}>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export function GenField({ label, children, required, style }: { label: ReactNode; children: ReactNode; required?: boolean; style?: CSSProperties }) {
  return (
    <label style={{ display: 'block', marginBottom: 14, fontFamily: 'var(--gen-font-ui)', ...style }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gen-text-sub)', marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: 'var(--gen-danger)' }}> *</span>}
      </div>
      {children}
    </label>
  );
}

export function GenErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <div style={{ color: 'var(--gen-danger)', fontSize: 12, margin: '6px 0 12px', whiteSpace: 'pre-wrap', fontFamily: 'var(--gen-font-ui)' }}>{children}</div>
  );
}

/* ---------------------------------------------------------------- editor */

/** Dot-grid canvas with the admin screen in a fixed 1860×1100 frame. */
export function GenCanvas({
  label,
  meta,
  width = 1860,
  height = 1100,
  onBackgroundClick,
  children,
  style,
}: {
  label?: ReactNode;
  meta?: ReactNode;
  width?: number;
  height?: number;
  onBackgroundClick?: (e: React.MouseEvent) => void;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      onClick={onBackgroundClick}
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: 'auto',
        background: 'var(--gen-canvas)',
        backgroundImage: 'radial-gradient(#26282d 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        padding: '28px 40px 48px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ width, margin: '0 auto' }}>
        {(label || meta) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
              fontFamily: 'var(--gen-font-ui)',
              fontSize: 12,
              color: 'var(--gen-text-sub)',
            }}
          >
            {label}
            <span style={{ fontFamily: 'var(--gen-font-mono)', fontSize: 11, color: 'var(--gen-text-hint)' }}>{meta ?? `${width} × ${height}`}</span>
          </div>
        )}
        <div className="gen-frame" style={{ width, height, overflow: 'hidden', background: '#fff', boxShadow: 'var(--gen-shadow-frame)', borderRadius: 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function GenPropertyPanel({
  title = '속성',
  subtitle,
  onClear,
  children,
  style,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  onClear?: () => void;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <aside
      data-testid="property-panel"
      className="gen-root"
      style={{
        width: 320,
        flexShrink: 0,
        borderLeft: '1px solid var(--gen-border)',
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        ...style,
      }}
    >
      <div
        style={{
          height: 40,
          padding: '0 8px 0 14px',
          borderBottom: '1px solid var(--gen-border)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {title}
        {subtitle && (
          <span
            style={{
              fontWeight: 500,
              fontSize: 11,
              color: 'var(--gen-accent-text)',
              background: 'var(--gen-accent-soft)',
              borderRadius: 4,
              padding: '1px 6px',
            }}
          >
            {subtitle}
          </span>
        )}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            style={{
              marginLeft: 'auto',
              border: 0,
              background: 'none',
              cursor: 'pointer',
              color: 'var(--gen-text-hint)',
              font: 'inherit',
              fontSize: 12,
              padding: '4px 6px',
            }}
          >
            선택 해제
          </button>
        )}
      </div>
      <div style={{ padding: 14, overflow: 'auto', flex: 1 }}>{children}</div>
    </aside>
  );
}

export function GenPropRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div style={{ width: 72, flexShrink: 0, color: 'var(--gen-text-hint)', fontSize: 12 }}>{label}</div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

export function GenPropGroup({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--gen-border)' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gen-text-sub)', marginBottom: 8, letterSpacing: '.02em' }}>{title}</div>
      {children}
    </div>
  );
}

export function GenPropActions({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{children}</div>;
}

export function GenPropHint({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ color: 'var(--gen-text-hint)', lineHeight: 1.7, ...style }}>{children}</div>;
}

/* ---------------------------------------------------------------- feedback */

export function GenDialog({
  open = true,
  title,
  width = 760,
  onClose,
  footer,
  children,
  inline = false,
}: {
  open?: boolean;
  title: ReactNode;
  width?: number;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
  inline?: boolean;
}) {
  if (!open) return null;
  const panel = (
    <div
      role="dialog"
      className="gen-root"
      onClick={(e) => e.stopPropagation()}
      style={{
        width,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: inline ? undefined : 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--gen-surface)',
        border: '1px solid var(--gen-border-control)',
        borderRadius: 12,
        boxShadow: 'var(--gen-shadow-dialog)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', height: 52, padding: '0 12px 0 20px', borderBottom: '1px solid var(--gen-border)', flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
        <GenButton
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="닫기"
          style={{ marginLeft: 'auto', width: 28, height: 28, padding: 0, fontSize: 16 }}
        >
          ×
        </GenButton>
      </div>
      <div style={{ padding: 20, overflow: 'auto', flex: 1 }}>{children}</div>
      {footer && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 20px', borderTop: '1px solid var(--gen-border)', flexShrink: 0 }}>
          {footer}
        </div>
      )}
    </div>
  );
  if (inline) return panel;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5,6,8,.66)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {panel}
    </div>
  );
}
