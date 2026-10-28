import type { ActionSchema, FieldCellSchema, FilterSchema, GridColumnSchema, PanelSchema, TabSchema } from '../schema/types';

/* Defaults inserted by the editor's "추가" buttons. Keys are made unique with a timestamp suffix. */

const uid = () => Math.random().toString(36).slice(2, 7);

export const newField = (): FieldCellSchema => ({ label: '새 항목', key: `field_${uid()}` });

export const newPanel = (): PanelSchema => ({
  kind: 'panel',
  id: `panel_${uid()}`,
  title: '새 패널',
  actions: [],
  blocks: [{ type: 'fields', columns: 3, rows: [[newField(), newField(), newField()]] }],
});

export const newTab = (): TabSchema => ({
  label: '새 탭',
  layout: { heightMode: 'max', height: 'calc(100vh - 120px)', align: 'start', columns: [{ items: [newPanel()] }, { items: [] }] },
});

export const newAction = (): ActionSchema => ({ type: 'button', label: '새 버튼', variant: 'outline' });

export const newColumn = (): GridColumnSchema => ({ key: `col_${uid()}`, label: '새 열', width: 120 });

export const newFilter = (): FilterSchema => ({ type: 'select', options: ['새 조건'] });
