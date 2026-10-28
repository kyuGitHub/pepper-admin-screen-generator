import type { FieldCellSchema, FieldTableCellSchema } from '../../schema/types';

/* Short constructors shared by the sample screens. */
export const f = (label: string, key: string, o: Omit<FieldCellSchema, 'label' | 'key'> = {}): FieldCellSchema => ({ label, key, ...o });
export const blank = (n = 1): FieldTableCellSchema => ({ blank: n });
export const note = (text: string, span = 1): FieldTableCellSchema => ({ note: text, span });
export const sel = (options: string[], placeholder?: string) => ({ control: { type: 'select' as const, options, placeholder } });
export const date = { control: { type: 'date' as const } };
export const time = { control: { type: 'time' as const } };
export const ro = { readOnly: true };
