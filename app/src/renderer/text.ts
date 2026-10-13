import type { MaskKind, TableRow, TemplateText } from '../schema/types';

export const toNumber = (v: unknown) => parseInt(String(v ?? '').replace(/[^0-9-]/g, ''), 10) || 0;
export const formatNumber = (n: number) => n.toLocaleString('ko-KR');

const pad = (n: number) => String(n).padStart(2, '0');
export const nowStamp = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export function maskValue(kind: MaskKind, v: string): string {
  if (!v || v === '-') return v;
  switch (kind) {
    case 'name':
      return v[0] + '*' + v[v.length - 1];
    case 'phone':
      return v.replace(/-(\d{4})-/, '-****-');
    case 'email':
      return v.replace(/^(.{2})[^@]*/, '$1****');
    case 'address':
      return v.replace(/\s[^\s]+$/, ' ****');
    default:
      return v.replace(/[0-9A-Za-z가-힣]/g, (c, i: number) => (i < 3 ? c : '*'));
  }
}

export interface TemplateContext {
  values: Record<string, string>;
  tables: Record<string, TableRow[]>;
  checked: Record<string, Record<number, boolean>>;
  checklistSizes: Record<string, number>;
}

function evalToken(token: string, ctx: TemplateContext): number {
  const [fn, arg = ''] = token.split(':');
  switch (fn) {
    case 'rows':
      return ctx.tables[arg]?.length ?? 0;
    case 'rowsWhere': {
      const m = /^([^.]+)\.([^=]+)=(.*)$/.exec(arg);
      if (!m) return 0;
      return (ctx.tables[m[1]] ?? []).filter((r) => r[m[2]] === m[3]).length;
    }
    case 'sumCol': {
      const [table, col] = arg.split('.');
      return (ctx.tables[table] ?? []).reduce((t, r) => t + toNumber(r[col]), 0);
    }
    case 'sum':
      return arg.split(',').reduce((t, k) => t + toNumber(ctx.values[k.trim()]), 0);
    case 'checked':
      return Object.values(ctx.checked[arg] ?? {}).filter(Boolean).length;
    case 'items':
      return ctx.checklistSizes[arg] ?? 0;
    default:
      return 0;
  }
}

const interpolate = (s: string, ctx: TemplateContext) => s.replace(/\{([a-zA-Z]+:[^}]*)\}/g, (_, t: string) => formatNumber(evalToken(t, ctx)));

export function resolveText(t: TemplateText | undefined, ctx: TemplateContext): string | undefined {
  if (t === undefined) return undefined;
  if (typeof t === 'string') return interpolate(t, ctx);
  return interpolate(evalToken(t.when.replace(/^\{|\}$/g, ''), ctx) ? t.then : t.else, ctx);
}
