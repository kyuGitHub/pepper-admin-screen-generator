import type { CSSProperties } from 'react';
import { AppHeader, Button, InputGroup, Lnb, Modal, Panel, Select, Tabs } from '../design-system';
import type { ActionSchema, ColumnItemSchema, ScreenSchema, TabLayoutSchema } from '../schema/types';
import { isEditablePanel, sectionOf } from './compile';
import { ActionButton, Blocks, CollapsibleHeader, PanelView } from './PanelView';
import { ScreenRuntimeProvider, useScreen } from './runtime';
import { Selectable, useEditor } from '../editor/EditorContext';
import type { Path } from '../editor/paths';

export function ScreenRenderer({ schema }: { schema: ScreenSchema }) {
  return (
    <ScreenRuntimeProvider schema={schema}>
      <Screen />
    </ScreenRuntimeProvider>
  );
}

const twoCols: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10 };

function Screen() {
  const { schema, state, actions } = useScreen();
  const editing = !!useEditor();
  const P = (p: Path) => (editing ? p : undefined);
  const { header, lnb } = schema.shell;
  const tab = schema.tabs.find((t) => t.label === state.tab);
  return (
    <div
      data-screen-label={schema.title}
      style={{
        minWidth: 1860,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        fontFamily: 'var(--font-sans)',
        color: '#303030',
      }}
    >
      <AppHeader {...header} lastLogin={header.lastLogin ?? ''} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Lnb tree={lnb.tree} tabs={lnb.tabs} activeId={lnb.activeId} open={state.lnbOpen} onToggleOpen={actions.setLnbOpen} />
        <main style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: state.lnbOpen ? '20px 30px' : '20px 30px 20px 53px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #dee2e6', marginBottom: 20, padding: '0 0 10px 10px' }}>
            {editing ? (
              <Selectable kind="screen" path={[]} inline>
                <h4 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>{schema.title}</h4>
              </Selectable>
            ) : (
              <h4 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>{schema.title}</h4>
            )}
            {schema.favorite !== undefined && (
              <span aria-label="즐겨찾기" style={{ fontSize: 20, lineHeight: 1, color: '#303030', marginLeft: 2 }}>
                {schema.favorite ? '★' : '☆'}
              </span>
            )}
          </div>
          {(schema.toolbar.search || schema.toolbar.actions.length > 0) && <Toolbar />}
          {schema.body && schema.body.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <Blocks blocks={schema.body} gap={10} path={P(['body'])} />
            </div>
          )}
          {schema.summary.length > 0 && (
            <div style={{ ...twoCols, marginBottom: 20 }}>
              {schema.summary.map((p, i) => (
                <PanelView key={p.id} panel={p} path={P(['summary', i])} />
              ))}
            </div>
          )}
          {schema.tabs.length > 0 && (
            <Tabs
              items={schema.tabs.map((t, i) => ({
                value: t.label,
                label: editing ? (
                  <Selectable kind="tab" path={['tabs', i]} inline>
                    {t.label}
                  </Selectable>
                ) : (
                  t.label
                ),
              }))}
              value={state.tab}
              onChange={actions.setTab}
            />
          )}
          {schema.tabs.length > 0 &&
            (tab?.layout ? (
              <TabLayout layout={tab.layout} path={P(['tabs', schema.tabs.indexOf(tab), 'layout'])} />
            ) : (
              <div style={{ paddingTop: 20 }}>
                <Panel title={state.tab}>
                  <Blocks blocks={[{ type: 'empty', text: '조회된 데이터가 없습니다.' }]} />
                </Panel>
              </div>
            ))}
        </main>
      </div>
      <HistoryModal />
      <ScreenModals />
    </div>
  );
}

function Toolbar() {
  const { schema, state, actions } = useScreen();
  const editing = !!useEditor();
  const { search, actions: items } = schema.toolbar;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 15 }}>
      {search && (
        <>
          <InputGroup
            icon="search"
            width={search.width ?? 'auto'}
            inputProps={{ placeholder: search.placeholder, value: state.query, onChange: (e) => actions.setQuery(e.target.value) }}
          />
          <Button variant="primary">{search.submitLabel}</Button>
        </>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
        {items.map((a, i) => (
          <ActionButton key={i} action={a} path={editing ? ['toolbar', 'actions', i] : undefined} />
        ))}
      </div>
    </div>
  );
}

