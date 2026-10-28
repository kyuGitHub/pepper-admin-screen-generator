import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { ScreenSchema } from '../schema/types';
import { getAt, insertAt, moveAt, removeAt, samePath, setAt, type Path } from './paths';

/* Editor state: a draft of the schema being edited, the selected element's path, and an undo stack.
   The renderer reads this context to make elements selectable; outside the editor it is absent. */

export type SelectionKind = 'screen' | 'panel' | 'field' | 'action' | 'tab' | 'column' | 'filter' | 'modal' | 'block';

export interface Selection {
  kind: SelectionKind;
  path: Path;
  /** For fields: the data key the preview shows (instance key for repeat groups). */
  dataKey?: string;
}

interface EditorState {
  draft: ScreenSchema;
  dirty: boolean;
  selection: Selection | null;
  canUndo: boolean;
  select: (sel: Selection | null) => void;
  /** Replace the whole draft (records undo). */
  commit: (next: ScreenSchema) => void;
  set: (path: Path, value: unknown) => void;
  remove: (path: Path) => void;
  insert: (path: Path, value: unknown) => void;
  move: (path: Path, delta: number) => void;
  undo: () => void;
  reset: () => void;
}

const EditorContext = createContext<EditorState | null>(null);

export function EditorProvider({ schema, children }: { schema: ScreenSchema; children: ReactNode }) {
  const [draft, setDraft] = useState(schema);
  const [history, setHistory] = useState<ScreenSchema[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);

  const commit = useCallback((next: ScreenSchema) => {
    setDraft((cur) => {
      setHistory((h) => [...h.slice(-49), cur]);
      return next;
    });
  }, []);

  const value = useMemo<EditorState>(
    () => ({
      draft,
      dirty: history.length > 0,
      selection,
      canUndo: history.length > 0,
      select: setSelection,
      commit,
      set: (path, v) => commit(setAt(draft, path, v)),
      remove: (path) => {
        commit(removeAt(draft, path));
        setSelection(null);
      },
      insert: (path, v) => commit(insertAt(draft, path, v)),
      move: (path, delta) => {
        const r = moveAt(draft, path, delta);
        if (r.next !== draft) {
          commit(r.next);
          setSelection((s) => (s ? { ...s, path: r.path } : s));
        }
      },
      undo: () => {
        setHistory((h) => {
          if (!h.length) return h;
          setDraft(h[h.length - 1]);
          return h.slice(0, -1);
        });
        setSelection(null);
      },
      reset: () => {
        setDraft(schema);
        setHistory([]);
        setSelection(null);
      },
    }),
    [draft, history.length, selection, commit, schema],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

/** Null outside the editor, so renderer code can stay cheap when not editing. */
export const useEditor = () => useContext(EditorContext);

export function useEditorRequired(): EditorState {
  const e = useContext(EditorContext);
  if (!e) throw new Error('useEditorRequired outside <EditorProvider>');
  return e;
}

const KIND_LABEL: Record<SelectionKind, string> = {
  screen: '화면',
  panel: '패널',
  field: '필드',
  action: '버튼',
  tab: '탭',
  column: '열',
  filter: '조건',
  modal: '팝업',
  block: '블록',
};

/**
 * Wraps a rendered element so it can be clicked in edit mode. Outside the editor it renders children as-is.
 * `inline` keeps the wrapper inline (labels, buttons); block wrappers are used for panels and tables.
 */
export function Selectable({
  kind,
  path,
  dataKey,
  inline = false,
  children,
  style,
}: {
  kind: SelectionKind;
  path: Path;
  dataKey?: string;
  inline?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const editor = useEditor();
  const [hover, setHover] = useState(false);
  if (!editor) return <>{children}</>;
  const on = !!editor.selection && samePath(editor.selection.path, path);
  const outline = on ? '2px solid var(--pp-navy-800)' : hover ? '1px dashed var(--pp-navy-500)' : '1px dashed transparent';
  return (
    <div
      onClick={(e) => {
        // Innermost wrapper wins; the event still bubbles so tabs/buttons in the preview keep working.
        const ev = e.nativeEvent as Event & { ppSelected?: boolean };
        if (ev.ppSelected) return;
        ev.ppSelected = true;
        editor.select({ kind, path, dataKey });
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', display: inline ? 'inline-block' : 'block', outline, outlineOffset: 2, borderRadius: 2, cursor: 'pointer', ...style }}
    >
      {on && (
        <span
          style={{
            position: 'absolute',
            top: -18,
            left: -2,
            padding: '0 6px',
            background: 'var(--pp-navy-800)',
            color: '#fff',
            fontSize: 10,
            lineHeight: '16px',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {KIND_LABEL[kind]}
        </span>
      )}
      {children}
    </div>
  );
}

/** True when a Selectable already handled this click (used by the preview background to skip deselecting). */
export const clickHandled = (e: { nativeEvent: Event }) => !!(e.nativeEvent as Event & { ppSelected?: boolean }).ppSelected;

export { getAt };
