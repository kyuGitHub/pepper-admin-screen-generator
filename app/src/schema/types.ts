/**
 * Screen schema for Digital Admin screens.
 *
 * A screen is plain, JSON-serialisable data: the renderer (src/renderer) turns it into UI built
 * from the design-system primitives and supplies all mock behaviour (edit → 저장/취소, 정보변경이력,
 * masking, collapsible groups, modals). A future "screen generator" only has to produce this
 * structure, so keep it free of functions and React nodes.
 */

import type { ButtonVariant } from '../design-system';

/* ------------------------------------------------------------------ text templates */

/**
 * Text with interpolation tokens resolved against screen state:
 *   {rows:<table>}                    row count of a data table
 *   {rowsWhere:<table>.<col>=<value>} rows whose column equals value
 *   {sumCol:<table>.<col>}            sum of a numeric table column (comma formatted)
 *   {sum:<key>,<key>,...}             sum of numeric field values (comma formatted)
 *   {checked:<checklist>}             checked items of a checklist
 *   {items:<checklist>}               item count of a checklist
 * The object form picks `then` when the `when` token evaluates to a non-zero number.
 */
export type TemplateText = string | { when: string; then: string; else: string };

/* ------------------------------------------------------------------ actions (panel header / toolbar buttons) */

export type ActionSchema =
  /** Inert button (mock): rendered, does nothing. */
  | { type: 'button'; label: string; variant?: ButtonVariant }
  /** Puts the panel into edit mode; while editing, the panel's actions become [취소][저장]. */
  | { type: 'edit'; label?: string }
  /** Opens 정보변경이력. In a panel it is pre-filtered to that panel's history section. */
  | { type: 'history'; label?: string; variant?: ButtonVariant }
  /** Opens a modal declared in `ScreenSchema.modals`. */
  | { type: 'modal'; label: string; modal: string; variant?: ButtonVariant }
  /** Saves the panel's always-editable select fields; disabled until something changed. */
  | { type: 'formSave'; label?: string };

/* ------------------------------------------------------------------ field tables */

export type MaskKind = 'name' | 'phone' | 'email' | 'address' | 'default';

export interface FieldCellSchema {
  label: string;
  /** Key into `ScreenSchema.data.values`. */
  key: string;
  /** Unit suffix drawn inside the input (원, %, 개월 …); also right-aligns the value. */
  unit?: string;
  align?: 'left' | 'right';
  /** Number of label/value pairs this field spans (default 1). */
  span?: number;
  /** Masked by default, with a `*` toggle that reveals the value. */
  mask?: MaskKind;
  /** Inert small button after the value (e.g. 체크리스트). */
  button?: { label: string; variant?: ButtonVariant };
  /** Always-editable control instead of a read-only input; saved with a `formSave` action. */
  control?: { type: 'select'; options: string[]; placeholder?: string };
}

export type FieldTableCellSchema = FieldCellSchema | { blank: number } | { note: string; span?: number };

/* ------------------------------------------------------------------ data tables */

export interface TableColumnSchema {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  bold?: boolean;
  /** Text colour per cell value; `*` is the fallback. */
  tones?: Record<string, string>;
  /** Cell rendering. `button` shows `buttonLabel` when the row's value is truthy ('Y'). */
  kind?: 'text' | 'link' | 'button' | 'checkbox';
  buttonLabel?: string;
  /** Editable while the owning panel is in edit mode. */
  editable?: boolean;
  /** Item name used in 정보변경이력 (defaults to label). */
  historyLabel?: string;
}

export type TableRow = Record<string, string>;

/* ------------------------------------------------------------------ blocks (panel body) */

