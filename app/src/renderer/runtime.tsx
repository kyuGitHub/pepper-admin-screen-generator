import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { HistoryEntry, PanelSchema, ScreenSchema, TableRow } from '../schema/types';
import { compileScreen, panelFields, sectionOf, walkBlocks, type CompiledScreen } from './compile';
import { nowStamp, type TemplateContext } from './text';

/** Mock runtime state for a rendered screen. Nothing is persisted; a reload resets it. */
interface RuntimeState {
  values: Record<string, string>;
  tables: Record<string, TableRow[]>;
  /** Panel currently in edit mode (only one at a time). */
  editing: string | null;
  draft: Record<string, string>;
  tableDraft: Record<string, TableRow[]>;
  /** Unsaved values of always-editable controls, per panel. */
  forms: Record<string, Record<string, string>>;
  history: HistoryEntry[];
  revealed: Record<string, boolean>;
  checked: Record<string, Record<number, boolean>>;
  radios: Record<string, string>;
  collapsed: Record<string, boolean>;
  historyModal: { open: boolean; filter: string };
  modal: string | null;
  tab: string;
  lnbOpen: boolean;
  query: string;
}

function initialState(schema: ScreenSchema): RuntimeState {
  return {
    values: { ...schema.data.values },
    tables: Object.fromEntries(Object.entries(schema.data.tables).map(([k, rows]) => [k, rows.map((r) => ({ ...r }))])),
    editing: null,
    draft: {},
    tableDraft: {},
    forms: {},
    history: schema.seedHistory ?? [],
    revealed: {},
    checked: {},
    radios: {},
    collapsed: {},
    historyModal: { open: false, filter: '전체' },
    modal: null,
    tab: schema.tabs[0]?.label ?? '',
    lnbOpen: true,
    query: '',
  };
}

const editableTables = (p: PanelSchema) => {
  const out: { table: string; cols: { key: string; label: string }[] }[] = [];
  walkBlocks(p.blocks, (b) => {
    if (b.type !== 'table') return;
    const cols = b.columns.filter((c) => c.editable).map((c) => ({ key: c.key, label: c.historyLabel ?? c.label }));
    if (cols.length) out.push({ table: b.table, cols });
  });
  return out;
};

