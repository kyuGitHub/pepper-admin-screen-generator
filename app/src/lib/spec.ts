import type {
  ActionSchema,
  BlockSchema,
  FieldCellSchema,
  FilterSchema,
  GridColumnSchema,
  ModalSchema,
  PanelSchema,
  ScreenSchema,
  TableColumnSchema,
} from '../schema/types';
import { escapeHtml } from './export';

/* 화면정의서: a structured document built from a screen schema, rendered to Markdown or print-friendly HTML.
   It lists what a developer asks a PM for: every field with its key and input kind, every button with its
   behaviour, search conditions, grid columns and popups. */

export interface SpecTable {
  caption?: string;
  columns: string[];
  rows: string[][];
}

export interface SpecSection {
  level: 2 | 3;
  title: string;
  notes?: string[];
  tables?: SpecTable[];
}

export interface SpecDoc {
  title: string;
  meta: [string, string][];
  sections: SpecSection[];
}

export interface SpecMeta {
  area?: string;
  pattern?: string;
  url?: string;
  author?: string;
  updatedAt?: string;
}

const FIELD_COLUMNS = ['No', '구분', '항목명', '데이터 키', '입력 형태', '단위', '마스킹', '비고'];

export function buildSpec(schema: ScreenSchema, meta: SpecMeta = {}): SpecDoc {
  const modalTitle = (id: string) => schema.modals?.find((m) => m.id === id)?.title ?? id;
  const describeAction = (a: ActionSchema, panel?: PanelSchema): string => {
    switch (a.type) {
      case 'edit':
        return '패널을 수정 모드로 전환 (버튼이 [취소][저장]으로 바뀜)';
      case 'history':
        return `정보변경이력 팝업 열기${panel ? ` (구분: ${panel.historySection ?? panel.title})` : ''}`;
      case 'modal':
        return `팝업 '${modalTitle(a.modal)}' 열기`;
      case 'formSave':
        return '선택 항목 변경값 저장 (변경 시에만 활성)';
      case 'detailToggle':
        return '상세검색 조건 펼침/접힘';
      default:
        return '동작 없음 (목업) — 개발 시 정의 필요';
    }
  };
  const label = (a: ActionSchema) => a.label ?? { edit: '수정', history: '정보변경이력', formSave: '저장', detailToggle: '상세검색' }[a.type as 'edit'] ?? '';

  const buttonsTable = (actions: ActionSchema[] | undefined, panel?: PanelSchema): SpecTable | null =>
    actions?.length ? { caption: '버튼', columns: ['버튼명', '동작'], rows: actions.map((a) => [label(a), describeAction(a, panel)]) } : null;

  const allButtons: string[][] = [];
  const noteButtons = (where: string, actions: ActionSchema[] | undefined, panel?: PanelSchema) =>
    actions?.forEach((a) => allButtons.push([where, label(a), describeAction(a, panel), a.type === 'button' ? '동작 정의 필요' : '']));

  /* ---- fields ---- */
  const controlText = (f: FieldCellSchema, editable?: boolean): string => {
    const c = f.control;
    if (!c) return f.readOnly || !editable ? '읽기 전용' : '텍스트 입력';
    switch (c.type) {
      case 'select':
        return `선택: ${c.options.join(' / ')}`;
      case 'text':
        return '텍스트 입력';
      case 'date':
        return '날짜';
      case 'time':
        return '시간';
      case 'textarea':
        return '여러 줄 텍스트';
      case 'file':
        return '파일 첨부';
      case 'color':
        return '색상';
    }
  };
  const fieldNote = (f: FieldCellSchema): string => {
    const n: string[] = [];
    if (f.span && f.span > 1) n.push(`${f.span}칸 차지`);
    if (f.button) n.push(`옆 버튼 [${f.button.label}]`);
    if (f.counter) n.push(`최대 ${f.counter.max} byte`);
    if (f.readOnly) n.push('수정 불가');
    if (f.control && 'placeholder' in f.control && f.control.placeholder) n.push(`안내: ${f.control.placeholder}`);
    return n.join(', ');
  };

  interface Collected {
    fields: string[][];
    tables: SpecTable[];
    notes: string[];
  }
  const collectBlocks = (blocks: BlockSchema[], group: string, out: Collected, panel?: PanelSchema, where = '') => {
    for (const b of blocks) {
      switch (b.type) {
        case 'fields':
          for (const row of b.rows)
            for (const c of row) {
              if (!('key' in c)) {
                if ('buttons' in c) {
                  noteButtons(where, c.buttons, panel);
                  out.notes.push(`${group ? `${group}: ` : ''}행 끝 버튼 ${c.buttons.map((a) => `[${label(a)}]`).join(' ')}`);
                }
                if ('note' in c) out.notes.push(`${group ? `${group}: ` : ''}안내문 "${c.note}"`);
                continue;
              }
              out.fields.push([String(out.fields.length + 1), group, c.label, c.key, controlText(c, b.editable), c.unit ?? '', maskText(c.mask), fieldNote(c)]);
            }
          break;
        case 'heading':
          group = typeof b.text === 'string' ? b.text : b.text.then;
          break;
        case 'section':
          collectBlocks(b.blocks, group, out, panel, where);
          break;
        case 'collapsible':
          collectBlocks(b.blocks, b.title, out, panel, where);
          break;
        case 'tabs':
          for (const t of b.items) collectBlocks(t.blocks, `탭 ${t.label}`, out, panel, where);
          break;
        case 'table':
          out.tables.push(tableColumns(`표: ${group || panel?.title || ''}`.replace(/: $/, ''), b.columns, modalTitle));
          if (b.footer) out.notes.push(`표 합계 행: ${b.footer.label} (${b.footer.sumColumn} 합계)`);
          break;
        case 'grid':
          out.tables.push(gridColumns(`목록: ${group || where}`.replace(/: $/, ''), b.columns, modalTitle));
          if (b.pagination)
            out.notes.push(`페이지당 ${b.pagination.pageSize}건${b.pagination.pageSizes ? ` (선택: ${b.pagination.pageSizes.join('/')})` : ''}`);
          break;
        case 'searchBar':
          out.tables.push(filtersTable([...b.rows, ...(b.detailRows ?? [])], b.detailRows?.length ? b.rows.flat().length : -1));
          noteButtons(`${where} 검색`, b.actions);
          noteButtons(`${where} 검색 우측`, b.rightActions);
          if (b.actions?.length || b.rightActions?.length)
            out.notes.push(`검색 버튼: ${[...(b.actions ?? []), ...(b.rightActions ?? [])].map((a) => `[${label(a)}] ${describeAction(a)}`).join(' · ')}`);
          break;
        case 'checklist':
          out.notes.push(`체크리스트 (${b.items.length}항목): ${b.items.join(' / ')}`);
          break;
        case 'controls':
          for (const c of b.items)
            if (c.type === 'radio') out.notes.push(`라디오 ${c.name}: ${c.options.map((o) => o.label).join(' / ')}`);
            else if (c.type === 'select') out.notes.push(`선택: ${c.options.join(' / ')}`);
            else {
              out.notes.push(`버튼 [${c.label}]`);
              allButtons.push([where, c.label, '동작 없음 (목업) — 개발 시 정의 필요', '동작 정의 필요']);
            }
          break;
        case 'actionRow':
          noteButtons(where, b.items, panel);
          out.notes.push(`버튼 행: ${b.items.map((a) => `[${label(a)}] ${describeAction(a, panel)}`).join(' · ')}`);
          break;
        case 'editor':
          out.notes.push('리치 텍스트 에디터');
          break;
        case 'totals':
          out.notes.push(`합계 표시: ${b.items.map((i) => i.label).join(', ')}`);
          break;
        case 'kvStrip':
        case 'kvTable':
          out.notes.push(b.type === 'kvStrip' ? `요약 항목: ${b.items.map((i) => i.label).join(', ')}` : `요약 표 ${b.rows.length}행`);
          break;
        case 'dirtyNotice':
          out.notes.push(`미저장 안내: "${b.text}"`);
          break;
        case 'text':
        case 'empty':
          out.notes.push(`문구: "${b.text}"`);
          break;
        case 'select':
          out.notes.push(`선택: ${b.options.join(' / ')}`);
          break;
        case 'divider':
          break;
      }
    }
  };

  const panelSection = (p: PanelSchema, where: string, numbering: string): SpecSection => {
    const out: Collected = { fields: [], tables: [], notes: [] };
    noteButtons(where, p.actions, p);
    collectBlocks(p.blocks, '', out, p, where);
    const tables: SpecTable[] = [];
    const bt = buttonsTable(p.actions, p);
    if (bt) tables.push(bt);
    if (out.fields.length) tables.push({ caption: '항목', columns: FIELD_COLUMNS, rows: out.fields });
    tables.push(...out.tables);
    const notes = [...out.notes];
    if (typeof p.meta === 'string' && p.meta) notes.unshift(`제목 옆 표시: ${p.meta}`);
    return { level: 3, title: `${numbering} ${p.title}`, notes, tables };
  };

  /* ---- 1. overview ---- */
  const sections: SpecSection[] = [];
  const path = lnbPath(schema);
  const overview: [string, string][] = [
    ['화면명', schema.title],
    ['영역 / 패턴', [meta.area, meta.pattern].filter(Boolean).join(' / ') || '-'],
    ['메뉴 경로', path.length ? path.join(' > ') : schema.shell.header.active],
    ['화면 URL', meta.url ?? '-'],
    ['작성자', meta.author ?? '-'],
    ['최종 수정', meta.updatedAt ?? '-'],
    ['기준 해상도', '가로 1860px (Chrome), 넓어지면 반응형'],
  ];
  sections.push({ level: 2, title: '1. 화면 개요', tables: [{ columns: ['항목', '내용'], rows: overview }] });

  /* ---- 2. layout ---- */
  const layoutNotes: string[] = [];
  if (schema.toolbar.search) layoutNotes.push(`상단 검색: "${schema.toolbar.search.placeholder}" + [${schema.toolbar.search.submitLabel}]`);
  if (schema.favorite !== undefined) layoutNotes.push(`즐겨찾기 별 표시 (${schema.favorite ? '등록됨' : '미등록'})`);
  if (schema.summary.length) layoutNotes.push(`상단 패널 ${schema.summary.length}개: ${schema.summary.map((p) => p.title).join(', ')}`);
  if (schema.body?.length) layoutNotes.push(`본문 블록 ${schema.body.length}개 (${schema.body.map((b) => b.type).join(', ')})`);
  if (schema.tabs.length)
    layoutNotes.push(
      `탭 ${schema.tabs.length}개: ${schema.tabs.map((t) => `${t.label}(${t.layout ? countPanels(t.layout.columns) : '내용 없음'})`).join(', ')}`,
    );
  if (schema.modals?.length) layoutNotes.push(`팝업 ${schema.modals.length}개: ${schema.modals.map((m) => m.title).join(', ')}`);
  if (schema.masked) layoutNotes.push('개인정보 항목은 마스킹 표시, [*] 버튼으로 해제');
  const toolbarButtons = buttonsTable(schema.toolbar.actions);
  noteButtons('툴바', schema.toolbar.actions);
  sections.push({ level: 2, title: '2. 화면 구성', notes: layoutNotes, tables: toolbarButtons ? [{ ...toolbarButtons, caption: '툴바 버튼' }] : [] });

  /* ---- 3. panels ---- */
  const panelSections: SpecSection[] = [];
  let n = 0;
  for (const p of schema.summary) panelSections.push(panelSection(p, '상단', `3.${++n}`));
  if (schema.body?.length) {
    const out: Collected = { fields: [], tables: [], notes: [] };
    collectBlocks(schema.body, '', out, undefined, '본문');
    const tables: SpecTable[] = [];
    if (out.fields.length) tables.push({ caption: '항목', columns: FIELD_COLUMNS, rows: out.fields });
    tables.push(...out.tables);
    panelSections.push({ level: 3, title: `3.${++n} 본문 (검색 조건 · 목록)`, notes: out.notes, tables });
  }
  for (const t of schema.tabs) {
    if (!t.layout) continue;
    t.layout.columns.forEach((col, ci) => {
      for (const item of col.items) {
        if (item.kind === 'panel') panelSections.push(panelSection(item, `탭 ${t.label}`, `3.${++n}`));
        else {
          const sec: SpecSection = {
            level: 3,
            title: `3.${++n} ${item.title} (반복 그룹)`,
            notes: [
              `${item.instances.length}개 인스턴스 반복, 각 인스턴스는 접기/펼치기 카드 "${item.itemTitle}"`,
              `카드 요약 항목: ${item.summaryKeys.join(', ')}`,
            ],
            tables: [],
          };
          panelSections.push(sec);
          for (const p of item.panels) {
            const ps = panelSection({ ...p, title: p.title.replace('{no}', 'N') }, `탭 ${t.label} · ${item.title}`, `3.${n}.${item.panels.indexOf(p) + 1}`);
            panelSections.push(ps);
          }
        }
        void ci;
      }
    });
  }
  sections.push({ level: 2, title: '3. 패널별 항목 정의', notes: panelSections.length ? undefined : ['패널이 없습니다.'] }, ...panelSections);

  /* ---- 4. modals ---- */
  if (schema.modals?.length) {
    sections.push({ level: 2, title: '4. 팝업 정의' });
    schema.modals.forEach((m, i) => sections.push(modalSection(m, i + 1)));
  }

  function modalSection(m: ModalSchema, idx: number): SpecSection {
    const out: Collected = { fields: [], tables: [], notes: [] };
    collectBlocks(m.blocks, '', out, undefined, `팝업 ${m.title}`);
    const footer = [...(m.footer?.left ?? []), ...(m.footer?.right ?? [])];
    noteButtons(`팝업 ${m.title}`, footer);
    const tables: SpecTable[] = [];
    if (out.fields.length) tables.push({ caption: '항목', columns: FIELD_COLUMNS, rows: out.fields });
    tables.push(...out.tables);
    const fb = buttonsTable(footer.length ? footer : [{ type: 'button', label: m.closeLabel ?? '닫기' }]);
    if (fb) tables.push({ ...fb, caption: '하단 버튼' });
    return { level: 3, title: `4.${idx} ${m.title}`, notes: [`너비 ${m.width ?? 600}px`, ...out.notes], tables };
  }

  /* ---- 5. buttons summary ---- */
  sections.push({
    level: 2,
    title: `${schema.modals?.length ? 5 : 4}. 버튼 동작 정리`,
    notes: ['"동작 정의 필요"로 표시된 버튼은 목업에서 동작이 없으며 개발 요건 협의가 필요합니다.'],
    tables: [{ columns: ['위치', '버튼명', '동작', '확인'], rows: allButtons }],
  });

  return { title: `${schema.title} 화면정의서`, meta: overview, sections };
}

