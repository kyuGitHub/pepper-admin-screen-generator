import type { ScreenSchema } from '../schema/types';

export interface ValidationResult {
  ok: boolean;
  schema?: ScreenSchema;
  /** Human-readable problems; the first one is shown prominently. */
  errors: string[];
}

/** Turns a JSON.parse error into "line:col". V8 quotes the text around the bad token; Firefox gives line/column. */
function describeJsonError(text: string, err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  let pos = -1;
  const lc = /line (\d+) column (\d+)/.exec(msg);
  if (lc) return `JSON 문법 오류 (${lc[1]}행 ${lc[2]}열): ${msg}`;
  const at = /position (\d+)/.exec(msg);
  if (at) pos = Number(at[1]);
  else if (/end of JSON input/.test(msg)) pos = text.length;
  else {
    const ctx = /\.\.\."([\s\S]*)" is not valid JSON$/.exec(msg) ?? /"([\s\S]*)" is not valid JSON$/.exec(msg);
    if (ctx) {
      const idx = text.indexOf(ctx[1]);
      if (idx >= 0) pos = idx + ctx[1].length - 1;
    }
  }
  if (pos < 0) return `JSON 문법 오류: ${msg}`;
  const before = text.slice(0, pos);
  const line = before.split('\n').length;
  const col = pos - before.lastIndexOf('\n');
  return `JSON 문법 오류 (${line}행 ${col}열): ${msg}`;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Light structural check: enough to catch a pasted fragment or a wrong file, not a full type check.
 * The renderer tolerates missing optional parts; this guards the parts it cannot do without.
 */
export function validateScreenSchema(text: string): ValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, errors: [describeJsonError(text, e)] };
  }
  const errors: string[] = [];
  if (!isObj(raw)) return { ok: false, errors: ['최상위가 객체({ ... })여야 합니다.'] };

  const need = (key: string, test: (v: unknown) => boolean, what: string) => {
    if (!(key in raw)) errors.push(`"${key}" 항목이 없습니다 (${what}).`);
    else if (!test(raw[key])) errors.push(`"${key}" 항목의 형식이 다릅니다 (${what}).`);
  };
  need('title', (v) => typeof v === 'string' && v.length > 0, '화면 제목 문자열');
  need('shell', (v) => isObj(v) && isObj(v.header) && isObj(v.lnb), 'header·lnb를 가진 객체');
  need('toolbar', (v) => isObj(v) && Array.isArray(v.actions), 'actions 배열을 가진 객체');
  need('summary', Array.isArray, '패널 배열');
  need('tabs', (v) => Array.isArray(v) && v.length > 0 && v.every((t) => isObj(t) && typeof t.label === 'string'), 'label을 가진 탭 배열');
  need('data', (v) => isObj(v) && isObj(v.values) && isObj(v.tables), 'values·tables를 가진 객체');
  need('currentUser', (v) => typeof v === 'string', '변경자 표시용 문자열');

  if (Array.isArray(raw.tabs)) {
    (raw.tabs as unknown[]).forEach((t, i) => {
      if (!isObj(t) || !t.layout) return;
      const layout = t.layout;
      if (!isObj(layout) || !Array.isArray(layout.columns)) errors.push(`tabs[${i}].layout.columns 가 배열이 아닙니다.`);
      else
        (layout.columns as unknown[]).forEach((c, j) => {
          if (!isObj(c) || !Array.isArray(c.items)) errors.push(`tabs[${i}].layout.columns[${j}].items 가 배열이 아닙니다.`);
          else
            (c.items as unknown[]).forEach((it, k) => {
              if (!isObj(it) || (it.kind !== 'panel' && it.kind !== 'repeat'))
                errors.push(`tabs[${i}] ${j + 1}열 ${k + 1}번째 항목의 kind 는 "panel" 또는 "repeat" 여야 합니다.`);
              else if (!Array.isArray(it.kind === 'panel' ? it.blocks : it.panels))
                errors.push(`tabs[${i}] ${j + 1}열 ${k + 1}번째 ${it.kind} 에 ${it.kind === 'panel' ? 'blocks' : 'panels'} 배열이 없습니다.`);
            });
        });
    });
  }

  if (errors.length) return { ok: false, errors };
  const schema = raw as unknown as ScreenSchema;
  if (!schema.id) schema.id = `screen-${Date.now()}`;
  return { ok: true, schema, errors: [] };
}
