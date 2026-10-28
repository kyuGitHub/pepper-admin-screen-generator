import { useEffect, useState, type ReactNode } from 'react';
import { GenBrand, GenCanvas, GenModeBadge, GenPage, GenToolbar, GenToolbarButton } from '../generator/ui';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';
import { EditorProvider, clickHandled, useEditorRequired } from './EditorContext';
import { PropertyPanel } from './PropertyPanel';
import { AiModifyBar } from './AiModifyBar';

/* Edit mode of a screen: generator toolbar with 실행취소/취소/저장, the admin screen on the canvas, property panel on the right. */

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
    <GenPage fullHeight>
      <GenToolbar>
        {heading ?? <GenBrand />}
        <GenModeBadge dirty={ed.dirty} />
        {error && <span style={{ color: 'var(--gen-danger)', fontSize: 12, marginLeft: 6 }}>저장 실패: {error}</span>}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {aiEnabled && (
            <GenToolbarButton
              onClick={() => setAiOpen((o) => !o)}
              style={aiOpen ? { borderColor: 'var(--gen-accent)', color: 'var(--gen-accent-text)' } : undefined}
            >
              AI 수정
            </GenToolbarButton>
          )}
          <GenToolbarButton onClick={ed.undo} disabled={!ed.canUndo}>
            실행취소
          </GenToolbarButton>
          <GenToolbarButton onClick={exit} disabled={saving}>
            취소
          </GenToolbarButton>
          <GenToolbarButton tone="primary" onClick={save} disabled={saving || !ed.dirty}>
            {saving ? '저장 중…' : saveLabel}
          </GenToolbarButton>
        </div>
      </GenToolbar>
      {aiEnabled && aiOpen && <AiModifyBar onClose={() => setAiOpen(false)} />}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <GenCanvas label={ed.draft.title} meta="1860 × 1100 · 클릭해서 선택" onBackgroundClick={(e) => !clickHandled(e) && ed.select(null)}>
          <ScreenRenderer schema={ed.draft} />
        </GenCanvas>
        <PropertyPanel />
      </div>
    </GenPage>
  );
}
