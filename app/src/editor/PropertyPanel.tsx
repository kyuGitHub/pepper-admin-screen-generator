import type { ReactNode } from 'react';
import { Button, Checkbox, Input, Select, Textarea } from '../design-system';
import type {
  ActionSchema,
  BlockSchema,
  FieldCellSchema,
  FilterSchema,
  GridColumnSchema,
  ModalSchema,
  PanelSchema,
  ScreenSchema,
  TabSchema,
} from '../schema/types';
import { useEditorRequired, type Selection } from './EditorContext';
import { getAt, insertAt, updateAt, type Path } from './paths';
import { newAction, newColumn, newField, newFilter, newPanel, newTab } from './templates';

/* Right-hand property panel of the click editor: one small form per selection kind. */

const VARIANTS = ['primary', 'outline', 'danger', 'success-outline', 'ghost'];
const MASKS = ['', 'name', 'phone', 'email', 'address', 'default'];
const CONTROLS = ['', 'select', 'text', 'date', 'time', 'textarea', 'file', 'color'];

export function PropertyPanel() {
  const ed = useEditorRequired();
  const { selection, draft } = ed;
  const content = selection ? <SelectionForm sel={selection} /> : <Hint />;
  return (
    <aside
      data-testid="property-panel"
      style={{
        width: 320,
        flexShrink: 0,
        borderLeft: '1px solid var(--border-default)',
        background: '#fff',
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        color: 'var(--pp-gray-900)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-default)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
        속성
        {selection && <span style={{ fontWeight: 400, color: 'var(--pp-gray-500)' }}>{kindLabel(selection, draft)}</span>}
        {selection && (
          <button
            type="button"
            onClick={() => ed.select(null)}
            style={{ marginLeft: 'auto', border: 0, background: 'none', cursor: 'pointer', color: 'var(--pp-gray-500)' }}
          >
            선택 해제
          </button>
        )}
      </div>
      <div style={{ padding: 14, overflow: 'auto', flex: 1 }}>{content}</div>
    </aside>
  );
}

function kindLabel(sel: Selection, draft: ScreenSchema) {
  const node = getAt(draft, sel.path) as Record<string, unknown> | undefined;
  const name = (node && ((node.label as string) || (node.title as string))) || (sel.kind === 'screen' ? draft.title : '');
  return name ? `· ${name}` : '';
}

function Hint() {
  return (
    <div style={{ color: 'var(--pp-gray-500)', lineHeight: 1.7 }}>
      미리보기에서 요소를 클릭하면 여기에서 고칠 수 있습니다.
      <ul style={{ margin: '8px 0 0', paddingLeft: 16 }}>
        <li>화면 제목 → 제목·즐겨찾기·탭/패널 추가</li>
        <li>패널 제목 영역 → 제목·버튼·필드 추가, 삭제·순서</li>
        <li>필드 라벨/값 → 라벨·값·단위·입력형태</li>
        <li>버튼, 탭, 그리드 열, 검색조건 → 이름·종류·순서</li>
      </ul>
      <div style={{ marginTop: 10 }}>팝업은 미리보기에서 열어 둔 상태에서 제목을 클릭합니다.</div>
    </div>
  );
}

/* ---------------------------------------------------------------- shared form bits */

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div style={{ width: 72, flexShrink: 0, color: 'var(--pp-gray-600)' }}>{label}</div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function Text({ value, onChange, placeholder }: { value: string | undefined; onChange: (v: string) => void; placeholder?: string }) {
  return <Input value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ width: '100%' }} />;
}

function Num({ value, onChange }: { value: number | undefined; onChange: (v: number | undefined) => void }) {
  return (
    <Input
      value={value === undefined ? '' : String(value)}
      onChange={(e) => {
        const t = e.target.value.trim();
        onChange(t === '' ? undefined : Number(t) || 0);
      }}
      style={{ width: '100%' }}
    />
  );
}

