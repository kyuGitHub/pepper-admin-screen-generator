import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { InputGroup } from './forms';
import { Separator } from './Separator';

// Ports of components/forms/{Datepicker,DateInput,DateRange}.jsx.

const pad = (n: number) => String(n).padStart(2, '0');
export const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseDate = (s?: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};
const same = (a: Date | null | undefined, b: Date | null | undefined) => !!a && !!b && a.toDateString() === b.toDateString();
const DOW = ['일', '월', '화', '수', '목', '금', '토'];

export interface DatepickerProps {
  value?: string;
  rangeStart?: string;
  rangeEnd?: string;
  today?: Date;
  onSelect?: (iso: string) => void;
  style?: CSSProperties;
}

export function Datepicker({ value, rangeStart, rangeEnd, today = new Date(), onSelect, style }: DatepickerProps) {
  const sel = parseDate(value);
  const rs = parseDate(rangeStart);
  const re = parseDate(rangeEnd);
  const init = sel || rs || today;
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth(), 1));
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const weeks = Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const x = new Date(start);
      x.setDate(start.getDate() + w * 7 + d);
      return x;
    }),
  );
  const move = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));
  const navBtn: CSSProperties = {
    width: 30,
    height: 30,
    border: 0,
    background: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: 'var(--pp-gray-900)',
    borderRadius: 4,
  };
  return (
    <div
      style={{
        width: 270,
        padding: 15,
        background: '#fff',
        border: '1px solid rgba(0,0,0,.15)',
        borderRadius: 4,
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>
              <button type="button" style={navBtn} onClick={() => move(-1)}>
                «
              </button>
            </th>
            <th colSpan={5} style={{ fontSize: 16, fontWeight: 400, color: 'var(--pp-gray-900)', height: 30 }}>
              {view.getFullYear()}년 {view.getMonth() + 1}월
            </th>
            <th>
              <button type="button" style={navBtn} onClick={() => move(1)}>
                »
              </button>
            </th>
          </tr>
          <tr>
            {DOW.map((d, i) => (
              <th
                key={d}
                style={{ fontSize: 12, height: 30, paddingBottom: 10, fontWeight: 700, color: i === 0 ? 'var(--calendar-sunday)' : 'var(--pp-gray-900)' }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((d, di) => {
                const other = d.getMonth() !== view.getMonth();
                const active = same(d, sel) || same(d, rs) || same(d, re);
                const inRange = !!rs && !!re && d > rs && d < re;
                const isToday = same(d, today);
                let color = other ? '#999' : di === 0 ? 'var(--calendar-sunday)' : 'var(--pp-gray-900)';
                if (active) color = '#fff';
                return (
                  <td
                    key={di}
                    onClick={() => onSelect?.(fmtDate(d))}
                    style={{ position: 'relative', width: '14.2%', height: 30, fontSize: 14, color, cursor: 'pointer', zIndex: 1 }}
                  >
                    {inRange && (
                      <span
                        style={{
                          position: 'absolute',
                          zIndex: -1,
                          top: 0,
                          left: di === 0 ? '20%' : '-5%',
                          right: di === 6 ? '20%' : '-5%',
                          height: 30,
                          background: 'var(--calendar-range)',
                          borderRadius: di === 0 ? '15px 0 0 15px' : di === 6 ? '0 15px 15px 0' : 0,
                        }}
                      />
                    )}
                    {(active || isToday) && (
                      <span
                        style={{
                          position: 'absolute',
                          zIndex: -1,
                          top: '50%',
                          left: '50%',
                          width: 30,
                          height: 30,
                          transform: 'translate(-50%,-50%)',
                          borderRadius: '50%',
                          boxSizing: 'border-box',
                          background: active ? 'var(--calendar-active)' : 'none',
                          border: active ? '2px solid var(--calendar-active)' : '1px solid var(--calendar-sunday)',
                        }}
                      />
                    )}
                    {d.getDate()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function useOutside(ref: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export interface DateInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (iso: string) => void;
  width?: number | string;
  rangeStart?: string;
  rangeEnd?: string;
}

export function DateInput({ value, defaultValue = '', placeholder = 'YYYY-MM-DD', onChange, width = 90, rangeStart, rangeEnd }: DateInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useOutside(ref, () => setOpen(false));
  const v = value !== undefined ? value : inner;
  const set = (s: string) => {
    setInner(s);
    onChange?.(s);
  };
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}>
      <InputGroup
        width={width}
        onAddonClick={() => setOpen(!open)}
        inputProps={{ value: v, placeholder, onChange: (e) => set(e.target.value), onFocus: () => setOpen(true) }}
      />
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, zIndex: 1000 }}>
          <Datepicker
            value={rangeStart || rangeEnd ? undefined : v}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onSelect={(s) => {
              set(s);
              setOpen(false);
            }}
          />
        </div>
      )}
    </span>
  );
}

export interface DateRangeProps {
  start?: string;
  end?: string;
  defaultStart?: string;
  defaultEnd?: string;
  onChange?: (start: string, end: string) => void;
  width?: number | string;
}

export function DateRange({ start, end, defaultStart = '', defaultEnd = '', onChange, width = 90 }: DateRangeProps) {
  const [s, setS] = useState(defaultStart);
  const [e, setE] = useState(defaultEnd);
  const vs = start !== undefined ? start : s;
  const ve = end !== undefined ? end : e;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <DateInput
        width={width}
        value={vs}
        rangeStart={vs}
        rangeEnd={ve}
        onChange={(x) => {
          setS(x);
          onChange?.(x, ve);
        }}
      />
      <Separator type="hyphen" />
      <DateInput
        width={width}
        value={ve}
        rangeStart={vs}
        rangeEnd={ve}
        onChange={(x) => {
          setE(x);
          onChange?.(vs, x);
        }}
      />
    </span>
  );
}