function useRuntime(compiled: CompiledScreen) {
  const { schema } = compiled;
  const [s, setS] = useState(() => initialState(schema));
  // The editor hands in a new schema on every change: refresh data-derived state, keep navigation state.
  const [prevSchema, setPrevSchema] = useState(schema);
  if (schema !== prevSchema) {
    setPrevSchema(schema);
    setS((prev) => ({
      ...initialState(schema),
      tab: schema.tabs.some((t) => t.label === prev.tab) ? prev.tab : (schema.tabs[0]?.label ?? ''),
      lnbOpen: prev.lnbOpen,
      modal: prev.modal,
      collapsed: prev.collapsed,
    }));
  }
  const patch = (p: Partial<RuntimeState> | ((s: RuntimeState) => Partial<RuntimeState>)) =>
    setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));

  const actions = {
    startEdit: (p: PanelSchema) =>
      patch((st) => ({
        editing: p.id,
        draft: {},
        tableDraft: Object.fromEntries(editableTables(p).map(({ table }) => [table, st.tables[table].map((r) => ({ ...r }))])),
      })),
    cancelEdit: () => patch({ editing: null, draft: {}, tableDraft: {} }),
    saveEdit: (p: PanelSchema) =>
      patch((st) => {
        const at = nowStamp();
        const section = sectionOf(p);
        const entry = (item: string, before: string, after: string): HistoryEntry => ({
          at,
          section,
          item,
          before: before || '-',
          after: after || '-',
          by: schema.currentUser,
        });
        const changed = panelFields(p).filter((f) => !f.control && st.draft[f.key] !== undefined && st.draft[f.key] !== (st.values[f.key] ?? ''));
        const entries = changed.map((f) => entry(f.label, st.values[f.key] ?? '', st.draft[f.key]));
        const tables = { ...st.tables };
        for (const { table, cols } of editableTables(p)) {
          const next = st.tableDraft[table] ?? st.tables[table];
          next.forEach((row, i) =>
            cols.forEach(({ key, label }) => {
              const before = st.tables[table][i]?.[key] ?? '';
              if ((row[key] ?? '') !== before) entries.push(entry(`${label}(${i + 1})`, before, row[key]));
            }),
          );
          tables[table] = next;
        }
        return {
          editing: null,
          draft: {},
          tableDraft: {},
          tables,
          values: { ...st.values, ...Object.fromEntries(changed.map((f) => [f.key, st.draft[f.key]])) },
          history: [...entries, ...st.history],
        };
      }),
    setDraft: (key: string, v: string) => patch((st) => ({ draft: { ...st.draft, [key]: v } })),
    setTableCell: (table: string, i: number, key: string, v: string) =>
      patch((st) => ({ tableDraft: { ...st.tableDraft, [table]: st.tableDraft[table].map((r, j) => (j === i ? { ...r, [key]: v } : r)) } })),
    setForm: (panelId: string, key: string, v: string) => patch((st) => ({ forms: { ...st.forms, [panelId]: { ...st.forms[panelId], [key]: v } } })),
    saveForm: (p: PanelSchema) =>
      patch((st) => {
        const at = nowStamp();
        const form = st.forms[p.id] ?? {};
        const changed = panelFields(p).filter((f) => f.control && form[f.key] !== undefined && form[f.key] !== (st.values[f.key] ?? ''));
        if (!changed.length) return {};
        const entries = changed.map((f) => ({
          at,
          section: sectionOf(p),
          item: f.label,
          before: st.values[f.key] || '-',
          after: form[f.key] || '-',
          by: schema.currentUser,
        }));
        return {
          values: { ...st.values, ...Object.fromEntries(changed.map((f) => [f.key, form[f.key]])) },
          forms: { ...st.forms, [p.id]: {} },
          history: [...entries, ...st.history],
        };
      }),
    toggleReveal: (key: string) => patch((st) => ({ revealed: { ...st.revealed, [key]: !st.revealed[key] } })),
    setChecked: (id: string, i: number, v: boolean) => patch((st) => ({ checked: { ...st.checked, [id]: { ...st.checked[id], [i]: v } } })),
    setRadio: (name: string, v: string) => patch((st) => ({ radios: { ...st.radios, [name]: v } })),
    setCollapsed: (keys: string[], v: boolean) => patch((st) => ({ collapsed: { ...st.collapsed, ...Object.fromEntries(keys.map((k) => [k, v])) } })),
    openHistory: (filter = '전체') => patch({ historyModal: { open: true, filter } }),
    setHistoryFilter: (filter: string) => patch((st) => ({ historyModal: { ...st.historyModal, filter } })),
    closeHistory: () => patch((st) => ({ historyModal: { ...st.historyModal, open: false } })),
    openModal: (id: string) => patch({ modal: id }),
    closeModal: () => patch({ modal: null }),
    setTab: (tab: string) => patch({ tab }),
    setLnbOpen: (lnbOpen: boolean) => patch({ lnbOpen }),
    setQuery: (query: string) => patch({ query }),
  };

  const isFormDirty = (p: PanelSchema) => {
    const form = s.forms[p.id] ?? {};
    return panelFields(p).some((f) => f.control && form[f.key] !== undefined && form[f.key] !== (s.values[f.key] ?? ''));
  };

  const templateCtx: TemplateContext = { values: s.values, tables: s.tables, checked: s.checked, checklistSizes: compiled.checklistSizes };

  return { compiled, schema, state: s, actions, isFormDirty, templateCtx, masked: schema.masked ?? true };
}

export type Runtime = ReturnType<typeof useRuntime>;

const RuntimeContext = createContext<Runtime | null>(null);

export function ScreenRuntimeProvider({ schema, children }: { schema: ScreenSchema; children: ReactNode }) {
  const compiled = useMemo(() => compileScreen(schema), [schema]);
  const rt = useRuntime(compiled);
  return <RuntimeContext.Provider value={rt}>{children}</RuntimeContext.Provider>;
}

export function useScreen(): Runtime {
  const rt = useContext(RuntimeContext);
  if (!rt) throw new Error('useScreen must be used inside <ScreenRuntimeProvider>');
  return rt;
}