function Pick({
  value,
  options,
  labels,
  onChange,
}: {
  value: string | undefined;
  options: string[];
  labels?: Record<string, string>;
  onChange: (v: string) => void;
}) {
  return (
    <Select
      value={value ?? ''}
      options={options.map((o) => ({ value: o, label: labels?.[o] ?? (o || '(없음)') }))}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%' }}
    />
  );
}

function Lines({ value, onChange, rows = 4 }: { value: string[] | undefined; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <Textarea
      rows={rows}
      value={(value ?? []).join('\n')}
      onChange={(e) => onChange(e.target.value.split('\n'))}
      style={{ width: '100%', boxSizing: 'border-box' }}
    />
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--pp-gray-150)' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{children}</div>;
}

/** 순서/삭제 buttons for anything that lives in an array. */
function ArrayOps({ path, onAdd, addLabel, noun }: { path: Path; onAdd?: () => void; addLabel?: string; noun: string }) {
  const ed = useEditorRequired();
  const parent = getAt(ed.draft, path.slice(0, -1));
  const len = Array.isArray(parent) ? parent.length : 0;
  const idx = path[path.length - 1] as number;
  return (
    <Actions>
      <Button size="sm" variant="outline" disabled={idx <= 0} onClick={() => ed.move(path, -1)}>
        ↑ 앞으로
      </Button>
      <Button size="sm" variant="outline" disabled={idx >= len - 1} onClick={() => ed.move(path, 1)}>
        ↓ 뒤로
      </Button>
      {onAdd && (
        <Button size="sm" variant="outline" onClick={onAdd}>
          {addLabel ?? `+ ${noun} 추가`}
        </Button>
      )}
      <Button size="sm" variant="danger" onClick={() => window.confirm(`이 ${noun}을(를) 삭제할까요?`) && ed.remove(path)}>
        {noun} 삭제
      </Button>
    </Actions>
  );
}

/** Editable list of actions (panel header, toolbar, modal footer). */
function ActionList({ path, title = '버튼' }: { path: Path; title?: string }) {
  const ed = useEditorRequired();
  const list = (getAt(ed.draft, path) as ActionSchema[] | undefined) ?? [];
  return (
    <Group title={title}>
      {list.map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
          <Input value={actionLabel(a)} onChange={(e) => ed.set([...path, i, 'label'], e.target.value)} style={{ flex: 1 }} />
          <span style={{ color: 'var(--pp-gray-500)', width: 44 }}>{ACTION_TYPES[a.type]}</span>
          <button type="button" onClick={() => ed.select({ kind: 'action', path: [...path, i] })} style={linkBtn}>
            상세
          </button>
          <button type="button" onClick={() => ed.remove([...path, i])} style={{ ...linkBtn, color: 'var(--bs-danger)' }}>
            삭제
          </button>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => ed.insert([...path, list.length], newAction())}>
        + 버튼 추가
      </Button>
    </Group>
  );
}

const linkBtn = { border: 0, background: 'none', cursor: 'pointer', color: 'var(--pp-navy-800)', padding: 0, fontSize: 12 } as const;

const ACTION_TYPES: Record<ActionSchema['type'], string> = {
  button: '일반',
  edit: '수정',
  history: '이력',
  modal: '팝업',
  formSave: '저장',
  detailToggle: '상세',
};
const ACTION_DEFAULT_LABEL: Record<ActionSchema['type'], string> = {
  button: '',
  edit: '수정',
  history: '정보변경이력',
  modal: '',
  formSave: '저장',
  detailToggle: '상세검색',
};
const actionLabel = (a: ActionSchema) => a.label ?? ACTION_DEFAULT_LABEL[a.type];

/* ---------------------------------------------------------------- per-kind forms */

function SelectionForm({ sel }: { sel: Selection }) {
  switch (sel.kind) {
    case 'screen':
      return <ScreenForm />;
    case 'panel':
      return <PanelForm path={sel.path} />;
    case 'field':
      return <FieldForm path={sel.path} dataKey={sel.dataKey} />;
    case 'action':
      return <ActionForm path={sel.path} />;
    case 'tab':
      return <TabForm path={sel.path} />;
    case 'column':
      return <ColumnForm path={sel.path} />;
    case 'filter':
      return <FilterForm path={sel.path} />;
    case 'modal':
      return <ModalForm path={sel.path} />;
    case 'block':
      return <BlockForm path={sel.path} />;
  }
}

