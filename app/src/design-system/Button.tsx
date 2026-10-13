import { useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';

// Port of components/core/Button.jsx (Pepper Digital Admin DS).
export type ButtonVariant = 'primary' | 'outline' | 'addon' | 'danger' | 'success-outline' | 'ghost';
export type ButtonSize = 'md' | 'lg' | 'sm' | 'icon';

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  boxSizing: 'border-box',
  minWidth: 54,
  minHeight: 24,
  padding: '2px 10px',
  lineHeight: 1.5,
  borderRadius: 4,
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  fontWeight: 400,
  border: '1px solid transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: 'var(--transition-btn)',
  textDecoration: 'none',
};

function look(variant: ButtonVariant, size: ButtonSize, hover: boolean, disabled: boolean): CSSProperties {
  const lg = size === 'lg';
  switch (variant) {
    case 'primary':
      return {
        border: 'none',
        background: disabled ? 'var(--pp-navy-100)' : hover ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)',
        color: '#fff',
      };
    case 'outline':
      if (lg)
        return disabled
          ? { border: '1px solid var(--pp-navy-100)', background: '#fff', color: 'var(--pp-navy-100)' }
          : {
              border: `1px solid ${hover ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)'}`,
              background: '#fff',
              color: hover ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)',
            };
      if (disabled)
        return { border: '1px solid var(--pp-navy-200)', background: '#eee', color: 'var(--pp-navy-200)', fontWeight: 500 };
      return {
        border: `1px solid ${hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-350)'}`,
        background: '#fff',
        color: hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-700)',
        fontWeight: 500,
      };
    case 'addon':
      return {
        minWidth: 24,
        padding: '2px 5px',
        border: `1px solid ${hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-200)'}`,
        background: 'var(--pp-gray-40)',
        color: hover ? 'var(--pp-navy-800)' : 'var(--pp-gray-700)',
      };
    case 'danger':
      return {
        border: `1px solid ${hover ? '#bd2130' : 'var(--bs-danger)'}`,
        background: hover ? '#c82333' : 'var(--bs-danger)',
        color: '#fff',
        opacity: disabled ? 0.65 : 1,
      };
    case 'success-outline':
      return {
        border: '1px solid var(--bs-success)',
        background: hover ? 'var(--bs-success)' : '#fff',
        color: hover ? '#fff' : 'var(--bs-success)',
      };
    case 'ghost':
    default:
      return { background: 'transparent', color: '#212529' };
  }
}

const sizes: Record<ButtonSize, CSSProperties> = {
  md: {},
  lg: { minWidth: 100, minHeight: 40, padding: '6px 12px', fontSize: 16, fontWeight: 700 },
  sm: { minWidth: 24, minHeight: 24, padding: '0 2px', fontSize: 14 },
  icon: { minWidth: 24, minHeight: 24, padding: '2px 4px' },
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: CSSProperties;
}

export function Button({ variant = 'primary', size = 'md', disabled = false, children, style, type = 'button', ...rest }: ButtonProps) {
  const [hover, setHover] = useState(false);
  const h = hover && !disabled;
  const merged: CSSProperties = {
    ...base,
    ...sizes[size],
    ...look(variant, size, h, disabled),
    ...(size === 'lg' ? { fontWeight: 700 } : {}),
    ...(disabled ? { cursor: 'default' } : {}),
    ...style,
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={merged}
      {...rest}
    >
      {children}
    </button>
  );
}