function TabLayout({ layout, path }: { layout: TabLayoutSchema; path?: Path }) {
  return (
    <div style={{ ...twoCols, gridTemplateColumns: layout.columns.map(() => 'minmax(0,1fr)').join(' '), alignItems: layout.align, paddingTop: 20 }}>
      {layout.columns.map((col, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            ...(layout.heightMode === 'max' ? { maxHeight: layout.height } : { height: layout.height }),
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            paddingLeft: col.paddingLeft,
            paddingRight: 6,
          }}
        >
          {col.items.map((item, k) => (
            <ColumnItem key={item.id} item={item} path={path && [...path, 'columns', i, 'items', k]} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ColumnItem({ item, path }: { item: ColumnItemSchema; path?: Path }) {
  const { compiled, state, actions } = useScreen();
  if (item.kind === 'panel') return <PanelView panel={item} path={path} />;

  const instances = compiled.repeats[item.id];
  const keys = instances.map((x) => x.key);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#303030' }}>{item.title}</span>
        <span style={{ fontSize: 12, color: '#707070' }}>{item.countText.replaceAll('{n}', String(instances.length))}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <Button variant="outline" size="sm" onClick={() => actions.setCollapsed(keys, false)}>
            전체열기
          </Button>
          <Button variant="outline" size="sm" onClick={() => actions.setCollapsed(keys, true)}>
            전체닫기
          </Button>
        </div>
      </div>
      {instances.map((inst) => {
        const open = !state.collapsed[inst.key];
        const summary = item.summaryKeys.map((k) => state.values[k + inst.keySuffix] ?? '').join(' · ');
        return (
          <div key={inst.key} style={{ border: '1px solid #dee2e6', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
            <CollapsibleHeader
              no={inst.no}
              title={item.itemTitle.replaceAll('{no}', String(inst.no))}
              summary={summary}
              open={open}
              onToggle={() => actions.setCollapsed([inst.key], open)}
            />
            {open && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 10 }}>
                {inst.panels.map((p, pi) => (
                  <PanelView key={p.id} panel={p} path={path && [...path, 'panels', pi]} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

const th = (width?: number): CSSProperties => ({ textAlign: 'left', padding: '7px 10px', fontWeight: 700, width });

function HistoryModal() {
  const { compiled, state, actions } = useScreen();
  const { open, filter } = state.historyModal;
  if (!open) return null;
  const recorded = new Set(state.history.map((h) => h.section));
  const sections = [...new Set(compiled.panels.filter((p) => isEditablePanel(p) || recorded.has(sectionOf(p))).map(sectionOf))];
  const rows = state.history.filter((x) => filter === '전체' || x.section === filter);
  return (
    <Modal
      open
      title="정보변경이력"
      width={1000}
      onClose={actions.closeHistory}
      footer={
        <Button variant="primary" onClick={actions.closeHistory}>
          닫기
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-sans)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Select options={['전체', ...sections]} value={filter} onChange={(e) => actions.setHistoryFilter(e.target.value)} width={180} />
          <span style={{ fontSize: 12, color: '#707070', marginLeft: 'auto' }}>총 {rows.length}건</span>
        </div>
        <div style={{ maxHeight: 420, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, color: '#303030' }}>
            <thead>
              <tr style={{ background: '#f6f6f6', borderTop: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6' }}>
                <th style={{ ...th(150), textAlign: 'center' }}>변경일시</th>
                <th style={th(130)}>구분</th>
                <th style={th(120)}>항목</th>
                <th style={th()}>변경전</th>
                <th style={th()}>변경후</th>
                <th style={{ ...th(120), textAlign: 'center' }}>변경자</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '7px 10px', textAlign: 'center' }}>{x.at}</td>
                  <td style={{ padding: '7px 10px', fontWeight: 700, color: '#505050' }}>{x.section}</td>
                  <td style={{ padding: '7px 10px' }}>{x.item}</td>
                  <td style={{ padding: '7px 10px', color: '#707070' }}>{x.before}</td>
                  <td style={{ padding: '7px 10px', fontWeight: 700 }}>{x.after}</td>
                  <td style={{ padding: '7px 10px', textAlign: 'center' }}>{x.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div style={{ padding: 30, textAlign: 'center', fontSize: 12, color: '#707070' }}>변경이력이 없습니다.</div>}
        </div>
      </div>
    </Modal>
  );
}

function ScreenModals() {
  const { schema, state, actions } = useScreen();
  const editing = !!useEditor();
  const mi = schema.modals?.findIndex((x) => x.id === state.modal) ?? -1;
  const m = mi >= 0 ? schema.modals![mi] : undefined;
  if (!m) return null;
  const mp: Path | undefined = editing ? ['modals', mi] : undefined;
  return (
    <Modal
      open
      title={
        mp ? (
          <Selectable kind="modal" path={mp} inline>
            {m.title}
          </Selectable>
        ) : (
          m.title
        )
      }
      width={m.width}
      onClose={actions.closeModal}
      footer={
        m.footer ? (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 6 }}>
            {(m.footer.left ?? []).map((a, i) => (
              <ModalAction key={`l${i}`} action={a} path={mp && [...mp, 'footer', 'left', i]} />
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {(m.footer.right ?? []).map((a, i) => (
                <ModalAction key={`r${i}`} action={a} path={mp && [...mp, 'footer', 'right', i]} />
              ))}
            </div>
          </div>
        ) : (
          <Button variant="primary" onClick={actions.closeModal}>
            {m.closeLabel ?? '닫기'}
          </Button>
        )
      }
    >
      <Blocks blocks={m.blocks} gap={m.blockGap ?? 0} path={mp && [...mp, 'blocks']} />
    </Modal>
  );
}

const CLOSE_LABELS = new Set(['닫기', '취소']);

/** Footer button of a declared modal: 닫기/취소 close it, everything else is the usual action. */
function ModalAction({ action, path }: { action: ActionSchema; path?: Path }) {
  const { actions } = useScreen();
  if (action.type === 'button' && CLOSE_LABELS.has(action.label)) {
    const btn = (
      <Button variant={action.variant ?? 'outline'} onClick={actions.closeModal}>
        {action.label}
      </Button>
    );
    return path ? (
      <Selectable kind="action" path={path} inline>
        {btn}
      </Selectable>
    ) : (
      btn
    );
  }
  return <ActionButton action={action} path={path} />;
}