function ScreenForm() {
  const ed = useEditorRequired();
  const s = ed.draft;
  const fav = s.favorite === undefined ? 'none' : s.favorite ? 'on' : 'off';
  return (
    <>
      <Row label="화면 제목">
        <Text value={s.title} onChange={(v) => ed.set(['title'], v)} />
      </Row>
      <Row label="즐겨찾기">
        <Pick
          value={fav}
          options={['none', 'off', 'on']}
          labels={{ none: '표시 안 함', off: '빈 별', on: '채워진 별' }}
          onChange={(v) => ed.set(['favorite'], v === 'none' ? undefined : v === 'on')}
        />
      </Row>
      <Row label="환경 표시">
        <Text value={s.shell.header.envLabel} onChange={(v) => ed.set(['shell', 'header', 'envLabel'], v || undefined)} placeholder="테스트(Staging)" />
      </Row>
      <Row label="사용자">
        <Text value={s.shell.header.userName} onChange={(v) => ed.set(['shell', 'header', 'userName'], v)} />
      </Row>
      <ActionList path={['toolbar', 'actions']} title="툴바 버튼" />
      <Group title="구성">
        <Actions>
          <Button size="sm" variant="outline" onClick={() => ed.insert(['tabs', s.tabs.length], newTab())}>
            + 탭 추가
          </Button>
          <Button size="sm" variant="outline" onClick={() => ed.insert(['summary', s.summary.length], newPanel())}>
            + 상단 패널 추가
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => ed.insert(['modals', s.modals?.length ?? 0], { id: `modal_${Date.now().toString(36)}`, title: '새 팝업', width: 600, blocks: [] })}
          >
            + 팝업 추가
          </Button>
        </Actions>
        <div style={{ color: 'var(--pp-gray-500)', marginTop: 8, lineHeight: 1.6 }}>
          탭 {s.tabs.length}개 · 상단 패널 {s.summary.length}개 · 팝업 {s.modals?.length ?? 0}개
        </div>
      </Group>
    </>
  );
}

function PanelForm({ path }: { path: Path }) {
  const ed = useEditorRequired();
  const p = getAt(ed.draft, path) as PanelSchema | undefined;
  if (!p) return null;
  const addField = () => ed.commit(appendField(ed.draft, path));
  const addPanel = () => ed.insert([...path.slice(0, -1), (path[path.length - 1] as number) + 1], newPanel());
  return (
    <>
      <Row label="패널 제목">
        <Text value={p.title} onChange={(v) => ed.set([...path, 'title'], v)} />
      </Row>
      <Row label="보조 문구">
        <Text value={typeof p.meta === 'string' ? p.meta : ''} onChange={(v) => ed.set([...path, 'meta'], v || undefined)} placeholder="예: ({rows:loans}건)" />
      </Row>
      <Row label="이력 구분">
        <Text value={p.historySection} onChange={(v) => ed.set([...path, 'historySection'], v || undefined)} placeholder={p.title} />
      </Row>
      <ActionList path={[...path, 'actions']} title="패널 버튼" />
      <Group title="내용">
        <Actions>
          <Button size="sm" variant="outline" onClick={addField}>
            + 필드 추가
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => ed.insert([...path, 'blocks', p.blocks.length], { type: 'heading', text: '새 소제목' } satisfies BlockSchema)}
          >
            + 소제목 추가
          </Button>
          <Button size="sm" variant="outline" onClick={() => ed.insert([...path, 'blocks', p.blocks.length], { type: 'divider' } satisfies BlockSchema)}>
            + 구분선 추가
          </Button>
        </Actions>
        <div style={{ color: 'var(--pp-gray-500)', marginTop: 8 }}>
          블록 {p.blocks.length}개 · 필드 {countFields(p.blocks)}개
        </div>
      </Group>
      <Group title="패널">
        <ArrayOps path={path} noun="패널" onAdd={addPanel} />
      </Group>
    </>
  );
}

