import { useState, type CSSProperties, type ChangeEvent, type InputHTMLAttributes } from 'react';

// Port of components/forms/Input.jsx.
export const fieldBase: CSSProperties = {
  display: 'block',
  width: '100%',
  height: 24,
  padding: '3px 10px',
  border: '1px solid var(--pp-gray-200)',
  borderRadius: 4,
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--pp-gray-900)',
  background: '#fff',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out',
};

export function fieldState({ focus, readOnly, disabled, invalid }: { focus?: boolean; readOnly?: boolean; disabled?: boolean; invalid?: boolean }): CSSProperties {
  if (readOnly) return { background: 'var(--pp-gray-60)', borderColor: 'var(--pp-gray-60)' };
  if (disabled) return { background: 'var(--pp-gray-60)', color: 'var(--pp-gray-300)' };
  if (invalid) return { borderColor: 'var(--bs-danger)', boxShadow: focus ? '0 0 0 .2rem rgba(220,53,69,.25)' : 'none' };
  if (focus) return { borderColor: 'var(--pp-navy-800)', boxShadow: '0 0 0 .2rem rgba(0,123,255,.25)' };
  return {};
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'width' | 'value' | 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  invalid?: boolean;
  clearable?: boolean;
  align?: 'left' | 'right' | 'center';
  onChange?: (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
  width?: number | string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

export function Input({ value, defaultValue, placeholder, readOnly, disabled, invalid, clearable, align, onChange, width, style, inputStyle, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? '');
  const controlled = value !== undefined;
  const v = controlled ? value : inner;
  const set = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    if (!controlled) setInner(e.target.value);
    onChange?.(e);
  };
  const s: CSSProperties = {
    ...fieldBase,
    ...fieldState({ focus, readOnly, disabled, invalid }),
    textAlign: align || 'left',
    ...(clearable ? { paddingRight: 34 } : {}),
    ...inputStyle,
  };
  const input = (
    <input
      className="pp-field"
      value={v}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      onChange={set}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={s}
      {...rest}
    />
  );
  if (!clearable)
    return <span style={{ display: 'inline-block', width: width ?? style?.width ?? 'auto', verticalAlign: 'middle', ...style }}>{input}</span>;
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: width ?? 'auto', verticalAlign: 'middle', ...style }}>
      {input}
      {String(v).length > 0 && !readOnly && !disabled && (
        <button
          type="button"
          aria-label="clear"
          className="pp-img-clear"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => set({ target: { value: '' } })}
          style={{ position: 'absolute', top: 0, right: 0, width: 34, height: 24, border: 0, backgroundColor: 'transparent', cursor: 'pointer' }}
        />
      )}
    </span>
  );
}
