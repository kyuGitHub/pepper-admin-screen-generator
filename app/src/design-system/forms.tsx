import { useState, type CSSProperties, type ChangeEvent, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Input, fieldBase, fieldState, type InputProps } from './Input';

// Ports of components/forms/{InputGroup,Select,ChoiceControl,Checkbox,Radio}.jsx.

export interface InputGroupProps {
  icon?: IconName;
  onAddonClick?: () => void;
  addon?: ReactNode;
  width?: number | string;
  inputProps?: InputProps;
  style?: CSSProperties;
}

export function InputGroup({ icon = 'calendar', onAddonClick, addon, width = 120, inputProps = {}, style }: InputGroupProps) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'stretch', verticalAlign: 'middle', ...style }}>
      <Input
        width={width}
        {...inputProps}
        inputStyle={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, ...(inputProps.inputStyle || {}) }}
      />
      <Button
        variant="addon"
        size="icon"
        onClick={onAddonClick}
        style={{ marginLeft: -1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, minWidth: 24 }}
      >
        {addon || <Icon name={icon} size={16} />}
      </Button>
    </span>
  );
}

export type SelectOption = string | { value: string; label: string };

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'style' | 'width' | 'onChange'> {
  options?: SelectOption[];
  width?: number | string;
  style?: CSSProperties;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ options = [], value, defaultValue, onChange, disabled, width, style, ...rest }: SelectProps) {
  const [focus, setFocus] = useState(false);
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <select
      className="pp-field"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        ...fieldBase,
        display: 'inline-block',
        width: width ?? 'auto',
        padding: '0 6px',
        verticalAlign: 'middle',
        ...fieldState({ focus, disabled }),
        ...style,
      }}
      {...rest}
    >
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

interface ChoiceProps {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  name?: string;
  inline?: boolean;
  style?: CSSProperties;
}

function ChoiceControl({ kind, label, checked, defaultChecked, disabled, onChange, name, inline = true, style }: ChoiceProps & { kind: 'checkbox' | 'radio' }) {
  const [inner, setInner] = useState(!!defaultChecked);
  const controlled = checked !== undefined;
  const on = controlled ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    const next = kind === 'radio' ? true : !on;
    if (!controlled) setInner(next);
    onChange?.(next);
  };
  const round = kind === 'radio';
  const boxBorder = on ? (disabled ? 'var(--pp-navy-500)' : 'var(--pp-navy-800)') : 'var(--pp-gray-350)';
  const boxBg = disabled && !on ? 'var(--pp-gray-150)' : '#fff';
  const img = on ? (round ? (disabled ? 'pp-img-radio-disabled' : 'pp-img-radio') : disabled ? 'pp-img-checked-disabled' : 'pp-img-checked') : '';
  return (
    <label
      role={kind}
      aria-checked={on}
      aria-disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      style={{
        position: 'relative',
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        minHeight: 18,
        paddingLeft: 24,
        marginRight: inline ? 10 : 0,
        fontSize: 12,
        lineHeight: 1.5,
        color: disabled ? 'var(--bs-secondary)' : 'var(--pp-gray-900)',
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none',
        verticalAlign: 'middle',
        ...style,
      }}
    >
      <input type={kind} name={name} checked={on} disabled={disabled} readOnly style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          marginTop: -9,
          width: 18,
          height: 18,
          boxSizing: 'border-box',
          border: `1px solid ${boxBorder}`,
          borderRadius: round ? '50%' : 2,
          background: boxBg,
        }}
      />
      {on && <span className={img} style={{ position: 'absolute', left: 0, top: '50%', marginTop: -9, width: 18, height: 18 }} />}
      {label}
    </label>
  );
}

export function Checkbox(props: ChoiceProps) {
  return <ChoiceControl kind="checkbox" {...props} />;
}

export function Radio(props: ChoiceProps) {
  return <ChoiceControl kind="radio" {...props} />;
}