function countFields(blocks: BlockSchema[]): number {
  return blocks.reduce((n, b) => {
    if (b.type === 'fields') return n + b.rows.flat().filter((c) => 'key' in c).length;
    if ('blocks' in b && Array.isArray(b.blocks)) return n + countFields(b.blocks);
    return n;
  }, 0);
}

/** Appends a field to the panel's last `fields` block (new row when the last one is full); creates the block when missing. */
function appendField(draft: ScreenSchema, panelPath: Path): ScreenSchema {
  const p = getAt(draft, panelPath) as PanelSchema;
  const bi = [...p.blocks]
    .map((b, i) => (b.type === 'fields' ? i : -1))
    .filter((i) => i >= 0)
    .pop();
  if (bi === undefined) {
    return insertAt(draft, [...panelPath, 'blocks', p.blocks.length], { type: 'fields', columns: 3, rows: [[newField()]] } satisfies BlockSchema);
  }
  const b = p.blocks[bi] as Extract<BlockSchema, { type: 'fields' }>;
  const last = b.rows[b.rows.length - 1];
  const used = last ? last.reduce((n, c) => n + ('blank' in c ? c.blank : (c.span ?? 1)), 0) : b.columns;
  if (!last || used >= b.columns) return insertAt(draft, [...panelPath, 'blocks', bi, 'rows', b.rows.length], [newField()]);
  return insertAt(draft, [...panelPath, 'blocks', bi, 'rows', b.rows.length - 1, last.length], newField());
}

function FieldForm({ path, dataKey }: { path: Path; dataKey?: string }) {
  const ed = useEditorRequired();
  const f = getAt(ed.draft, path) as FieldCellSchema | undefined;
  if (!f) return null;
  const key = dataKey ?? f.key;
  const value = ed.draft.data.values[key] ?? '';
  const rowPath = path.slice(0, -1);
  const blockPath = rowPath.slice(0, -2);
  const block = getAt(ed.draft, blockPath) as Extract<BlockSchema, { type: 'fields' }> | undefined;
  const control = f.control?.type ?? '';
  return (
    <>
      <Row label="라벨">
        <Text value={f.label} onChange={(v) => ed.set([...path, 'label'], v)} />
      </Row>
      <Row label="값">
        {control === 'textarea' ? (
          <Lines value={value.split('\n')} onChange={(v) => ed.set(['data', 'values', key], v.join('\n'))} rows={3} />
        ) : (
          <Text value={value} onChange={(v) => ed.set(['data', 'values', key], v)} />
        )}
      </Row>
      <Row label="데이터 키">
        <Text value={f.key} onChange={(v) => ed.set([...path, 'key'], v.trim())} />
      </Row>
      <Row label="단위">
        <Text value={f.unit} onChange={(v) => ed.set([...path, 'unit'], v || undefined)} placeholder="원, %, 개월" />
      </Row>
      <Row label="칸 수">
        <Pick
          value={String(f.span ?? 1)}
          options={Array.from({ length: block?.columns ?? 4 }, (_, i) => String(i + 1))}
          onChange={(v) => ed.set([...path, 'span'], v === '1' ? undefined : Number(v))}
        />
      </Row>
      <Row label="마스킹">
        <Pick
          value={f.mask ?? ''}
          options={MASKS}
          labels={{ '': '없음', name: '이름', phone: '전화번호', email: '이메일', address: '주소', default: '전체' }}
          onChange={(v) => ed.set([...path, 'mask'], v || undefined)}
        />
      </Row>
      <Row label="입력 형태">
        <Pick
          value={control}
          options={CONTROLS}
          labels={{ '': '읽기 전용 값', select: '선택(셀렉트)', text: '텍스트', date: '날짜', time: '시간', textarea: '여러 줄', file: '파일', color: '색상' }}
          onChange={(v) => ed.set([...path, 'control'], v ? controlFor(v, f) : undefined)}
        />
      </Row>
      {f.control?.type === 'select' && (
        <Row label="선택 항목">
          <Lines value={f.control.options} onChange={(v) => ed.set([...path, 'control', 'options'], v)} />
        </Row>
      )}
      {(f.control?.type === 'text' || f.control?.type === 'select') && (
        <Row label="안내 문구">
          <Text value={f.control.placeholder} onChange={(v) => ed.set([...path, 'control', 'placeholder'], v || undefined)} />
        </Row>
      )}
      <Row label="옆 버튼">
        <Text
          value={f.button?.label}
          onChange={(v) => ed.set([...path, 'button'], v ? { label: v, variant: f.button?.variant ?? 'outline' } : undefined)}
          placeholder="예: 체크리스트"
        />
      </Row>
      <Row label="옵션">
        <Checkbox label="수정 불가(회색)" checked={!!f.readOnly} onChange={(v) => ed.set([...path, 'readOnly'], v || undefined)} />
      </Row>
      <Group title="필드">
        <ArrayOps path={path} noun="필드" onAdd={() => ed.insert([...rowPath, (path[path.length - 1] as number) + 1], newField())} />
        <Actions>
          <Button size="sm" variant="outline" onClick={() => ed.insert([...blockPath, 'rows', (rowPath[rowPath.length - 1] as number) + 1], [newField()])}>
            + 아래에 행 추가
          </Button>
          {block && (
            <Button size="sm" variant="outline" onClick={() => window.confirm('이 행 전체를 삭제할까요?') && ed.remove(rowPath)}>
              행 삭제
            </Button>
          )}
        </Actions>
      </Group>
      {block && (
        <Group title="필드 표">
          <Row label="열 수">
            <Pick value={String(block.columns)} options={['1', '2', '3', '4']} onChange={(v) => ed.set([...blockPath, 'columns'], Number(v))} />
          </Row>
          <Row label="라벨 정렬">
            <Pick
              value={block.labelAlign ?? 'left'}
              options={['left', 'right']}
              labels={{ left: '왼쪽', right: '오른쪽' }}
              onChange={(v) => ed.set([...blockPath, 'labelAlign'], v === 'left' ? undefined : v)}
            />
          </Row>
          <Row label="편집 가능">
            <Checkbox label="모든 필드를 입력창으로" checked={!!block.editable} onChange={(v) => ed.set([...blockPath, 'editable'], v || undefined)} />
          </Row>
        </Group>
      )}
    </>
  );
}

