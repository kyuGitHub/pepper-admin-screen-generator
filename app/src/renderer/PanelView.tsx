import { useState, type CSSProperties, type ReactNode } from 'react';
import { Button, Checkbox, Datepicker, FieldTable, Icon, Input, Panel, Radio, Select, Textarea, type ButtonSize, type FieldTableCell } from '../design-system';
import { ActionRowBlock, CollapsibleBlock, EditorBlock, GridBlock, SearchBarBlock, TabsBlock } from './listBlocks';
import type { ActionSchema, BlockSchema, FieldCellSchema, FieldTableCellSchema, PanelSchema, TableColumnSchema } from '../schema/types';
import { isField, sectionOf } from './compile';
import { useScreen } from './runtime';
import { Selectable } from '../editor/EditorContext';
import type { Path } from '../editor/paths';
import { maskValue, resolveText } from './text';

const row = (kids: ReactNode) => <div style={{ display: 'flex', gap: 4 }}>{kids}</div>;

/** Renders one action button. `panel` is absent for toolbar actions. */
export function ActionButton({ action, panel, size, path }: { action: ActionSchema; panel?: PanelSchema; size?: ButtonSize; path?: Path }) {
  const inner = <ActionButtonInner action={action} panel={panel} size={size} />;
  return path ? (
    <Selectable kind="action" path={path} inline>
      {inner}
    </Selectable>
  ) : (
    inner
  );
}

function ActionButtonInner({ action, panel, size }: { action: ActionSchema; panel?: PanelSchema; size?: ButtonSize }) {
  const { state, actions, isFormDirty } = useScreen();
  switch (action.type) {
    case 'button':
      return (
        <Button variant={action.variant ?? 'outline'} size={size}>
          {action.label}
        </Button>
      );
    case 'edit':
      return (
        <Button variant="outline" size={size} disabled={!!state.editing} onClick={() => panel && actions.startEdit(panel)}>
          {action.label ?? '수정'}
        </Button>
      );
    case 'history':
      return (
        <Button variant={action.variant ?? 'outline'} size={size} onClick={() => actions.openHistory(panel ? sectionOf(panel) : '전체')}>
          {action.label ?? '변경이력조회'}
        </Button>
      );
    case 'modal':
      return (
        <Button variant={action.variant ?? 'outline'} size={size} onClick={() => actions.openModal(action.modal)}>
          {action.label}
        </Button>
      );
    case 'detailToggle':
      return null;
    case 'formSave':
      return (
        <Button variant="primary" size={size} disabled={!panel || !isFormDirty(panel)} onClick={() => panel && actions.saveForm(panel)}>
          {action.label ?? '저장'}
        </Button>
      );
  }
}

function PanelActions({ panel, path }: { panel: PanelSchema; path?: Path }) {
  const { state, actions } = useScreen();
  if (!panel.actions?.length) return null;
  if (state.editing === panel.id)
    return row(
      <>
        <Button variant="outline" size="sm" onClick={actions.cancelEdit}>
          취소
        </Button>
        <Button variant="primary" size="sm" onClick={() => actions.saveEdit(panel)}>
          저장
        </Button>
      </>,
    );
  return row(panel.actions.map((a, i) => <ActionButton key={i} action={a} panel={panel} size="sm" path={path && [...path, 'actions', i]} />));
}

export function PanelView({ panel, path }: { panel: PanelSchema; path?: Path }) {
  const { templateCtx } = useScreen();
  const view = (
    <Panel
      title={panel.title}
      meta={resolveText(panel.meta, templateCtx)}
      actions={panel.actions?.length ? <PanelActions panel={panel} path={path} /> : undefined}
    >
      <Blocks blocks={panel.blocks} panel={panel} gap={panel.blockGap ?? 6} path={path && [...path, 'blocks']} />
    </Panel>
  );
  return path ? (
    <Selectable kind="panel" path={path}>
      {view}
    </Selectable>
  ) : (
    view
  );
}

export function Blocks({ blocks, panel, gap = 6, path }: { blocks: BlockSchema[]; panel?: PanelSchema; gap?: number; path?: Path }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} panel={panel} path={path && [...path, i]} />
      ))}
    </div>
  );
}

