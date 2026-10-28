import { useState, type CSSProperties, type ReactNode } from 'react';
import { Button, Checkbox, DataGrid, DateRange, Input, Select, Tabs, type DataGridColumn } from '../design-system';
import type { ActionSchema, BlockSchema, FilterSchema, GridColumnSchema, PanelSchema, TableRow } from '../schema/types';
import { ActionButton, Blocks } from './PanelView';
import { useScreen } from './runtime';
import { resolveText } from './text';

/* Blocks used by list screens and edit modals: filter bar, paged grid, collapsible chip, inner tabs, editor placeholder. */

export function SearchBarBlock({ block: b }: { block: Extract<BlockSchema, { type: 'searchBar' }> }) {
  const [open, setOpen] = useState(b.detailOpen ?? true);
  const row = (filters: FilterSchema[], extra?: ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
      {filters.map((f, i) => (
        <FilterControl key={i} filter={f} />
      ))}
      {extra}
    </div>
  );
  const actions = (b.actions ?? []).map((a, i) =>
    a.type === 'detailToggle' ? (
      <Button key={i} variant="outline" onClick={() => setOpen((o) => !o)}>
        {(a.label ?? '상세검색') + (open ? ' ^' : ' v')}
      </Button>
    ) : (
      <ActionButton key={i} action={a} />
    ),
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {row(b.rows[0] ?? [], <div style={{ display: 'flex', gap: 6, marginLeft: 6 }}>{actions}</div>)}
        {b.rightActions && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {b.rightActions.map((a, i) => (
              <ActionButton key={i} action={a} />
            ))}
          </div>
        )}
      </div>
      {b.rows.slice(1).map((r, i) => (
        <div key={i}>{row(r)}</div>
      ))}
      {open && b.detailRows?.map((r, i) => <div key={`d${i}`}>{row(r)}</div>)}
    </div>
  );
}

function FilterControl({ filter: f }: { filter: FilterSchema }) {
  switch (f.type) {
    case 'select':
      return <Select options={f.options} width={f.width ?? 130} />;
    case 'dateRange':
      return <DateRange defaultStart={f.start ?? ''} defaultEnd={f.end ?? ''} width={110} />;
    case 'text':
      return <Input placeholder={f.placeholder} width={f.width ?? 200} />;
    case 'checkbox':
      return <Checkbox label={f.label} defaultChecked={f.checked} />;
  }
}

const linkStyle: CSSProperties = { color: 'var(--pp-navy-500)', textDecoration: 'underline', cursor: 'pointer' };