function controlFor(type: string, f: FieldCellSchema): FieldCellSchema['control'] {
  switch (type) {
    case 'select':
      return { type: 'select', options: f.control?.type === 'select' ? f.control.options : ['선택', '항목 1', '항목 2'] };
    case 'text':
      return { type: 'text' };
    case 'textarea':
      return { type: 'textarea', rows: 3 };
    case 'date':
    case 'time':
    case 'file':
    case 'color':
      return { type };
    default:
      return undefined;
  }
}

function ActionForm({ path }: { path: Path }) {
  const ed = useEditorRequired();
  const a = getAt(ed.draft, path) as ActionSchema | undefined;
  if (!a) return null;
  const modals = ed.draft.modals ?? [];
  const setType = (t: ActionSchema['type']) => {
    const label = actionLabel(a) || ACTION_DEFAULT_LABEL[t];
    const next: ActionSchema =
      t === 'modal'
        ? { type: 'modal', label: label || '새 버튼', modal: modals[0]?.id ?? '' }
        : t === 'button'
          ? { type: 'button', label: label || '새 버튼', variant: 'outline' }
          : { type: t, label };
    ed.set(path, next);
  };
  return (
    <>
      <Row label="버튼명">
        <Text value={actionLabel(a)} onChange={(v) => ed.set([...path, 'label'], v)} />
      </Row>
      <Row label="동작">
        <Pick
          value={a.type}
          options={Object.keys(ACTION_TYPES)}
          labels={{
            button: '없음(목업)',
            edit: '패널 수정 모드',
            history: '정보변경이력 열기',
            modal: '팝업 열기',
            formSave: '변경 저장',
            detailToggle: '상세검색 펼침',
          }}
          onChange={(v) => setType(v as ActionSchema['type'])}
        />
      </Row>
      {a.type === 'modal' && (
        <Row label="팝업">
          <Pick
            value={a.modal}
            options={modals.map((m) => m.id)}
            labels={Object.fromEntries(modals.map((m) => [m.id, m.title]))}
            onChange={(v) => ed.set([...path, 'modal'], v)}
          />
        </Row>
      )}
      {(a.type === 'button' || a.type === 'history' || a.type === 'modal') && (
        <Row label="스타일">
          <Pick
            value={a.variant ?? (a.type === 'button' ? 'outline' : 'outline')}
            options={VARIANTS}
            labels={{ primary: '강조(네이비)', outline: '외곽선', danger: '경고(빨강)', 'success-outline': '초록 외곽선', ghost: '텍스트' }}
            onChange={(v) => ed.set([...path, 'variant'], v)}
          />
        </Row>
      )}
      <Group title="버튼">
        <ArrayOps path={path} noun="버튼" onAdd={() => ed.insert([...path.slice(0, -1), (path[path.length - 1] as number) + 1], newAction())} />
      </Group>
    </>
  );
}

