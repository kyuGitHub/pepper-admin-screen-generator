import type { BlockSchema, FieldCellSchema, GridColumnSchema, ScreenSchema, TableColumnSchema, TableRow } from '../schema/types';

/* Sample data generator: fills empty field values and empty grid/table rows with plausible Korean admin
   data guessed from each label, key and unit. Deterministic per key (seeded), never real customer data. */

const NAMES = ['김민수', '이서연', '박지훈', '최수아', '정우진', '강하은', '조현우', '윤서현', '장도윤', '임지우'];
const COMPANIES = ['페퍼상사', '한빛유통', '대한테크', '미래식품', '우리건설', '청솔물산'];
const PRODUCTS = ['페퍼스 개인신용대출', '페퍼스 사업자담보대출', '페퍼스 주택담보대출', '페퍼 파킹통장', '페퍼 정기예금'];
const CHANNELS = ['토스', '카카오페이', '핀다', '네이버페이', '알다', '뱅크샐러드', '자사앱'];
const STATUSES = ['정상', '진행중', '완료', '대기', '보류'];
const DISTRICTS = [
  '서울특별시 강남구 테헤란로',
  '경기도 성남시 분당구 판교로',
  '부산광역시 해운대구 센텀로',
  '대구광역시 수성구 동대구로',
  '인천광역시 연수구 송도과학로',
];
const SENTENCES = ['정상 처리되었습니다.', '추가 서류 확인이 필요합니다.', '고객 요청으로 변경되었습니다.', '시스템 자동 처리 건입니다.', '담당자 확인 완료.'];

/** Small seeded PRNG so the same key always yields the same value (stable thumbnails, diffs). */
function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const pick = <T>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)];
const int = (r: () => number, min: number, max: number) => Math.floor(min + r() * (max - min + 1));
const pad = (n: number, w = 2) => String(n).padStart(w, '0');
const fmtNum = (n: number) => n.toLocaleString('ko-KR');

function date(r: () => number) {
  return `2026-${pad(int(r, 1, 10))}-${pad(int(r, 1, 28))}`;
}
const datetime = (r: () => number) => `${date(r)} ${pad(int(r, 9, 18))}:${pad(int(r, 0, 59))}:${pad(int(r, 0, 59))}`;

export interface Hint {
  label: string;
  key: string;
  unit?: string;
  options?: string[];
}

const has = (s: string, ...words: string[]) => words.some((w) => s.includes(w));

/** Key split into lower-case tokens: `regAt` → [reg, at], `ch_code` → [ch, code]. Whole-token matching avoids "format" ⊃ "at". */
const tokens = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+|(?<=[a-z])(?=[A-Z])/)
    .filter(Boolean)
    .map((t) => t.toLowerCase());
const hasTok = (ts: string[], ...words: string[]) => words.some((w) => ts.includes(w));