const maskText = (m: FieldCellSchema['mask']) => (m ? { name: '이름', phone: '전화번호', email: '이메일', address: '주소', default: '전체' }[m] : '');

function countPanels(columns: { items: { kind: string }[] }[]) {
  const n = columns.reduce((s, c) => s + c.items.length, 0);
  return `패널 ${n}개`;
}

function lnbPath(schema: ScreenSchema): string[] {
  const { tree, activeId } = schema.shell.lnb;
  const walk = (nodes: ScreenSchema['shell']['lnb']['tree'], acc: string[]): string[] | null => {
    for (const nd of nodes) {
      if (nd.id === activeId) return [...acc, nd.label];
      if (nd.children) {
        const r = walk(nd.children, [...acc, nd.label]);
        if (r) return r;
      }
    }
    return null;
  };
  return walk(tree, []) ?? [];
}

function tableColumns(caption: string, columns: TableColumnSchema[], modalTitle: (id: string) => string): SpecTable {
  void modalTitle;
  return {
    caption,
    columns: ['No', '열 제목', '데이터 키', '정렬', '표시 형태', '비고'],
    rows: columns.map((c, i) => [
      String(i + 1),
      c.label,
      c.key,
      c.align ?? '가운데',
      c.kind === 'link' ? '링크' : c.kind === 'button' ? `버튼 [${c.buttonLabel ?? ''}]` : c.kind === 'checkbox' ? '체크박스' : '텍스트',
      [c.editable ? '수정 모드에서 편집 가능' : '', c.bold ? '굵게' : ''].filter(Boolean).join(', '),
    ]),
  };
}