const muted: CSSProperties = { fontSize: 12, color: '#707070' };

function BlockView({ block: b, panel, path }: { block: BlockSchema; panel?: PanelSchema; path?: Path }) {
  const { state, actions, templateCtx, isFormDirty } = useScreen();
  switch (b.type) {
    case 'fields':
      return <FieldsBlock block={b} panel={panel} path={path} />;
    case 'heading': {
      const meta = resolveText(b.meta, templateCtx);
      const node = (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 5px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#303030' }}>{resolveText(b.text, templateCtx)}</span>
          {meta && <span style={muted}>{meta}</span>}
        </div>
      );
      return path ? (
        <Selectable kind="block" path={path}>
          {node}
        </Selectable>
      ) : (
        node
      );
    }
    case 'divider':
      return <div style={{ borderTop: '1px solid #dee2e6', margin: b.tight ? '0 0 4px' : '8px 0 4px' }} />;
    case 'section':
      return b.separated === false ? (
        <Blocks blocks={b.blocks} panel={panel} gap={10} path={path && [...path, 'blocks']} />
      ) : (
        <div style={{ borderTop: '1px solid #dee2e6', marginTop: 15 }}>
          <div style={{ paddingTop: 12 }}>
            <Blocks blocks={b.blocks} panel={panel} gap={10} path={path && [...path, 'blocks']} />
          </div>
        </div>
      );
    case 'select':
      return (
        <div style={{ padding: '0 5px' }}>
          <Select options={b.options} width={b.width} />
        </div>
      );
    case 'table':
      return <TableBlock block={b} panel={panel} />;
    case 'totals':
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 30, fontSize: 12, padding: '0 10px' }}>
          {b.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontWeight: 700, color: '#505050' }}>{it.label}</span>
              <span style={{ fontWeight: 700 }}>{it.value}</span>
            </div>
          ))}
        </div>
      );
    case 'checklist':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 5px' }}>
          {b.items.map((label, i) => (
            <Checkbox key={i} label={label} checked={!!state.checked[b.id]?.[i]} onChange={(v) => actions.setChecked(b.id, i, v)} />
          ))}
        </div>
      );
    case 'controls':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 5px' }}>
          {b.items.map((c, i) => {
            if (c.type === 'radio') {
              const cur = state.radios[c.name] ?? c.defaultValue;
              return c.options.map((o) => (
                <Radio key={`${i}-${o.value}`} label={o.label} name={c.name} checked={cur === o.value} onChange={() => actions.setRadio(c.name, o.value)} />
              ));
            }
            if (c.type === 'select') return <Select key={i} options={c.options} width={c.width} />;
            return (
              <Button key={i} variant={c.variant ?? 'outline'} size="sm">
                {c.label}
              </Button>
            );
          })}
        </div>
      );
    case 'dirtyNotice':
      return panel && isFormDirty(panel) ? <div style={{ fontSize: 12, color: 'var(--pp-red-500, #df0024)', padding: '0 5px' }}>{b.text}</div> : null;
    case 'kvStrip':
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, auto minmax(0,1fr))',
            background: '#f6f6f6',
            borderTop: '1px solid #dee2e6',
            borderBottom: '1px solid #dee2e6',
            fontSize: 12,
          }}
        >
          {b.items.map((k, i) => [
            <span key={`l${i}`} style={{ padding: '7px 10px', fontWeight: 700, color: '#505050' }}>
              {k.label}
            </span>,
            <span key={`v${i}`} style={{ padding: '7px 10px', fontWeight: 700 }}>
              {k.value}
            </span>,
          ])}
        </div>
      );
    case 'kvTable': {
      const lbl: CSSProperties = { padding: '6px 10px', fontWeight: 700, color: '#505050', background: '#fafafa' };
      const val: CSSProperties = { padding: '6px 10px' };
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '32%' }} />
          </colgroup>
          <tbody>
            {b.rows.map(([l1, v1, l2, v2], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={lbl}>{l1}</td>
                <td style={val}>{v1}</td>
                <td style={lbl}>{l2}</td>
                <td style={val}>{v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    case 'searchBar':
      return <SearchBarBlock block={b} path={path} />;
    case 'grid':
      return <GridBlock block={b} path={path} />;
    case 'collapsible':
      return <CollapsibleBlock block={b} panel={panel} path={path} />;
    case 'tabs':
      return <TabsBlock block={b} panel={panel} path={path} />;
    case 'editor':
      return <EditorBlock block={b} />;
    case 'actionRow':
      return <ActionRowBlock block={b} panel={panel} path={path} />;
    case 'text':
      return <div style={{ ...(b.tone === 'muted' ? muted : { fontSize: 12 }), marginBottom: 8 }}>{b.text}</div>;
    case 'empty':
      return <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', ...muted }}>{b.text}</div>;
  }
}

/* ------------------------------------------------------------------ field tables */

function FieldsBlock({ block, panel, path }: { block: Extract<BlockSchema, { type: 'fields' }>; panel?: PanelSchema; path?: Path }) {
  const rows: FieldTableCell[][] = block.rows.map((r, ri) => r.map((c, ci) => toCell(c, panel, block.editable, path && [...path, 'rows', ri, ci])));
  return <FieldTable columns={block.columns} labelWidth={block.labelWidth} valueWidth={block.valueWidth} labelAlign={block.labelAlign} rows={rows} />;
}

function toCell(c: FieldTableCellSchema, panel?: PanelSchema, editable?: boolean, path?: Path): FieldTableCell {
  if ('blank' in c) return { raw: '', colSpan: c.blank * 2 };
  if ('note' in c) return { raw: <span style={{ fontSize: 12, color: '#707070', paddingLeft: 5 }}>{c.note}</span>, colSpan: (c.span ?? 1) * 2 };
  if ('buttons' in c)
    return {
      raw: (
        <div style={{ display: 'flex', gap: 4, justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start' }}>
          {c.buttons.map((a, i) => (
            <ActionButton key={i} action={a} panel={panel} size="sm" path={path && [...path, 'buttons', i]} />
          ))}
        </div>
      ),
      colSpan: (c.span ?? 1) * 2,
    };
  if (!isField(c)) return { raw: '' };
  const value = editable && !c.readOnly ? <EditableField field={c} /> : <FieldValue field={c} panel={panel} />;
  if (!path) return { label: c.label, span: c.span, render: value };
  return {
    label: (
      <Selectable kind="field" path={path} dataKey={c.key} inline>
        {c.label || <span style={{ color: 'var(--pp-gray-400)' }}>(라벨 없음)</span>}
      </Selectable>
    ),
    span: c.span,
    render: (
      <Selectable kind="field" path={path} dataKey={c.key}>
        {value}
      </Selectable>
    ),
  };
}

/** Live input for edit modals: local state only (the mock never saves it). */
function EditableField({ field: f }: { field: FieldCellSchema }) {
  const { state } = useScreen();
  const [v, setV] = useState(state.values[f.key] ?? '');
  const c = f.control;
  const full: CSSProperties = { display: 'block', width: '100%' };
  const addon = (icon: ReactNode) => (
    <Button variant="addon" size="icon" style={{ marginLeft: -1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flexShrink: 0 }}>
      {icon}
    </Button>
  );
  const withAddon = (input: ReactNode, icon: ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'stretch' }}>
      <div style={{ flex: 1, minWidth: 0 }}>{input}</div>
      {addon(icon)}
    </div>
  );
  const withButton = (node: ReactNode) =>
    f.button ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{node}</div>
        <Button variant={f.button.variant ?? 'outline'} size="sm" style={{ flexShrink: 0 }}>
          {f.button.label}
        </Button>
      </div>
    ) : (
      node
    );
  const text = (extra?: CSSProperties) => (
    <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={c?.type === 'text' ? c.placeholder : undefined} style={full} inputStyle={extra} />
  );
  if (c?.type === 'select') {
    const ph = c.placeholder ?? '선택하세요';
    return withButton(
      <Select options={[ph, ...c.options]} width="100%" style={full} value={v || ph} onChange={(e) => setV(e.target.value === ph ? '' : e.target.value)} />,
    );
  }
  if (c?.type === 'textarea') return withButton(<Textarea rows={c.rows ?? 3} value={v} onChange={(e) => setV(e.target.value)} style={full} />);
  if (c?.type === 'date') return withButton(<DateField value={v} onChange={setV} />);
  if (c?.type === 'file') return withButton(withAddon(text({ borderTopRightRadius: 0, borderBottomRightRadius: 0 }), <Icon name="search" size={14} />));
  if (c?.type === 'color')
    return withButton(
      withAddon(
        text({ borderTopRightRadius: 0, borderBottomRightRadius: 0 }),
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: 2,
            background: v ? `#${v.replace('#', '')}` : 'var(--pp-gray-300)',
            border: '1px solid var(--pp-gray-350)',
          }}
        />,
      ),
    );
  if (f.counter) {
    const bytes = f.counter.value ?? new TextEncoder().encode(v).length;
    return withButton(
      <div style={{ position: 'relative' }}>
        {text({ paddingRight: 90 })}
        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#707070', pointerEvents: 'none' }}>
          {bytes} / {f.counter.max} byte
        </span>
      </div>,
    );
  }
  if (f.unit)
    return withButton(
      <div style={{ position: 'relative' }}>
        {text({ paddingRight: f.unit.length > 1 ? 34 : 22, textAlign: 'right' })}
        <span style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#707070', pointerEvents: 'none' }}>
          {f.unit}
        </span>
      </div>,
    );
  return withButton(text());
}