function TabForm({ path }: { path: Path }) {
  const ed = useEditorRequired();
  const t = getAt(ed.draft, path) as TabSchema | undefined;
  if (!t) return null;
  const cols = t.layout?.columns ?? [];
  return (
    <>
      <Row label="탭 이름">
        <Text value={t.label} onChange={(v) => ed.set([...path, 'label'], v)} />
      </Row>
      <Group title="탭 내용">
        {t.layout ? (
          <>
            <div style={{ color: 'var(--pp-gray-500)', marginBottom: 6 }}>{cols.map((c, i) => `${i + 1}열 ${c.items.length}개`).join(' · ')}</div>
            <Actions>
              {cols.map((c, i) => (
                <Button key={i} size="sm" variant="outline" onClick={() => ed.insert([...path, 'layout', 'columns', i, 'items', c.items.length], newPanel())}>
                  + {i + 1}열에 패널 추가
                </Button>
              ))}
            </Actions>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={() => ed.set([...path, 'layout'], newTab().layout)}>
            + 2열 레이아웃 만들기
          </Button>
        )}
      </Group>
      <Group title="탭">
        <ArrayOps path={path} noun="탭" onAdd={() => ed.insert([...path.slice(0, -1), (path[path.length - 1] as number) + 1], newTab())} />
      </Group>
    </>
  );
}

