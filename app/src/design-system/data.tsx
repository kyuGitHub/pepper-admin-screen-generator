import type { CSSProperties, ReactNode } from 'react';
import { Input } from './Input';

// Ports of components/data/{Panel,FieldTable}.jsx.

export interface PanelProps {
  title?: ReactNode;
  titleSize?: 'md' | 'lg';
  meta?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  padding?: number;
  fill?: boolean;
  style?: CSSProperties;
}

export function Panel({ title, titleSize = 'md', meta, actions, children, padding = 15, fill = false, style }: PanelProps) {
  return (
    <section
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        padding,
        background: '#fff',
        boxSizing: 'border-box',
        height: fill ? '100%' : 'auto',
        ...style,
      }}
    >
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: titleSize === 'lg' ? 15 : 10 }}>
          {title && (
            <h6 style={{ margin: 0, fontSize: titleSize === 'lg' ? 18 : 16, fontWeight: 700, lineHeight: 1.2, color: 'var(--pp-gray-900)' }}>{title}</h6>
          )}
          {meta && <span style={{ fontSize: 12 }}>{meta}</span>}
          {actions && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * A FieldTable cell. Either a label/value pair (`label` + `value` | `render`, optionally spanning
 * `span` label/value pairs) or a raw cell (`raw` + `colSpan`) used for blanks and notes.
 */
export type FieldTableCell =
  | {
      label?: ReactNode;
      value?: string;
      render?: ReactNode;
      span?: number;
      align?: 'left' | 'right';
      labelAlign?: CSSProperties['verticalAlign'];
      editable?: boolean;
    }
  | { raw: ReactNode; colSpan?: number; rowSpan?: number };

export interface FieldTableProps {
  rows?: FieldTableCell[][];
  columns?: number;
  labelWidth?: string;
  valueWidth?: string;
  variant?: 'borderless' | 'bordered';
  /** Label cell text alignment (edit modals use right). */
  labelAlign?: 'left' | 'right';
  style?: CSSProperties;
}

export function FieldTable({ rows = [], columns = 4, labelWidth, valueWidth, variant = 'borderless', labelAlign = 'left', style }: FieldTableProps) {
  const lw = labelWidth ?? (columns === 4 ? '10%' : columns === 3 ? '11%' : columns === 2 ? '20%' : '15%');
  const vw = valueWidth ?? (columns === 4 ? '15%' : columns === 3 ? '22.33%' : columns === 2 ? '30%' : '85%');
  const bordered = variant === 'bordered';
  const cellPad = bordered ? 12 : '3px 5px';
  const bd = bordered ? '1px solid var(--border-default)' : 'none';
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: 12, color: 'var(--pp-gray-900)', ...style }}>
      <colgroup>
        {Array.from({ length: columns }).flatMap((_, i) => [<col key={`l${i}`} style={{ width: lw }} />, <col key={`v${i}`} style={{ width: vw }} />])}
      </colgroup>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri}>
            {r.flatMap((c, ci) => {
              if ('raw' in c)
                return [
                  <td key={ci} colSpan={c.colSpan} rowSpan={c.rowSpan} style={{ padding: cellPad, border: bd, verticalAlign: 'middle' }}>
                    {c.raw}
                  </td>,
                ];
              const span = c.span ? c.span * 2 - 1 : 1;
              return [
                <th
                  key={`h${ci}`}
                  style={{
                    padding: cellPad,
                    border: bd,
                    textAlign: labelAlign,
                    fontWeight: 700,
                    color: 'var(--pp-gray-800)',
                    lineHeight: 1.2,
                    verticalAlign: c.labelAlign || 'middle',
                  }}
                >
                  {c.label}
                </th>,
                <td key={`d${ci}`} colSpan={span} style={{ padding: cellPad, border: bd, verticalAlign: 'middle' }}>
                  {c.render ??
                    (c.label === undefined ? null : (
                      <Input value={c.value ?? ''} readOnly={!c.editable} align={c.align} style={{ display: 'block', width: '100%' }} onChange={() => {}} />
                    ))}
                </td>,
              ];
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