function gridColumns(caption: string, columns: GridColumnSchema[], modalTitle: (id: string) => string): SpecTable {
  const kind = (c: GridColumnSchema) => {
    switch (c.kind) {
      case 'no':
        return '번호';
      case 'link':
        return '링크';
      case 'button':
        return `버튼 [${c.buttonLabel ?? ''}]${c.whenValue ? ` (값이 ${c.whenValue}일 때)` : ''}`;
      case 'buttons':
        return `버튼 ${(c.buttons ?? []).map((b) => `[${b.label}]`).join(' ')}`;
      default:
        return '텍스트';
    }
  };
  const click = (c: GridColumnSchema) => {
    if (c.modal) return `팝업 '${modalTitle(c.modal)}' 열기`;
    const withModal = (c.buttons ?? []).filter((b) => b.modal);
    return withModal.length ? withModal.map((b) => `[${b.label}] → 팝업 '${modalTitle(b.modal!)}'`).join(', ') : '';
  };
  return {
    caption,
    columns: ['No', '열 제목', '데이터 키', '너비', '정렬', '표시 형태', '클릭 시'],
    rows: columns.map((c, i) => [String(i + 1), c.label, c.key, c.width === undefined ? '' : String(c.width), c.align ?? '가운데', kind(c), click(c)]),
  };
}

