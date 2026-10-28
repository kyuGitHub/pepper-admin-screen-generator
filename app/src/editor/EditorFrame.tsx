import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '../design-system';
import { Brand, Toolbar } from '../generator/chrome';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';
import { EditorProvider, clickHandled, useEditorRequired } from './EditorContext';
import { PropertyPanel } from './PropertyPanel';
import { AiModifyBar } from './AiModifyBar';

/* Edit mode of a screen: navy toolbar with 실행취소/취소/저장, live preview on the left, property panel on the right. */

export interface EditorFrameProps {
  schema: ScreenSchema;
  /** Left part of the toolbar (back link, title …). */
  heading?: ReactNode;
  onSave: (schema: ScreenSchema) => Promise<void>;
  onExit: () => void;
  saveLabel?: string;
  /** Shows [AI 수정] (needs the generate API and a login). */
  aiEnabled?: boolean;
}

export function EditorFrame(props: EditorFrameProps) {
  return (
    <EditorProvider schema={props.schema}>
      <Frame {...props} />
    </EditorProvider>
  );
}

const tbBtn = { background: 'transparent', color: '#fff', borderColor: 'var(--pp-navy-300)' } as const;

function Frame({ heading, onSave, onExit, saveLabel = '저장', aiEnabled = false }: EditorFrameProps) {
  const ed = useEditorRequired();
  const [aiOpen, setAiOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Ctrl/Cmd+Z undoes, Esc clears the selection; leaving with unsaved edits asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT');
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !typing) {
        e.preventDefault();
        ed.undo();
      } else if (e.key === 'Escape') ed.select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ed]);

  useEffect(() => {
    if (!ed.dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [ed.dirty]);

  const exit = () => {
    if (ed.dirty && !window.confirm('저장하지 않은 변경이 있습니다. 편집을 끝낼까요?')) return;
    onExit();
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(ed.draft);
    } catch (e) {
      setError((e as Error).message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        {heading ?? <Brand />}
        <span
          style={{
            marginLeft: 10,
            padding: '1px 8px',
            borderRadius: 10,
            background: ed.dirty ? 'var(--bs-warning, #f0ad4e)' : 'var(--pp-navy-500)',
            color: ed.dirty ? 'var(--pp-gray-900)' : '#fff',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {ed.dirty ? '편집 중 · 저장 안 됨' : '편집 모드'}
        </span>
        {error && <span style={{ color: '#ffb3b3', fontSize: 12, marginLeft: 10 }}>저장 실패: {error}</span>}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {aiEnabled && (
            <Button variant="outline" size="sm" onClick={() => setAiOpen((o) => !o)} style={{ ...tbBtn, borderColor: aiOpen ? '#fff' : 'var(--pp-navy-300)' }}>
              AI 수정
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={ed.undo} disabled={!ed.canUndo} style={tbBtn}>
            실행취소
          </Button>
          <Button variant="outline" size="sm" onClick={exit} disabled={saving} style={tbBtn}>
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={save}
            disabled={saving || !ed.dirty}
            style={{ background: '#fff', color: 'var(--pp-navy-800)', borderColor: '#fff' }}
          >
            {saving ? '저장 중…' : saveLabel}
          </Button>
        </div>
      </Toolbar>
      {aiEnabled && aiOpen && <AiModifyBar onClose={() => setAiOpen(false)} />}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }} onClick={(e) => !clickHandled(e) && ed.select(null)}>
          <ScreenRenderer schema={ed.draft} />
        </div>
        <PropertyPanel />
      </div>
    </div>
  );
}