function ColumnForm({ path }: { path: Path }) {
  const ed = useEditorRequired();
  const c = getAt(ed.draft, path) as GridColumnSchema | undefined;
  if (!c) return null;
  const gridPath = path.slice(0, -2);
  const grid = getAt(ed.draft, gridPath) as Extract<BlockSchema, { type: 'grid' }> | undefined;
  const rows = grid ? (ed.draft.data.tables[grid.table] ?? []) : [];
  const sample = rows.slice(0, 3).map((r) => r[c.key] ?? '');
  return (
    <>
      <Row label="열 제목">
        <Text value={c.label} onChange={(v) => ed.set([...path, 'label'], v)} />
      </Row>
      <Row label="데이터 키">
        <Text value={c.key} onChange={(v) => ed.set([...path, 'key'], v.trim())} />
      </Row>
      <Row label="너비(px)">
        <Num value={typeof c.width === 'number' ? c.width : undefined} onChange={(v) => ed.set([...path, 'width'], v)} />
      </Row>
      <Row label="정렬">
        <Pick
          value={c.align ?? 'center'}
          options={['left', 'center', 'right']}
          labels={{ left: '왼쪽', center: '가운데', right: '오른쪽' }}
          onChange={(v) => ed.set([...path, 'align'], v)}
        />
      </Row>
      <Row label="표시 형태">
        <Pick
          value={c.kind ?? 'text'}
          options={['text', 'no', 'link', 'button']}
          labels={{ text: '텍스트', no: '번호', link: '링크', button: '버튼' }}
          onChange={(v) => ed.set([...path, 'kind'], v === 'text' ? undefined : v)}
        />
      </Row>
      {c.kind === 'button' && (
        <Row label="버튼명">
          <Text value={c.buttonLabel} onChange={(v) => ed.set([...path, 'buttonLabel'], v)} />
        </Row>
      )}
      {(c.kind === 'link' || c.kind === 'button') && (
        <Row label="열 팝업">
          <Pick
            value={c.modal ?? ''}
            options={['', ...(ed.draft.modals ?? []).map((m) => m.id)]}
            labels={{ '': '없음', ...Object.fromEntries((ed.draft.modals ?? []).map((m) => [m.id, m.title])) }}
            onChange={(v) => ed.set([...path, 'modal'], v || undefined)}
          />
        </Row>
      )}
      <Row label="옵션">
        <Checkbox label="굵게" checked={!!c.bold} onChange={(v) => ed.set([...path, 'bold'], v || undefined)} />
      </Row>
      {grid && (
        <Group title={`샘플 값 (${grid.table}, ${rows.length}행)`}>
          {sample.map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <span style={{ color: 'var(--pp-gray-500)', width: 20 }}>{i + 1}</span>
              <Input value={v} onChange={(e) => ed.set(['data', 'tables', grid.table, i, c.key], e.target.value)} style={{ flex: 1 }} />
            </div>
          ))}
          {rows.length > 3 && <div style={{ color: 'var(--pp-gray-500)' }}>… 나머지 행은 JSON에서 수정</div>}
        </Group>
      )}
      <Group title="열">
        <ArrayOps path={path} noun="열" onAdd={() => ed.insert([...path.slice(0, -1), (path[path.length - 1] as number) + 1], newColumn())} />
      </Group>
    </>
  );
}

function FilterForm({ path }: { path: Path }) {
  const ed = useEditorRequired();
  const f = getAt(ed.draft, path) as FilterSchema | undefined;
  if (!f) return null;
  const setType = (t: FilterSchema['type']) => {
    const next: FilterSchema =
      t === 'select'
        ? { type: 'select', options: ['조건', '전체'] }
        : t === 'dateRange'
          ? { type: 'dateRange' }
          : t === 'text'
            ? { type: 'text', placeholder: '검색어' }
            : { type: 'checkbox', label: '옵션' };
    ed.set(path, next);
  };
  return (
    <>
      <Row label="조건 종류">
        <Pick
          value={f.type}
          options={['select', 'dateRange', 'text', 'checkbox']}
          labels={{ select: '선택(셀렉트)', dateRange: '기간', text: '텍스트', checkbox: '체크박스' }}
          onChange={(v) => setType(v as FilterSchema['type'])}
        />
      </Row>
      {f.type === 'select' && (
        <Row label="항목">
          <Lines value={f.options} onChange={(v) => ed.set([...path, 'options'], v)} />
        </Row>
      )}
      {f.type === 'text' && (
        <Row label="안내 문구">
          <Text value={f.placeholder} onChange={(v) => ed.set([...path, 'placeholder'], v || undefined)} />
        </Row>
      )}
      {f.type === 'checkbox' && (
        <>
          <Row label="라벨">
            <Text value={f.label} onChange={(v) => ed.set([...path, 'label'], v)} />
          </Row>
          <Row label="기본값">
            <Checkbox label="체크됨" checked={!!f.checked} onChange={(v) => ed.set([...path, 'checked'], v || undefined)} />
          </Row>
        </>
      )}
      {f.type === 'dateRange' && (
        <>
          <Row label="시작일">
            <Text value={f.start} onChange={(v) => ed.set([...path, 'start'], v || undefined)} placeholder="2025-01-01" />
          </Row>
          <Row label="종료일">
            <Text value={f.end} onChange={(v) => ed.set([...path, 'end'], v || undefined)} placeholder="2025-12-31" />
          </Row>
        </>
      )}
      {(f.type === 'select' || f.type === 'text') && (
        <Row label="너비(px)">
          <Num value={f.width} onChange={(v) => ed.set([...path, 'width'], v)} />
        </Row>
      )}
      <Group title="검색 조건">
        <ArrayOps path={path} noun="조건" onAdd={() => ed.insert([...path.slice(0, -1), (path[path.length - 1] as number) + 1], newFilter())} />
      </Group>
    </>
  );
}

