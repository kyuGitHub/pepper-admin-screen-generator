import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Input, Select, Textarea } from '../design-system';
import { Brand, Toolbar } from '../generator/chrome';
import { copyText, downloadText } from '../lib/export';
import { EMPTY_INTAKE, INTAKE_FIELDS, buildPrompt, type IntakeForm } from '../lib/intake';
import { AREAS, PATTERNS, getScreen, listScreens, type ScreenSummary } from '../lib/screens';
import { isConfigured } from '../lib/supabase';
import type { ScreenSchema } from '../schema/types';
import { SAMPLE_SCREENS } from '../screens';

/* 요청서 만들기: PM fills the intake questionnaire, picks a reference screen, copies the prompt into Claude. */

const DRAFT_KEY = 'intake-draft';

export function IntakePage({ demo = false }: { demo?: boolean }) {
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
    <div style={{ minHeight: '100vh', background: 'var(--pp-gray-80)', fontFamily: 'var(--font-sans)', color: 'var(--pp-gray-900)' }}>
      <Toolbar>
        {!demo && (
          <>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 13 }}>
              ← 목록
            </Link>
            <span style={{ color: 'var(--pp-gray-450)' }}>|</span>
          </>
        )}
        <Brand />
        <span style={{ marginLeft: 12, fontWeight: 700 }}>요청서 만들기</span>
        {toast && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--pp-gray-450)' }}>{toast}</span>}
      </Toolbar>

      <main style={{ maxWidth: 1500, margin: '0 auto', padding: '24px 30px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
        <section>
          <h1 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700 }}>1. 요청서 작성</h1>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--pp-gray-700)', lineHeight: 1.6 }}>
            현업 요구를 아래 칸에 정리하면 오른쪽에 Claude용 프롬프트가 만들어집니다. 복사해 Claude(Max)에 붙여넣고, 돌아온 JSON을 [새 화면 올리기]에 넣으세요.
            입력 내용은 이 브라우저에 자동 저장됩니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <label style={lab}>
              영역
              <Select value={form.area} options={[...AREAS]} onChange={(e) => set('area', e.target.value)} style={{ width: '100%' }} />
            </label>
            <label style={lab}>
              패턴
              <Select value={form.pattern} options={[...PATTERNS]} onChange={(e) => pickPattern(e.target.value)} style={{ width: '100%' }} />
            </label>
          </div>
          {INTAKE_FIELDS.filter((f) => !f.listOnly || form.pattern === '목록').map((f) => (
            <label key={f.key} style={{ ...lab, marginBottom: 12 }}>
              {f.label}
              {f.required && <span style={{ color: 'var(--bs-danger)' }}> *</span>}
              {f.rows ? (
                <Textarea
                  rows={f.rows}
                  value={String(form[f.key])}
                  placeholder={f.hint}
                  onChange={(e) => set(f.key, e.target.value as never)}
                  style={{ width: '100%', boxSizing: 'border-box', fontSize: 12 }}
                />
              ) : (
                <Input
                  value={String(form[f.key])}
                  placeholder={f.hint}
                  onChange={(e) => set(f.key, e.target.value as never)}
                  style={{ width: '100%' }}
                  inputStyle={{ height: 30 }}
                />
              )}
            </label>
          ))}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
            <label style={{ ...lab, flex: 1 }}>
              참고 화면 (같은 형식으로 작성하도록 JSON을 함께 보냄)
              <Select value={refKey} options={refOptions} onChange={(e) => setRefKey(e.target.value)} style={{ width: '100%' }} />
            </label>
            <Checkbox label="프롬프트에 포함" checked={form.includeReference} onChange={(v) => set('includeReference', v)} style={{ marginTop: 16 }} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
            <Button variant="outline" size="sm" onClick={() => window.confirm('입력한 내용을 모두 지울까요?') && setForm(EMPTY_INTAKE)}>
              비우기
            </Button>
          </div>
        </section>

        <section style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700 }}>2. Claude에 붙여넣을 프롬프트</h1>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--pp-gray-700)', lineHeight: 1.6 }}>
            {missing.length ? (
              <span style={{ color: 'var(--bs-danger)' }}>필수 항목이 비어 있습니다: {missing.join(', ')}</span>
            ) : (
              <>프롬프트 {Math.round(prompt.length / 1000)}천 자. 복사 → Claude에 붙여넣기 → 돌아온 JSON을 [새 화면 올리기]에.</>
            )}
          </p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <Button variant="primary" onClick={() => copyText(prompt).then(() => flash('프롬프트를 복사했습니다'))}>
              프롬프트 복사
            </Button>
            <Button variant="outline" onClick={() => downloadText(`${form.title.trim() || '화면'} 요청서.md`, prompt, 'text/markdown')}>
              .md 내려받기
            </Button>
            <a href="https://claude.ai/new" target="_blank" rel="noreferrer" style={{ alignSelf: 'center', fontSize: 12, marginLeft: 6 }}>
              Claude 열기 ↗
            </a>
          </div>
          <textarea
            readOnly
            value={prompt}
            data-testid="intake-prompt"
            style={{
              width: '100%',
              height: 'calc(100vh - 220px)',
              minHeight: 400,
              boxSizing: 'border-box',
              fontFamily: 'ui-monospace, Consolas, monospace',
              fontSize: 11,
              lineHeight: 1.5,
              padding: 10,
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              background: '#fff',
              color: 'var(--pp-gray-800)',
            }}
          />
        </section>
      </main>
    </div>
  );
}

const lab = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--pp-gray-800)' } as const;
