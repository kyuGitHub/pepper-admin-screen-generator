import type { BlockSchema, ColumnItemSchema, FieldCellSchema, FieldTableCellSchema, PanelSchema, RepeatGroupSchema, ScreenSchema } from '../schema/types';

/** A repeat group expanded into concrete, suffixed panels per instance. */
export interface RepeatInstance {
  key: string;
  no: number;
  keySuffix: string;
  panels: PanelSchema[];
}

export interface CompiledScreen {
  schema: ScreenSchema;
  /** Every concrete panel (summary, tabs, repeat instances) in document order. */
  panels: PanelSchema[];
  repeats: Record<string, RepeatInstance[]>;
  checklistSizes: Record<string, number>;
}

export const isField = (c: FieldTableCellSchema): c is FieldCellSchema => 'key' in c;

export const sectionOf = (p: PanelSchema) => p.historySection ?? p.title;

export const isEditablePanel = (p: PanelSchema) => (p.actions ?? []).some((a) => a.type === 'edit' || a.type === 'formSave');

/** Depth-first walk over a block list, including nested sections. */
export function walkBlocks(blocks: BlockSchema[], fn: (b: BlockSchema) => void) {
  for (const b of blocks) {
    fn(b);
    if (b.type === 'section') walkBlocks(b.blocks, fn);
  }
}

export function panelFields(p: PanelSchema): FieldCellSchema[] {
  const out: FieldCellSchema[] = [];
  walkBlocks(p.blocks, (b) => {
    if (b.type === 'fields') b.rows.forEach((r) => r.forEach((c) => isField(c) && out.push(c)));
  });
  return out;
}

const fillNo = (s: string | undefined, no: number) => s?.replaceAll('{no}', String(no));

function suffixBlocks(blocks: BlockSchema[], sx: string): BlockSchema[] {
  return blocks.map((b) => {
    switch (b.type) {
      case 'fields':
        return { ...b, rows: b.rows.map((r) => r.map((c) => (isField(c) ? { ...c, key: c.key + sx } : c))) };
      case 'section':
        return { ...b, blocks: suffixBlocks(b.blocks, sx) };
      case 'checklist':
        return { ...b, id: b.id + sx };
      default:
        return b;
    }
  });
}

export function instantiateRepeat(g: RepeatGroupSchema): RepeatInstance[] {
  return g.instances.map(({ keySuffix }, i) => {
    const no = i + 1;
    return {
      key: `${g.id}${keySuffix || '_1'}`,
      no,
      keySuffix,
      panels: g.panels.map((p) => ({
        ...p,
        id: p.id + keySuffix,
        title: fillNo(p.title, no)!,
        historySection: fillNo(p.historySection, no),
        blocks: suffixBlocks(p.blocks, keySuffix),
      })),
    };
  });
}

export function compileScreen(schema: ScreenSchema): CompiledScreen {
  const panels: PanelSchema[] = [...schema.summary];
  const repeats: Record<string, RepeatInstance[]> = {};
  const visit = (item: ColumnItemSchema) => {
    if (item.kind === 'panel') panels.push(item);
    else {
      repeats[item.id] = instantiateRepeat(item);
      repeats[item.id].forEach((inst) => panels.push(...inst.panels));
    }
  };
  schema.tabs.forEach((t) => t.layout?.columns.forEach((c) => c.items.forEach(visit)));

  const checklistSizes: Record<string, number> = {};
  const collect = (b: BlockSchema) => {
    if (b.type === 'checklist') checklistSizes[b.id] = b.items.length;
  };
  panels.forEach((p) => walkBlocks(p.blocks, collect));
  schema.modals?.forEach((m) => walkBlocks(m.blocks, collect));

  return { schema, panels, repeats, checklistSizes };
}