function ModalForm({ path }: { path: Path }) {
  const ed = useEditorRequired();
  const m = getAt(ed.draft, path) as ModalSchema | undefined;
  if (!m) return null;
  const footer = m.footer ?? {};
  return (
    <>
      <Row label="팝업 제목">
        <Text value={m.title} onChange={(v) => ed.set([...path, 'title'], v)} />
      </Row>
      <Row label="너비(px)">
        <Num value={m.width} onChange={(v) => ed.set([...path, 'width'], v)} />
      </Row>
      <Row label="ID">
        <Input value={m.id} readOnly style={{ width: '100%' }} />
      </Row>
      <Group title="내용">
        <Actions>
          <Button size="sm" variant="outline" onClick={() => ed.commit(appendModalField(ed.draft, path))}>
            + 필드 추가
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => ed.insert([...path, 'blocks', m.blocks.length], { type: 'heading', text: '새 소제목' } satisfies BlockSchema)}
          >
            + 소제목 추가
          </Button>
        </Actions>
      </Group>
      {footer.left || footer.right ? (
        <>
          <ActionList path={[...path, 'footer', 'left']} title="하단 왼쪽 버튼" />
          <ActionList path={[...path, 'footer', 'right']} title="하단 오른쪽 버튼" />
        </>
      ) : (
        <Group title="하단 버튼">
          <div style={{ color: 'var(--pp-gray-500)', marginBottom: 6 }}>기본 [닫기] 버튼이 표시됩니다.</div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              ed.set([...path, 'footer'], {
                right: [
                  { type: 'button', label: '취소', variant: 'outline' },
                  { type: 'button', label: '저장', variant: 'primary' },
                ],
              })
            }
          >
            [취소][저장] 버튼으로 바꾸기
          </Button>
        </Group>
      )}
      <Group title="팝업">
        <Actions>
          <Button
            size="sm"
            variant="danger"
            onClick={() => window.confirm('이 팝업을 삭제할까요? 이 팝업을 여는 버튼은 동작하지 않게 됩니다.') && ed.remove(path)}
          >
            팝업 삭제
          </Button>
        </Actions>
      </Group>
    </>
  );
}

function appendModalField(draft: ScreenSchema, modalPath: Path): ScreenSchema {
  const m = getAt(draft, modalPath) as ModalSchema;
  const bi = [...m.blocks]
    .map((b, i) => (b.type === 'fields' ? i : -1))
    .filter((i) => i >= 0)
    .pop();
  if (bi === undefined)
    return insertAt(draft, [...modalPath, 'blocks', m.blocks.length], {
      type: 'fields',
      columns: 2,
      editable: true,
      rows: [[newField()]],
    } satisfies BlockSchema);
  return updateAt(draft, [...modalPath, 'blocks', bi, 'rows'], (rows) => [...(rows as unknown[]), [newField()]]);
}

function BlockForm({ path }: { path: Path }) {
  const ed = useEditorRequired();
  const b = getAt(ed.draft, path) as BlockSchema | undefined;
  if (!b) return null;
  if (b.type === 'heading') {
    return (
      <>
        <Row label="소제목">
          <Text value={typeof b.text === 'string' ? b.text : ''} onChange={(v) => ed.set([...path, 'text'], v)} />
        </Row>
        <Row label="보조 문구">
          <Text value={typeof b.meta === 'string' ? b.meta : ''} onChange={(v) => ed.set([...path, 'meta'], v || undefined)} />
        </Row>
        <Group title="소제목">
          <ArrayOps path={path} noun="소제목" />
        </Group>
      </>
    );
  }
  return (
    <>
      <div style={{ color: 'var(--pp-gray-500)' }}>블록 종류: {b.type}</div>
      <Group title="블록">
        <ArrayOps path={path} noun="블록" />
      </Group>
    </>
  );
}
