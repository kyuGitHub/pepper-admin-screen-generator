import { useState, type CSSProperties, type ReactNode } from 'react';

// Port of components/data/DataGrid.jsx — the rMateGridH5 "gridStyle" look (sticky header, zebra rows, hover).
export interface DataGridColumn<R = Record<string, unknown>> {
  key: string;
  label: ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: R, index: number) => ReactNode;
}

export interface DataGridProps<R extends Record<string, unknown>> {
  columns?: (DataGridColumn<R> | string)[];
  rows?: R[];
  height?: number | string;
  rowHeight?: number;
  headerHeight?: number;
  selectable?: boolean;
  sortable?: boolean;
  /** Table min-width; when wider than the box the grid scrolls sideways like rMate. */
  minWidth?: number;
  onRowClick?: (row: R, index: number) => void;
  /** Grey header row (#f6f6f6) as in the live admin grids; default is the white rMate theme header. */
  headerFill?: boolean;
  style?: CSSProperties;
}

export function DataGrid<R extends Record<string, unknown>>({
  columns = [],
  rows = [],
  height,
  rowHeight = 32,
  headerHeight = 40,
  selectable = true,
  sortable = true,
  minWidth,
  onRowClick,
  headerFill = false,
  style,
}: DataGridProps<R>) {
  const [hover, setHover] = useState(-1);
  const [sel, setSel] = useState(-1);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const cols = columns.map((c) => (typeof c === 'string' ? { key: c, label: c } : c));
  let data = rows.map((r, i) => ({ r, i }));
  if (sort)
    data = [...data].sort((a, b) => {
      const x = a.r[sort.key] as string | number;
      const y = b.r[sort.key] as string | number;
      return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
    });
  const fmt = (v: unknown) => (typeof v === 'number' ? v.toLocaleString('ko-KR') : (v as ReactNode));
  return (
    <div
      style={{
        height,
        overflow: 'auto',
        borderTop: '1px solid var(--pp-navy-300)',
        borderLeft: '1px solid var(--pp-gray-250)',
        borderRight: '1px solid var(--pp-gray-250)',
        borderBottom: '1px solid var(--pp-gray-250)',
        background: '#fff',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <table style={{ width: '100%', minWidth, borderCollapse: 'collapse', fontSize: 13, color: 'var(--pp-gray-900)' }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c.key}
                onClick={sortable ? () => setSort((s) => ({ key: c.key, dir: s && s.key === c.key ? (-s.dir as 1 | -1) : 1 })) : undefined}
                style={{
                  position: 'sticky',
                  top: 0,
                  height: headerHeight,
                  padding: '0 8px',
                  background: headerFill ? 'var(--pp-gray-60)' : '#fff',
                  borderBottom: '1px solid var(--border-grid)',
                  borderRight: '1px solid var(--border-grid)',
                  fontWeight: 400,
                  color: 'var(--text-grid-header)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  cursor: sortable ? 'pointer' : 'default',
                  width: c.width,
                }}
              >
                {c.label}
                {sort && sort.key === c.key ? (sort.dir > 0 ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(({ r, i }, vi) => {
            const bg = sel === i || hover === i ? 'var(--surface-row-hover)' : vi % 2 === 0 ? 'var(--surface-row-alt)' : '#fff';
            return (
              <tr
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
                onClick={() => {
                  if (selectable) setSel(i);
                  onRowClick?.(r, i);
                }}
                style={{ height: rowHeight, background: bg, cursor: onRowClick || selectable ? 'pointer' : 'default' }}
              >
                {cols.map((c) => (
                  <td
                    key={c.key}
                    style={{
                      padding: '0 8px',
                      borderBottom: '1px solid var(--border-grid)',
                      borderRight: '1px solid var(--border-grid)',
                      textAlign: c.align || 'center',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.render ? c.render(r[c.key], r, i) : fmt(r[c.key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