function filtersTable(rows: FilterSchema[][], detailFrom: number): SpecTable {
  const flat = rows.flat();
  return {
    caption: '검색 조건',
    columns: ['No', '조건명', '종류', '옵션 / 기본값', '비고'],
    rows: flat.map((f, i) => {
      const detail = detailFrom >= 0 && i >= detailFrom ? '상세검색' : '';
      switch (f.type) {
        case 'select':
          return [String(i + 1), f.options[0] ?? '', '선택', f.options.slice(1).join(' / '), detail];
        case 'dateRange':
          return [String(i + 1), '기간', '날짜 범위', [f.start, f.end].filter(Boolean).join(' ~ '), detail];
        case 'text':
          return [String(i + 1), f.placeholder ?? '검색어', '텍스트', '', detail];
        case 'checkbox':
          return [String(i + 1), f.label, '체크박스', f.checked ? '기본 체크' : '', detail];
      }
    }),
  };
}

/* ---------------------------------------------------------------- renderers */

const mdCell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function specToMarkdown(doc: SpecDoc): string {
  const out: string[] = [`# ${doc.title}`, ''];
  const table = (t: SpecTable) => {
    if (t.caption) out.push(`**${t.caption}**`, '');
    out.push(`| ${t.columns.map(mdCell).join(' | ')} |`, `| ${t.columns.map(() => '---').join(' | ')} |`);
    for (const r of t.rows) out.push(`| ${r.map(mdCell).join(' | ')} |`);
    out.push('');
  };
  for (const s of doc.sections) {
    out.push(`${'#'.repeat(s.level)} ${s.title}`, '');
    for (const n of s.notes ?? []) out.push(`- ${n}`);
    if (s.notes?.length) out.push('');
    for (const t of s.tables ?? []) table(t);
  }
  return out.join('\n');
}