/** Guesses one plausible value for a field or column. */
export function sampleValue(h: Hint, seed = h.key || h.label): string {
  const r = rng(`${seed}|${h.label}`);
  const l = h.label;
  const t = tokens(h.key);
  const u = h.unit ?? '';
  if (h.options?.length) {
    const opts = h.options.filter((o) => !/^(선택|전체|--)/.test(o));
    return pick(r, opts.length ? opts : h.options);
  }
  // units first: they are the strongest signal
  if (u === '%') return (int(r, 100, 1500) / 100).toFixed(2);
  if (u === '개월') return String(pick(r, [12, 24, 36, 48, 60]));
  if (u === '원') return fmtNum(int(r, 10, 3000) * 100000);
  if (u === '건' || u === '개' || u === '명' || u === '회') return String(int(r, 1, 120));
  if (u === '일') return String(int(r, 1, 30));
  // specific formats
  if (has(l, '휴대폰', '휴대전화', '전화', '연락처', 'HP') || hasTok(t, 'phone', 'mobile', 'tel', 'hp'))
    return `010-${pad(int(r, 1000, 9999), 4)}-${pad(int(r, 1000, 9999), 4)}`;
  if (has(l, '이메일', 'E-mail', 'email') || hasTok(t, 'email', 'mail'))
    return `${pick(r, ['pepper', 'minsu', 'seoyeon', 'admin', 'jihun'])}${int(r, 1, 99)}@example.com`;
  if (has(l, '주소') || hasTok(t, 'addr', 'address')) return `${pick(r, DISTRICTS)} ${int(r, 1, 300)}`;
  if (has(l, '사업자등록번호', '사업자번호') || hasTok(t, 'bizno', 'brn'))
    return `${pad(int(r, 100, 999), 3)}-${pad(int(r, 10, 99), 2)}-${pad(int(r, 10000, 99999), 5)}`;
  if (has(l, '주민', '생년월일') || hasTok(t, 'birth', 'birthday')) return `19${pad(int(r, 60, 99))}-${pad(int(r, 1, 12))}-${pad(int(r, 1, 28))}`;
  if (has(l, '계좌') || hasTok(t, 'account', 'acct', 'acc')) return `${pad(int(r, 100, 999), 3)}-${pad(int(r, 10, 99), 2)}-${pad(int(r, 100000, 999999), 6)}`;
  if (has(l, 'URL', 'url', '링크') || hasTok(t, 'url', 'link'))
    return `https://digital.pepperbank.kr/app/${pick(r, ['loan', 'deposit', 'event'])}/${int(r, 100, 999)}`;
  if (has(l, '일시', '시각') || hasTok(t, 'at', 'time', 'datetime', 'timestamp')) return datetime(r);
  if (has(l, '기간') || hasTok(t, 'period', 'range', 'term')) return [date(r), date(r)].sort().join(' ~ ');
  if (has(l, '일자', '날짜', '만기', '시작일', '종료일', '등록일', '신청일', '실행일') || hasTok(t, 'date', 'day', 'dt', 'ymd', 'from', 'to', 'start', 'end'))
    return date(r);
  if (has(l, '여부', 'YN', 'Y/N') || hasTok(t, 'yn', 'flag', 'is', 'use', 'enabled')) return pick(r, ['Y', 'N']);
  if (has(l, '번호', '코드', 'ID', '관리번호') || hasTok(t, 'id', 'code', 'cd', 'number', 'no', 'num'))
    return `${pick(r, ['MG', 'PL', 'DP', 'CH', 'AP'])}${date(r).replace(/-/g, '')}${pad(int(r, 1, 999), 5)}`;
  if (
    has(l, '금액', '잔액', '한도', '수수료', '원금', '이자', '급여', '소득', '매출') ||
    hasTok(t, 'amount', 'amt', 'balance', 'bal', 'limit', 'price', 'fee', 'principal')
  )
    return fmtNum(int(r, 10, 3000) * 100000);
  if (has(l, '금리', '이율', '비율', '율', '%') || hasTok(t, 'rate', 'ratio', 'pct', 'percent')) return (int(r, 100, 1500) / 100).toFixed(2);
  if (has(l, '건수', '수량', '횟수', '개수', '인원') || hasTok(t, 'count', 'cnt', 'qty')) return String(int(r, 1, 120));
  if (has(l, '순번', '순서') || hasTok(t, 'seq', 'order')) return String(int(r, 1, 50));
  if (has(l, '점수', '스코어') || hasTok(t, 'score')) return String(int(r, 500, 950));
  if (has(l, '나이', '연령') || hasTok(t, 'age')) return String(int(r, 20, 69));
  if (has(l, '색상') || hasTok(t, 'color')) return pick(r, ['#D33A2C', '#1B2A4A', '#2E7D32', '#F2A900']);
  // classifications before names (채널경로구분 is a 구분, not a 채널)
  if (has(l, '상태', '진행', '단계') || hasTok(t, 'status', 'state', 'step', 'stage')) return pick(r, STATUSES);
  if (has(l, '구분', '유형', '종류', '타입', '분류', '등급', '형식') || hasTok(t, 'type', 'kind', 'category', 'grade', 'class', 'format'))
    return pick(r, ['일반', '개인', '법인', '특수', 'A', 'B']);
  if (has(l, '상품') || hasTok(t, 'product', 'prod')) return pick(r, PRODUCTS);
  if (has(l, '채널', '매체', '유입') || hasTok(t, 'channel', 'media', 'source')) return pick(r, CHANNELS);
  if (has(l, '회사명', '업체명', '상호', '사업장명', '거래처') || hasTok(t, 'company', 'corp', 'biz')) return pick(r, COMPANIES);
  if (
    has(l, '고객명', '성명', '이름', '담당자', '처리자', '등록자', '변경자', '신청자', '작성자', '승인자', '심사자') ||
    hasTok(t, 'name', 'user', 'by', 'owner')
  ) {
    const n = pick(r, NAMES);
    return has(l, '처리자', '등록자', '변경자', '담당자', '승인자', '심사자', '작성자') || hasTok(t, 'by') ? `${n}(${int(r, 200000, 299999)})` : n;
  }
  if (has(l, '메모', '내용', '설명', '사유', '비고', '안내', '제목') || hasTok(t, 'memo', 'desc', 'note', 'reason', 'title', 'content', 'text'))
    return pick(r, SENTENCES);
  return `${l || '샘플'} ${int(r, 1, 9)}`;
}

