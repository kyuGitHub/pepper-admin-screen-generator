import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenButton, GenCheckbox, GenCodeArea, GenField, GenInput, GenPage, GenSection, GenSelect, GenTextarea, GenToolbar } from '../generator/ui';
import { AppNav } from './AppNav';
import { copyText, downloadText } from '../lib/export';
import { EMPTY_INTAKE, INTAKE_FIELDS, buildPrompt, requestText, type IntakeForm } from '../lib/intake';
import { AREAS, PATTERNS, getScreen, listScreens, type ScreenSummary } from '../lib/screens';
import { isConfigured } from '../lib/supabase';
import type { ScreenSchema } from '../schema/types';
import { SAMPLE_SCREENS } from '../screens';

/* 요청서 만들기: PM fills the intake questionnaire, picks a reference screen, copies the prompt into Claude
   or hands the same text to the in-app generator. */

const DRAFT_KEY = 'intake-draft';

export function IntakePage({ demo = false }: { demo?: boolean }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<IntakeForm>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? { ...EMPTY_INTAKE, ...JSON.parse(raw) } : EMPTY_INTAKE;
    } catch {
      return EMPTY_INTAKE;
    }
  });
  const [saved, setSaved] = useState<ScreenSummary[]>([]);
  const [refKey, setRefKey] = useState('sample:loanApplicationDetail');
  const [savedRef, setSavedRef] = useState<{ title: string; schema: ScreenSchema } | null>(null);
  const [toast, setToast] = useState('');
  const set = <K extends keyof IntakeForm>(k: K, v: IntakeForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* private mode */
    }
  }, [form]);

  useEffect(() => {
    if (!demo && isConfigured)
      listScreens()
        .then(setSaved)
        .catch(() => setSaved([]));
  }, [demo]);

  // Saved screens are fetched when picked; built-in samples resolve synchronously below.
  useEffect(() => {
    const [kind, id] = refKey.split(':');
    if (kind !== 'saved') return;
    let alive = true;
    getScreen(id)
      .then((r) => alive && setSavedRef({ title: r.title, schema: r.schema }))
      .catch(() => alive && setSavedRef(null));
    return () => {
      alive = false;
    };
  }, [refKey]);

  const reference = useMemo(() => {
    const [kind, id] = refKey.split(':');
    if (kind === 'sample') {
      const s = SAMPLE_SCREENS[id];
      return s ? { title: s.label, schema: s.schema } : null;
    }
    return kind === 'saved' ? savedRef : null;
  }, [refKey, savedRef]);

  const pickPattern = (pattern: string) => {
    set('pattern', pattern);
    if (refKey.startsWith('sample:')) setRefKey(pattern === '목록' ? 'sample:channelList' : 'sample:loanApplicationDetail');
  };

  const prompt = useMemo(() => buildPrompt(form, form.includeReference && reference ? reference : undefined), [form, reference]);
  const missing = INTAKE_FIELDS.filter((f) => f.required && !String(form[f.key]).trim()).map((f) => f.label);
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2500);
  };

  const refOptions = [
    ...Object.entries(SAMPLE_SCREENS).map(([k, s]) => ({ value: `sample:${k}`, label: `샘플 · ${s.label}` })),
    ...saved.map((r) => ({ value: `saved:${r.id}`, label: `저장됨 · ${r.title}` })),
    { value: 'none', label: '참고 화면 없음' },
  ];

  return (
    <GenPage>
      <GenToolbar>
        <AppNav />
        {toast && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gen-ok)' }}>✓ {toast}</span>}
      </GenToolbar>

      <main style={{ maxWidth: 1500, margin: '0 auto', padding: '28px 32px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
        <GenSection
          n="01"
          title="요청서 작성"
          lead="현업 요구를 아래 칸에 정리하면 오른쪽에 Claude용 프롬프트가 만들어집니다. [AI로 바로 생성]을 누르면 같은 내용으로 앱 안에서 만들고, 직접 Claude(Max)를 쓰려면 프롬프트를 복사해 붙여넣은 뒤 돌아온 JSON을 [새 화면 올리기]에 넣으세요. 입력 내용은 이 브라우저에 자동 저장됩니다."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <GenField label="영역">
              <GenSelect value={form.area} options={[...AREAS]} onChange={(e) => set('area', e.target.value)} />
            </GenField>
            <GenField label="패턴">
              <GenSelect value={form.pattern} options={[...PATTERNS]} onChange={(e) => pickPattern(e.target.value)} />
            </GenField>
          </div>
          {INTAKE_FIELDS.filter((f) => !f.listOnly || form.pattern === '목록').map((f) => (
            <GenField key={f.key} label={f.label} required={f.required}>
              {f.rows ? (
                <GenTextarea rows={f.rows} value={String(form[f.key])} placeholder={f.hint} onChange={(e) => set(f.key, e.target.value as never)} />
              ) : (
                <GenInput value={String(form[f.key])} placeholder={f.hint} onChange={(e) => set(f.key, e.target.value as never)} />
              )}
            </GenField>
          ))}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <GenField label="참고 화면 (같은 형식으로 작성하도록 JSON을 함께 보냄)">
                <GenSelect value={refKey} options={refOptions} onChange={(e) => setRefKey(e.target.value)} />
              </GenField>
            </div>
            <GenCheckbox label="프롬프트에 포함" checked={form.includeReference} onChange={(v) => set('includeReference', v)} style={{ marginBottom: 20 }} />
          </div>
          <GenButton size="sm" variant="ghost" onClick={() => window.confirm('입력한 내용을 모두 지울까요?') && setForm(EMPTY_INTAKE)}>
            비우기
          </GenButton>
        </GenSection>

        <GenSection n="02" title="Claude에 붙여넣을 프롬프트" style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--gen-text-sub)', lineHeight: 1.7 }}>
            {missing.length ? (
              <span style={{ color: 'var(--gen-warn)' }}>필수 항목이 비어 있습니다: {missing.join(', ')}</span>
            ) : (
              <>프롬프트 약 {Math.round(prompt.length / 1000)}천 자. 복사 → Claude에 붙여넣기 → 돌아온 JSON을 [새 화면 올리기]에.</>
            )}
          </p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {!demo && (
              <GenButton
                variant="primary"
                onClick={() => {
                  sessionStorage.setItem('ai-request', requestText(form));
                  navigate('/generate');
                }}
                disabled={missing.length > 0}
              >
                AI로 바로 생성
              </GenButton>
            )}
            <GenButton onClick={() => copyText(prompt).then(() => flash('프롬프트를 복사했습니다'))}>프롬프트 복사</GenButton>
            <GenButton onClick={() => downloadText(`${form.title.trim() || '화면'} 요청서.md`, prompt, 'text/markdown')}>.md 내려받기</GenButton>
            <GenButton variant="ghost" onClick={() => window.open('https://claude.ai/new', '_blank', 'noreferrer')}>
              Claude 열기 ↗
            </GenButton>
          </div>
          <GenCodeArea size="sm" readOnly value={prompt} height="calc(100vh - 260px)" style={{ minHeight: 400 }} data-testid="intake-prompt" />
        </GenSection>
      </main>
    </GenPage>
  );
}
