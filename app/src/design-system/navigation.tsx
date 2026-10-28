import { useState, type CSSProperties, type ReactNode } from 'react';

// Ports of components/navigation/{AppHeader,Tabs,Lnb}.jsx.

function HeaderSelect({ options, lg }: { options: string[]; lg?: boolean }) {
  return (
    <select
      className="pp-img-select-arrow"
      style={{
        WebkitAppearance: 'none',
        appearance: 'none',
        display: 'inline-block',
        minWidth: lg ? 180 : 140,
        height: 28,
        padding: '0 30px 0 15px',
        border: 'none',
        outline: 'none',
        borderRadius: 5,
        backgroundColor: 'var(--pp-navy-700)',
        fontSize: 12,
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        verticalAlign: 'middle',
      }}
    >
      {options.map((o, i) => (
        <option key={i} style={{ background: 'var(--pp-navy-700)', color: '#fff', fontSize: 13 }}>
          {o}
        </option>
      ))}
    </select>
  );
}

export interface AppHeaderProps {
  menu?: string[];
  active?: string;
  onNavigate?: (menu: string) => void;
  userName?: string;
  userPosition?: string;
  lastLogin?: string;
  shortcuts?: string[];
  history?: string[];
  onLogout?: () => void;
  fixed?: boolean;
  /** Red environment tag before the shortcuts, e.g. "테스트(Staging)". */
  envLabel?: string;
  style?: CSSProperties;
}