export function specToHtml(doc: SpecDoc): string {
  const h = escapeHtml;
  const table = (t: SpecTable) =>
    `${t.caption ? `<p class="cap">${h(t.caption)}</p>` : ''}<table><thead><tr>${t.columns.map((c) => `<th>${h(c)}</th>`).join('')}</tr></thead><tbody>${t.rows
      .map((r) => `<tr>${r.map((c, i) => `<td class="${t.columns[i] === 'No' ? 'no' : ''}">${h(c)}</td>`).join('')}</tr>`)
      .join('')}</tbody></table>`;
  const body = doc.sections
    .map(
      (s) =>
        `<h${s.level}>${h(s.title)}</h${s.level}>${s.notes?.length ? `<ul>${s.notes.map((n) => `<li>${h(n)}</li>`).join('')}</ul>` : ''}${(s.tables ?? []).map(table).join('')}`,
    )
    .join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${h(doc.title)}</title>
<style>
body{font-family:"Malgun Gothic","Apple SD Gothic Neo","Noto Sans KR",sans-serif;font-size:12px;color:#222;margin:0;padding:28px 40px;max-width:1400px}
h1{font-size:22px;margin:0 0 6px}h2{font-size:16px;margin:28px 0 8px;padding-bottom:4px;border-bottom:2px solid #1b2a4a}h3{font-size:13px;margin:18px 0 6px;color:#1b2a4a}
table{border-collapse:collapse;width:100%;margin:4px 0 12px;page-break-inside:auto}th,td{border:1px solid #cfd4dc;padding:4px 7px;text-align:left;vertical-align:top}th{background:#eef1f6;font-weight:700;white-space:nowrap}td.no{text-align:center;width:28px;color:#777}
tr{page-break-inside:avoid}ul{margin:4px 0 8px;padding-left:18px}li{margin:2px 0}.cap{margin:8px 0 2px;font-weight:700;color:#444}
.bar{position:sticky;top:0;background:#fff;padding:8px 0 10px;margin-bottom:10px;border-bottom:1px solid #ddd;display:flex;gap:8px;align-items:center}
.bar button{font:inherit;padding:5px 12px;border:1px solid #1b2a4a;background:#1b2a4a;color:#fff;border-radius:4px;cursor:pointer}.sub{color:#777;font-size:11px}
@media print{.bar{display:none}body{padding:0}@page{size:A4 landscape;margin:14mm}}
</style></head><body>
<div class="bar"><button onclick="window.print()">인쇄 / PDF 저장</button><span class="sub">Digital Admin 화면 제너레이터에서 생성 · 표를 드래그해 복사하면 PPT/엑셀에 붙여넣을 수 있습니다</span></div>
<h1>${h(doc.title)}</h1>${body}</body></html>`;
}
