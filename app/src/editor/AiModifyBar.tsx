import { useState } from 'react';
import { Button, Textarea } from '../design-system';
import { formatUsage, runAi } from '../lib/ai';
import { useEditorRequired } from './EditorContext';

/* [AI 수정] bar under the editor toolbar: a sentence → change ops → applied to the draft (undoable). */

export function AiModifyBar({ onClose }: { onClose: () => void }) {
  const ed = useEditorRequired();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const run = async () => {
    setBusy(true);
    setError('');
    setStatus('수정 명령을 만드는 중…');
    try {
      const done = await runAi({ mode: 'modify', request: text, schema: ed.draft }, (e) => {
        if (e.type === 'status') setStatus(e.text);
        if (e.type === 'delta') setStatus(`받는 중… ${e.chars.toLocaleString()}자`);
      });
      ed.commit(done.schema);
      ed.select(null);
      setStatus(`${done.summary || '적용했습니다'} · 변경 ${done.ops?.length ?? 0}건 · ${formatUsage(done.usage)}. 마음에 안 들면 [실행취소].`);
      setText('');
    } catch (e) {
      setError((e as Error).message ?? String(e));
      setStatus('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        padding: '8px 16px',
        background: 'var(--pp-gray-80)',
        borderBottom: '1px solid var(--border-default)',
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 700, paddingTop: 6, whiteSpace: 'nowrap' }}>AI 수정</div>
      <Textarea
        rows={2}
        value={text}
        placeholder='예: 신청정보 패널에 "상환방식" 선택 필드를 추가하고, 툴바에 [승인요청] 버튼을 넣어줘. 한도조회이력 탭은 삭제.'
        onChange={(e) => setText(e.target.value)}
        disabled={busy}
        style={{ flex: 1, fontSize: 12 }}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && text.trim() && !busy) run();
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Button variant="primary" size="sm" onClick={run} disabled={busy || !text.trim()}>
          {busy ? '수정 중…' : '적용 (Ctrl+Enter)'}
        </Button>
        <Button variant="outline" size="sm" onClick={onClose} disabled={busy}>
          닫기
        </Button>
      </div>
      <div style={{ flexBasis: '100%', color: error ? 'var(--bs-danger)' : 'var(--pp-gray-700)' }}>{error || status}</div>
    </div>
  );
}