/* ---------------------------------------------------------------- walking the schema */

function* fields(blocks: BlockSchema[]): Generator<{ field: FieldCellSchema; editable?: boolean }> {
  for (const b of blocks) {
    switch (b.type) {
      case 'fields':
        for (const row of b.rows) for (const c of row) if ('key' in c) yield { field: c, editable: b.editable };
        break;
      case 'section':
      case 'collapsible':
        yield* fields(b.blocks);
        break;
      case 'tabs':
        for (const t of b.items) yield* fields(t.blocks);
        break;
    }
  }
}

function* tables(blocks: BlockSchema[]): Generator<{ table: string; columns: (GridColumnSchema | TableColumnSchema)[]; rows: number }> {
  for (const b of blocks) {
    switch (b.type) {
      case 'grid':
        yield { table: b.table, columns: b.columns, rows: Math.min(b.pagination?.pageSize ?? 10, 20) };
        break;
      case 'table':
        yield { table: b.table, columns: b.columns, rows: 4 };
        break;
      case 'section':
      case 'collapsible':
        yield* tables(b.blocks);
        break;
      case 'tabs':
        for (const t of b.items) yield* tables(t.blocks);
        break;
    }
  }
}

function* allBlocks(schema: ScreenSchema): Generator<BlockSchema[]> {
  for (const p of schema.summary) yield p.blocks;
  if (schema.body) yield schema.body;
  for (const t of schema.tabs)
    for (const col of t.layout?.columns ?? [])
      for (const item of col.items) {
        if (item.kind === 'panel') yield item.blocks;
        else for (const p of item.panels) yield p.blocks;
      }
  for (const m of schema.modals ?? []) yield m.blocks;
}

/** Keys of repeat-group instances: every template key gets each instance suffix. */
function repeatKeys(schema: ScreenSchema): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const t of schema.tabs)
    for (const col of t.layout?.columns ?? [])
      for (const item of col.items)
        if (item.kind === 'repeat')
          for (const p of item.panels)
            for (const { field } of fields(p.blocks))
              map.set(
                field.key,
                item.instances.map((i) => field.key + i.keySuffix),
              );
  return map;
}

export interface FillOptions {
  /** `empty` fills only blank values and empty tables (default); `all` regenerates everything. */
  mode?: 'empty' | 'all';
}

/** Returns a copy of the schema with sample values/rows filled in. */
export function fillSampleData(schema: ScreenSchema, { mode = 'empty' }: FillOptions = {}): ScreenSchema {
  const values = { ...schema.data.values };
  const tbls = { ...schema.data.tables };
  const repeats = repeatKeys(schema);
  const seen = new Set<string>();

  for (const blocks of allBlocks(schema))
    for (const { field } of fields(blocks)) {
      const keys = repeats.get(field.key) ?? [field.key];
      for (const key of keys) {
        if (!key || seen.has(key)) continue;
        seen.add(key);
        const cur = values[key];
        if (mode === 'empty' && cur !== undefined && cur !== '') continue;
        const options = field.control?.type === 'select' ? field.control.options : undefined;
        values[key] = sampleValue({ label: field.label, key, unit: field.unit, options }, key);
      }
    }

  for (const blocks of allBlocks(schema))
    for (const t of tables(blocks)) {
      const existing = tbls[t.table];
      if (mode === 'empty' && existing && existing.length > 0) continue;
      const rows: TableRow[] = [];
      for (let i = 0; i < t.rows; i++) {
        const row: TableRow = {};
        for (const c of t.columns) {
          if ('kind' in c && c.kind === 'no') continue;
          if ('kind' in c && (c.kind === 'button' || c.kind === 'buttons')) {
            row[c.key] = 'Y';
            continue;
          }
          row[c.key] = sampleValue({ label: c.label, key: c.key }, `${t.table}.${c.key}#${i}`);
        }
        rows.push(row);
      }
      tbls[t.table] = rows;
    }

  return { ...schema, data: { values, tables: tbls } };
}

/** Counts blank field values and empty tables, for the editor's hint. */
export function countEmpty(schema: ScreenSchema): { values: number; tables: number } {
  const filled = fillSampleData(schema, { mode: 'empty' });
  const values = Object.keys(filled.data.values).filter((k) => !schema.data.values[k]).length;
  const tables = Object.keys(filled.data.tables).filter((k) => !schema.data.tables[k]?.length).length;
  return { values, tables };
}
