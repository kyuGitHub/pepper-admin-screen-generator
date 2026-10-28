import { useState, type CSSProperties, type TextareaHTMLAttributes } from 'react';
import { fieldBase, fieldState } from './Input';

// Port of components/forms/Textarea.jsx.
export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  style?: CSSProperties;
}

export function Textarea({ rows = 3, readOnly, disabled, style, ...rest }: TextareaProps) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      className="pp-field"
      rows={rows}
      readOnly={readOnly}
      disabled={disabled}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{ ...fieldBase, height: 'auto', resize: 'vertical', ...fieldState({ focus, readOnly, disabled }), ...style }}
      {...rest}
    />
  );
}