export function GridBlock({ block: b }: { block: Extract<BlockSchema, { type: 'grid' }> }) {
  const { state, actions, templateCtx } = useScreen();
  const rows = state.tables[b.table] ?? [];
  const pageSize = b.pagination?.pageSize ?? rows.length;
  const [page, setPage] = useState(b.pagination?.page ?? 1);
  const totalPages = b.pagination?.totalPages ?? Math.max(1, Math.ceil(rows.length / pageSize));
  const open = (id?: string) => id && actions.openModal(id);

  const columns: DataGridColumn<TableRow>[] = b.columns.map((c) => ({
    key: c.key,
    label: c.label,
    width: c.width,
    align: c.align ?? (c.kind === 'link' || c.kind === 'text' ? 'left' : 'center'),
    render: (v, r, i) => renderCell(c, String(v ?? ''), r, i, open),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {b.countText && <div style={{ fontSize: 12 }}>{resolveText(b.countText, templateCtx)}</div>}
      <DataGrid columns={columns} rows={rows} height={b.height} minWidth={b.minWidth} selectable={false} sortable={false} headerFill />
      {b.pagination && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select options={(b.pagination.pageSizes ?? [10, 20, 50]).map(String)} defaultValue={String(pageSize)} width={64} />
          <Pager page={page} total={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}

function renderCell(c: GridColumnSchema, v: string, _r: TableRow, i: number, open: (id?: string) => void): ReactNode {
  switch (c.kind) {
    case 'no':
      return i + 1;
    case 'link':
      return (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            open(c.modal);
          }}
          style={linkStyle}
        >
          {v}
        </a>
      );
    case 'button':
      if (c.whenValue !== undefined && v !== c.whenValue) return null;
      return (
        <Button variant="outline" size="sm" style={{ fontSize: 12, padding: '0 6px' }} onClick={() => open(c.modal)}>
          {c.buttonLabel ?? v}
        </Button>
      );
    case 'buttons':
      return (
        <span style={{ display: 'inline-flex', gap: 4 }}>
          {(c.buttons ?? []).map((btn) => (
            <Button key={btn.label} variant="outline" size="sm" style={{ fontSize: 12, padding: '0 6px' }} onClick={() => open(btn.modal)}>
              {btn.label}
            </Button>
          ))}
        </span>
      );
    default: {
      const tone = c.tones ? (c.tones[v] ?? c.tones['*']) : undefined;
      return <span style={{ fontWeight: c.bold ? 700 : undefined, color: tone }}>{v}</span>;
    }
  }
}

function Pager({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const box = (label: string, target: number, on = false, disabled = false) => (
    <button
      key={label + target}
      type="button"
      disabled={disabled}
      onClick={() => onChange(target)}
      style={{
        minWidth: 24,
        height: 24,
        padding: '0 6px',
        border: on ? '1px solid var(--pp-navy-800)' : '1px solid transparent',
        borderRadius: 3,
        background: on ? 'var(--pp-navy-800)' : 'transparent',
        color: on ? '#fff' : disabled ? 'var(--pp-gray-300)' : 'var(--pp-gray-700)',
        fontSize: 12,
        fontWeight: on ? 700 : 400,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  );
  const pages = Array.from({ length: total }, (_, i) => i + 1).slice(Math.max(0, Math.min(page - 5, total - 10)), Math.max(10, page + 5));
  return (
    <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
      {box('«', 1, false, page === 1)}
      {box('‹', Math.max(1, page - 1), false, page === 1)}
      {pages.map((p) => box(String(p), p, p === page))}
      {box('›', Math.min(total, page + 1), false, page === total)}
      {box('»', total, false, page === total)}
    </div>
  );
}

export function CollapsibleBlock({ block: b, panel }: { block: Extract<BlockSchema, { type: 'collapsible' }>; panel?: PanelSchema }) {
  const [open, setOpen] = useState(b.open ?? true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 24,
          padding: '0 10px',
          border: 0,
          borderRadius: 3,
          background: 'var(--pp-navy-600)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {b.title} <span style={{ fontSize: 10 }}>{open ? '^' : 'v'}</span>
      </button>
      {open && (
        <div style={{ paddingTop: 10 }}>
          <Blocks blocks={b.blocks} panel={panel} gap={6} />
        </div>
      )}
    </div>
  );
}

export function TabsBlock({ block: b, panel }: { block: Extract<BlockSchema, { type: 'tabs' }>; panel?: PanelSchema }) {
  const [cur, setCur] = useState(b.items[0]?.label ?? '');
  const item = b.items.find((t) => t.label === cur) ?? b.items[0];
  return (
    <div>
      <Tabs items={b.items.map((t) => t.label)} value={cur} onChange={setCur} />
      <div style={{ paddingTop: 10 }}>{item && <Blocks blocks={item.blocks} panel={panel} gap={6} />}</div>
    </div>
  );
}

const TOOLS = ['B', 'I', 'U', 'T̶', 'x²', 'x₂', 'Tx', 'T', 'T', '◧', '◨', '≡', '≡', '⇤', '⇥', '≡', '≡', '≣', '≡', 'T', 'T', '┆'];

/** Rich-text editor stand-in: the toolbar strip and a bordered content area, nothing live. */
export function EditorBlock({ block: b }: { block: Extract<BlockSchema, { type: 'editor' }> }) {
  const tabStyle = (on: boolean): CSSProperties => ({
    padding: '1px 8px',
    fontSize: 11,
    color: on ? 'var(--pp-gray-900)' : 'var(--pp-gray-700)',
    fontWeight: on ? 700 : 400,
  });
  return (
    <div style={{ border: '1px solid var(--pp-gray-250)', borderRadius: 3, background: '#fff', fontSize: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 8px',
          background: 'var(--pp-gray-100)',
          borderBottom: '1px solid var(--pp-gray-250)',
        }}
      >
        <Select options={['기본글꼴']} width={90} style={{ height: 22, fontSize: 11 }} />
        <Select options={['10pt']} width={60} style={{ height: 22, fontSize: 11 }} />
        {TOOLS.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              fontSize: 12,
              color: 'var(--pp-gray-800)',
              fontWeight: 700,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ height: b.height ?? 180, padding: '10px 12px', overflow: 'auto', lineHeight: 1.7, color: 'var(--pp-gray-900)' }}>
        {(b.content ?? []).map((line, i) =>
          line.startsWith('- ') ? (
            <div key={i} style={{ paddingLeft: 28 }}>
              • {line.slice(2)}
            </div>
          ) : (
            <div key={i}>{line}</div>
          ),
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid var(--pp-gray-250)', background: 'var(--pp-gray-60)', padding: '2px 8px' }}>
        <span style={{ fontSize: 11, color: 'var(--pp-gray-700)', margin: '0 auto' }}>에디터 크기 조절</span>
        <span style={tabStyle(false)}>Editor</span>
        <span style={tabStyle(false)}>HTML</span>
        <span style={tabStyle(false)}>TEXT</span>
        <span style={tabStyle(true)}>Preview</span>
      </div>
    </div>
  );
}

export function ActionRowBlock({ block: b, panel }: { block: Extract<BlockSchema, { type: 'actionRow' }>; panel?: PanelSchema }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: b.align === 'right' ? 'flex-end' : 'flex-start' }}>
      {b.items.map((a: ActionSchema, i) => (
        <ActionButton key={i} action={a} panel={panel} />
      ))}
    </div>
  );
}