/** Text input with a calendar addon that opens the design-system Datepicker. */
function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Input
            value={value}
            placeholder="YYYY-MM-DD"
            onChange={(e) => onChange(e.target.value)}
            style={{ display: 'block', width: '100%' }}
            inputStyle={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
        </div>
        <Button
          variant="addon"
          size="icon"
          onClick={() => setOpen((o) => !o)}
          style={{ marginLeft: -1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flexShrink: 0 }}
        >
          <Icon name="calendar" size={14} />
        </Button>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, zIndex: 1000 }}>
          <Datepicker
            value={value}
            onSelect={(s) => {
              onChange(s);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function FieldValue({ field: f, panel }: { field: FieldCellSchema; panel?: PanelSchema }) {
  const { state, actions, masked } = useScreen();
  const committed = state.values[f.key] ?? '';

  if (f.control?.type === 'select' && panel) {
    const placeholder = f.control.placeholder ?? '선택하세요';
    const cur = (panel && state.forms[panel.id]?.[f.key]) ?? committed;
    return (
      <Select
        options={[placeholder, ...f.control.options]}
        width="100%"
        style={{ display: 'block', width: '100%' }}
        value={cur || placeholder}
        onChange={(e) => panel && actions.setForm(panel.id, f.key, e.target.value === placeholder ? '' : e.target.value)}
      />
    );
  }

  const editing = !!panel && state.editing === panel.id;
  const shown = editing ? (state.draft[f.key] ?? committed) : masked && f.mask && !state.revealed[f.key] ? maskValue(f.mask, committed) : committed;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <Input
          value={shown}
          readOnly={!editing}
          align={f.unit || f.align === 'right' ? 'right' : 'left'}
          style={{ display: 'block', width: '100%' }}
          inputStyle={f.unit ? { paddingRight: f.unit.length > 1 ? 34 : 22 } : undefined}
          onChange={editing ? (e) => actions.setDraft(f.key, e.target.value) : () => {}}
        />
        {f.unit && (
          <span style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#707070', pointerEvents: 'none' }}>
            {f.unit}
          </span>
        )}
      </div>
      {f.mask && !editing && (
        <Button variant="outline" size="sm" style={{ width: 24, padding: 0, flexShrink: 0 }} onClick={() => actions.toggleReveal(f.key)}>
          *
        </Button>
      )}
      {f.button && (
        <Button variant={f.button.variant ?? 'outline'} size="sm" style={{ flexShrink: 0 }}>
          {f.button.label}
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ data tables */

const PAD = { normal: ['7px 10px', '7px 10px'], compact: ['7px 8px', '7px 8px'], dense: ['7px 8px', '6px 8px'] } as const;

function TableBlock({ block: b, panel }: { block: Extract<BlockSchema, { type: 'table' }>; panel?: PanelSchema }) {
  const { state, actions, templateCtx } = useScreen();
  const [thPad, tdPad] = PAD[b.density ?? 'normal'];
  const padX = tdPad.split(' ')[1];
  const editing = !!panel && state.editing === panel.id;
  const rows = (editing && state.tableDraft[b.table]) || state.tables[b.table] || [];

  const cell = (c: TableColumnSchema, r: Record<string, string>, i: number) => {
    const v = r[c.key] ?? '';
    const base: CSSProperties = { padding: tdPad, textAlign: c.align };
    if (c.kind === 'checkbox')
      return (
        <td key={c.key} style={{ padding: `4px ${padX}` }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Checkbox
              checked={v === 'Y'}
              disabled={!(editing && c.editable)}
              onChange={(next) => editing && actions.setTableCell(b.table, i, c.key, next ? 'Y' : 'N')}
            />
          </div>
        </td>
      );
    if (c.kind === 'button')
      return (
        <td key={c.key} style={{ padding: `3px ${padX}`, textAlign: 'center' }}>
          {v === 'Y' && (
            <Button variant="outline" size="sm">
              {c.buttonLabel}
            </Button>
          )}
        </td>
      );
    if (c.kind === 'link')
      return (
        <td key={c.key} style={base}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--pp-navy-800)', textDecoration: 'underline' }}>
            {v}
          </a>
        </td>
      );
    if (c.editable)
      return (
        <td key={c.key} style={{ padding: `4px ${padX}`, textAlign: c.align }}>
          {editing ? (
            <Input
              value={v}
              align={c.align === 'right' ? 'right' : 'left'}
              style={{ width: '100%' }}
              onChange={(e) => actions.setTableCell(b.table, i, c.key, e.target.value)}
            />
          ) : (
            v
          )}
        </td>
      );
    const tone = c.tones ? (c.tones[v] ?? c.tones['*']) : undefined;
    return (
      <td key={c.key} style={{ ...base, fontWeight: c.bold ? 700 : undefined, color: tone }}>
        {v}
      </td>
    );
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ background: '#f6f6f6', borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}>
          {b.columns.map((c) => (
            <th key={c.key} style={{ textAlign: c.align ?? 'left', padding: thPad, fontWeight: 700, width: c.width }}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #dee2e6' }}>
            {b.columns.map((c) => cell(c, r, i))}
          </tr>
        ))}
        {b.footer && (
          <tr style={{ background: '#f6f6f6' }}>
            <td style={{ padding: thPad, fontWeight: 700 }} colSpan={b.footer.labelSpan}>
              {b.footer.label}
            </td>
            <td style={{ padding: thPad, textAlign: 'right', fontWeight: 700 }}>{resolveText(`{sumCol:${b.table}.${b.footer.sumColumn}}`, templateCtx)}</td>
            {b.columns.length - b.footer.labelSpan - 1 > 0 && <td style={{ padding: thPad }} colSpan={b.columns.length - b.footer.labelSpan - 1} />}
          </tr>
        )}
      </tbody>
    </table>
  );
}

/** Collapsible card header used by repeat groups. */
export function CollapsibleHeader({ no, title, summary, open, onToggle }: { no: number; title: string; summary: string; open: boolean; onToggle: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 15px', background: hover ? '#ececec' : '#f6f6f6', cursor: 'pointer' }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'var(--pp-navy-800)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {no}
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#303030' }}>{title}</span>
      <span style={{ fontSize: 12, color: '#707070' }}>{summary}</span>
      <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#505050' }}>{open ? '접기' : '펼치기'}</span>
      <span
        style={{ display: 'inline-block', fontSize: 10, color: '#505050', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .15s' }}
      >
        ▼
      </span>
    </div>
  );
}