export function AppHeader({
  menu = ['회원', '여신', '수신', '고객지원', '마케팅', '설정', '보고서', '시스템'],
  active,
  onNavigate,
  userName = '홍길동',
  userPosition = '계장',
  lastLogin = '',
  shortcuts = ['바로가기'],
  history = ['메뉴이력'],
  onLogout,
  fixed = false,
  envLabel,
  style,
}: AppHeaderProps) {
  const [hover, setHover] = useState<string | null>(null);
  const cur = active ?? menu[0];
  return (
    <header
      style={{
        position: fixed ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        zIndex: 600,
        width: '100%',
        minWidth: fixed ? 1860 : 0,
        height: 50,
        background: 'var(--pp-navy-800)',
        fontFamily: 'var(--font-sans)',
        flexShrink: 0,
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 30, height: '100%', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, lineHeight: 0 }}>
            <a href="#" aria-label="페퍼저축은행 관리자" className="pp-img-header-logo" />
          </h1>
          <div style={{ position: 'relative', marginLeft: 11, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>
            Admin
            <span style={{ position: 'absolute', bottom: 0, left: -1, width: 'calc(100% + 2px)', height: 2, background: 'var(--pp-navy-50)' }} />
          </div>
        </div>
        <ul style={{ display: 'flex', height: 50, margin: 0, padding: '0 0 0 282px', listStyle: 'none' }}>
          {menu.map((m) => {
            const on = m === cur || hover === m;
            return (
              <li key={m} style={{ height: '100%' }}>
                <a
                  href="#"
                  onMouseEnter={() => setHover(m)}
                  onMouseLeave={() => setHover(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.(m);
                  }}
                  style={{
                    position: 'relative',
                    display: 'block',
                    padding: 15,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.5,
                    textDecoration: 'none',
                  }}
                >
                  {m}
                  {on && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'calc(100% - 30px)',
                        height: 2,
                        background: '#fff',
                      }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
        <div style={{ position: 'absolute', top: 0, right: 30, height: '100%', display: 'flex', alignItems: 'center' }}>
          {envLabel && <span style={{ marginRight: 24, fontSize: 13, fontWeight: 700, color: 'var(--pp-red-400)' }}>{envLabel}</span>}
          <div style={{ display: 'flex', gap: 5 }}>
            <HeaderSelect options={shortcuts} />
            <HeaderSelect options={history} lg />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
            <span className="pp-img-profile" style={{ display: 'inline-block', width: 28, height: 28 }} />
            <span style={{ marginLeft: 3, fontSize: 14, fontWeight: 700, color: '#fff' }}>
              {userName}
              <span style={{ paddingLeft: 5 }}>{userPosition}</span>
            </span>
            <span style={{ marginLeft: 16, fontSize: 12, color: 'var(--pp-gray-450)' }}>{lastLogin}</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            style={{
              height: 28,
              lineHeight: '26px',
              marginLeft: 14,
              padding: '0 16px',
              border: 0,
              borderRadius: 25,
              background: 'var(--pp-navy-700)',
              fontSize: 13,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export type TabItem = string | { value: string; label: ReactNode };

export interface TabsProps {
  items?: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'md' | 'lg';
  fill?: boolean;
  style?: CSSProperties;
}

export function Tabs({ items = [], value, defaultValue, onChange, size = 'md', fill = false, style }: TabsProps) {
  const list = items.map((it) => (typeof it === 'string' ? { value: it, label: it } : it));
  const [inner, setInner] = useState(defaultValue ?? list[0]?.value);
  const cur = value !== undefined ? value : inner;
  const lg = size === 'lg';
  return (
    <ul role="tablist" style={{ display: 'flex', margin: 0, padding: 0, listStyle: 'none', borderBottom: '1px solid var(--pp-navy-800)', ...style }}>
      {list.map((it) => {
        const on = it.value === cur;
        return (
          <li key={it.value} style={{ marginBottom: -1, flex: fill ? 1 : 'none' }}>
            <a
              role="tab"
              aria-selected={on}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setInner(it.value);
                onChange?.(it.value);
              }}
              style={{
                display: 'block',
                boxSizing: 'border-box',
                minWidth: lg ? 0 : 110,
                height: lg ? 40 : 'auto',
                lineHeight: lg ? '38px' : 1.5,
                padding: lg ? 0 : '4px 15px',
                fontSize: lg ? 15 : 13,
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                border: '1px solid transparent',
                borderColor: on ? 'var(--pp-navy-800) var(--pp-navy-800) #fff' : 'transparent',
                background: on ? '#fff' : 'var(--pp-gray-60)',
                color: on ? 'var(--pp-gray-900)' : 'var(--pp-gray-700)',
                fontWeight: on ? 700 : 400,
              }}
            >
              {it.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export interface LnbNode {
  label: string;
  id?: string;
  open?: boolean;
  children?: LnbNode[];
}

function smallBtn(extra?: CSSProperties): CSSProperties {
  return {
    height: 34,
    lineHeight: '32px',
    padding: '0 20px',
    border: '1px solid var(--pp-gray-350)',
    borderRadius: 5,
    background: '#fff',
    fontSize: 14,
    color: 'var(--pp-gray-700)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    boxSizing: 'border-box',
    ...extra,
  };
}

interface NodeProps {
  node: LnbNode;
  depth: number;
  isLast: boolean;
  path: string;
  openMap: Record<string, boolean>;
  toggle: (id: string, v: boolean) => void;
  activeId?: string;
  onSelect?: (id: string, node: LnbNode) => void;
}

function Node({ node, depth, isLast, path, openMap, toggle, activeId, onSelect }: NodeProps) {
  const id = path;
  const hasKids = !!node.children && node.children.length > 0;
  const open = openMap[id] ?? !!node.open;
  const on = activeId === (node.id ?? id);
  const pb = depth === 1 ? (isLast ? 0 : 20) : isLast && depth > 2 ? 0 : 10;
  return (
    <li style={{ position: 'relative', listStyle: 'none', paddingBottom: pb }}>
      {!isLast && <span className="pp-img-lnb-vdot" style={{ position: 'absolute', zIndex: 1, top: 10, left: 0, width: 16, height: '100%' }} />}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {hasKids && (
          <button
            type="button"
            aria-label={open ? '닫기' : '열기'}
            className={open ? 'pp-img-lnb-minus' : 'pp-img-lnb-plus'}
            onClick={() => toggle(id, !open)}
            style={{ position: 'relative', zIndex: 10, width: 16, height: 16, border: 0, padding: 0, marginTop: 2, cursor: 'pointer', flexShrink: 0 }}
          />
        )}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelect?.(node.id ?? id, node);
            if (hasKids) toggle(id, !open);
          }}
          style={{
            position: 'relative',
            display: 'inline-block',
            top: 1,
            marginLeft: hasKids ? 0 : 9.5,
            paddingLeft: 10,
            fontSize: 14,
            lineHeight: 1.5,
            color: 'var(--pp-gray-900)',
            textDecoration: on ? 'underline' : 'none',
            fontWeight: on ? 700 : 400,
          }}
        >
          <span className="pp-img-lnb-hdot" style={{ position: 'absolute', top: 0, left: -1.5, width: 10, height: '100%' }} />
          {node.label}
        </a>
      </div>
      {hasKids && open && (
        <ul style={{ margin: 0, padding: depth === 1 ? '15px 0 4px 26px' : '15px 0 0 26px', position: 'relative' }}>
          <span className="pp-img-lnb-vdot" style={{ position: 'absolute', zIndex: 1, top: -2, left: 26, width: 16, height: 17 }} />
          {node.children!.map((c, i) => (
            <Node
              key={i}
              node={c}
              depth={depth + 1}
              isLast={i === node.children!.length - 1}
              path={`${path}.${i}`}
              openMap={openMap}
              toggle={toggle}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export interface LnbProps {
  tree?: LnbNode[];
  tabs?: string[];
  activeId?: string;
  onSelect?: (id: string, node: LnbNode) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
  height?: number | string;
  style?: CSSProperties;
}

export function Lnb({
  tree = [],
  tabs = ['입력결과', '즐겨찾기'],
  activeId,
  onSelect,
  open: openProp,
  defaultOpen = true,
  onToggleOpen,
  height = '100%',
  style,
}: LnbProps) {
  const [openInner, setOpenInner] = useState(defaultOpen);
  const isOpen = openProp !== undefined ? openProp : openInner;
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState('');
  const toggle = (id: string, v: boolean) => setOpenMap((m) => ({ ...m, [id]: v }));
  const setAll = (v: boolean) => {
    const m: Record<string, boolean> = {};
    const walk = (ns: LnbNode[], p: string) =>
      ns.forEach((n, i) => {
        const id = p ? `${p}.${i}` : String(i);
        if (n.children) {
          m[id] = v;
          walk(n.children, id);
        }
      });
    walk(tree, '');
    setOpenMap(m);
  };
  const flip = () => {
    setOpenInner(!isOpen);
    onToggleOpen?.(!isOpen);
  };
  return (
    <aside style={{ position: 'relative', height, background: '#fff', fontFamily: 'var(--font-sans)', zIndex: 500, flexShrink: 0, ...style }}>
      {isOpen && (
        <div style={{ overflowY: 'auto', width: 282, height: '100%', padding: '0 30px', boxSizing: 'border-box', borderRight: '1px solid var(--pp-navy-300)' }}>
          <Tabs items={tabs} size="lg" fill style={{ paddingTop: 20 }} />
          <div style={{ padding: '10px 0 20px' }}>
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{
                  width: 'calc(100% - 75px)',
                  height: 34,
                  padding: '0 10px',
                  border: '1px solid var(--pp-gray-350)',
                  borderRadius: 5,
                  fontSize: 14,
                  color: 'var(--pp-gray-900)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <button type="button" style={smallBtn({ width: 65, marginLeft: 10, padding: '0 10px' })}>
                검색
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" style={smallBtn()} onClick={() => setAll(false)}>
                전체닫기
              </button>
              <button type="button" style={smallBtn()} onClick={() => setAll(true)}>
                전체열기
              </button>
            </div>
            <ul style={{ margin: 0, padding: '20px 0 0' }}>
              {tree.map((n, i) => (
                <Node
                  key={i}
                  node={n}
                  depth={1}
                  isLast={i === tree.length - 1}
                  path={String(i)}
                  openMap={openMap}
                  toggle={toggle}
                  activeId={activeId}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          right: -23,
          top: '50%',
          width: 24,
          height: 54,
          marginTop: -27,
          border: '1px solid var(--pp-navy-300)',
          borderLeft: 'none',
          borderRadius: '0 2px 2px 0',
          background: '#fff',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          aria-label="메뉴 열기/닫기"
          className="pp-img-lnb-arrow"
          onClick={flip}
          style={{ width: 23, height: 52, border: 0, padding: 0, cursor: 'pointer', transform: isOpen ? 'rotate(180deg)' : 'none' }}
        />
      </div>
    </aside>
  );
}