export type BlockSchema =
  | { type: 'fields'; columns: number; labelWidth?: string; valueWidth?: string; rows: FieldTableCellSchema[][] }
  | { type: 'heading'; text: TemplateText; meta?: TemplateText }
  /** Horizontal rule; `tight` drops the space above it. */
  | { type: 'divider'; tight?: boolean }
  /** Sub-section with 10px block gap; `separated` (default true) adds a top rule + spacing. */
  | { type: 'section'; separated?: boolean; blocks: BlockSchema[] }
  | { type: 'select'; options: string[]; width?: number }
  | {
      type: 'table';
      table: string;
      columns: TableColumnSchema[];
      /** Cell padding: normal 7px 10px · compact 7px 8px · dense 6px 8px (body rows). */
      density?: 'normal' | 'compact' | 'dense';
      footer?: { label: string; labelSpan: number; sumColumn: string };
    }
  | { type: 'totals'; items: { label: string; value: string }[] }
  | { type: 'checklist'; id: string; items: string[] }
  | { type: 'controls'; items: ControlSchema[] }
  /** Shown only while the panel has unsaved `formSave` changes. */
  | { type: 'dirtyNotice'; text: string }
  | { type: 'kvStrip'; items: { label: string; value: string }[] }
  | { type: 'kvTable'; rows: [string, string, string, string][] }
  | { type: 'text'; text: string; tone?: 'muted' }
  | { type: 'empty'; text: string };

export type ControlSchema =
  | { type: 'radio'; name: string; options: { label: string; value: string }[]; defaultValue?: string }
  | { type: 'select'; options: string[]; width?: number }
  | { type: 'button'; label: string; variant?: ButtonVariant };

/* ------------------------------------------------------------------ panels & layout */

export interface PanelSchema {
  kind: 'panel';
  id: string;
  title: string;
  /** Name used in 정보변경이력 (구분); defaults to the title. */
  historySection?: string;
  meta?: TemplateText;
  actions?: ActionSchema[];
  /** Gap between body blocks (default 6). */
  blockGap?: number;
  blocks: BlockSchema[];
}

/** Repeats a set of panels per instance (e.g. 담보제공자 1, 2) inside collapsible cards. */
export interface RepeatGroupSchema {
  kind: 'repeat';
  id: string;
  title: string;
  /** `{n}` = number of instances. */
  countText: string;
  /** `{no}` = 1-based instance number. */
  itemTitle: string;
  /** Field keys joined with " · " in the card header. */
  summaryKeys: string[];
  /** Each instance suffixes every field key and panel id (e.g. '' and '_2'). */
  instances: { keySuffix: string }[];
  /** Panel templates; `{no}` is substituted in titles and history sections. */
  panels: PanelSchema[];
}

export type ColumnItemSchema = PanelSchema | RepeatGroupSchema;

export interface TabLayoutSchema {
  /** Column scroll box: `max` grows up to `height`, `fixed` is always `height` tall. */
  heightMode: 'max' | 'fixed';
  height: string;
  align: 'start' | 'stretch';
  columns: { items: ColumnItemSchema[]; paddingLeft?: number }[];
}

export interface TabSchema {
  label: string;
  /** Tabs without a layout show the "조회된 데이터가 없습니다." placeholder panel. */
  layout?: TabLayoutSchema;
}

export interface ModalSchema {
  id: string;
  title: string;
  width?: number;
  blocks: BlockSchema[];
  closeLabel?: string;
}

/* ------------------------------------------------------------------ shell & screen */

export interface LnbNodeSchema {
  label: string;
  id?: string;
  open?: boolean;
  children?: LnbNodeSchema[];
}

export interface HistoryEntry {
  at: string;
  section: string;
  item: string;
  before: string;
  after: string;
  by: string;
}

export interface ScreenSchema {
  id: string;
  title: string;
  shell: {
    header: { menu: string[]; active: string; userName: string; userPosition: string; lastLogin?: string; shortcuts: string[]; history: string[] };
    lnb: { tabs: string[]; tree: LnbNodeSchema[]; activeId: string };
  };
  toolbar: { search?: { placeholder: string; width?: number; submitLabel: string }; actions: ActionSchema[] };
  /** Panels shown above the tabs in a two-column grid. */
  summary: PanelSchema[];
  tabs: TabSchema[];
  modals?: ModalSchema[];
  data: { values: Record<string, string>; tables: Record<string, TableRow[]> };
  /** Recorded as 변경자 when the mock saves a change. */
  currentUser: string;
  masked?: boolean;
  seedHistory?: HistoryEntry[];
}
