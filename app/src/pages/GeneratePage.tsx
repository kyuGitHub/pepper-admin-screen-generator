import { useEffect, useMemo, useRef, useState, type ClipboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenButton, GenCodeArea, GenField, GenPage, GenSection, GenSelect, GenTextarea, GenToolbar, GenToolbarHeading } from '../generator/ui';
import { formatUsage, runAi, toAiImage } from '../lib/ai';
import { fillSampleData } from '../lib/sampleData';
import { AREAS, PATTERNS, createScreen, getScreen, listScreens, updateScreen, uploadThumbnail, type ScreenSummary } from '../lib/screens';
import { captureThumbnail } from '../lib/thumbnail';
import type { AiEvent, AiImage } from '../server/ai';
import type { ScreenSchema } from '../schema/types';
import { SAMPLE_SCREENS } from '../screens';

/* AI로 화면 만들기: requirements (+ screenshots) → Claude → validated schema → saved screen → editor. */

const REQUEST_KEY = 'ai-request';

const HINT = `예:
대출신청 서류접수 목록 화면. 심사역이 접수된 서류를 확인하고 보완 요청을 보낸다.
검색: 접수일자(기간), 접수채널(토스/카카오/자사앱), 상태(전체/접수/보완요청/완료), 고객명·접수번호(텍스트, 상세검색)
목록 열: No, 접수번호(링크→접수 상세 팝업), 고객명, 접수채널, 신청금액, 상태, 접수일시, 처리자, [상세] 버튼
팝업 "접수 상세": 접수정보 패널(접수번호, 접수일시, 채널, 신청금액), 서류 표(서류종류, 제출여부, 보완요청사유), 하단 [보완요청][닫기]
버튼: 조회, 초기화, 엑셀, 보완요청(팝업), 정보변경이력`;

export function GeneratePage() {
  const navigate = useNavigate();
  const [request, setRequest] = useState(() => sessionStorage.getItem(REQUEST_KEY) ?? '');
  const [area, setArea] = useState<string>(AREAS[0]);
  const [pattern, setPattern] = useState<string>('목록');
  const [model, setModel] = useState<'sonnet' | 'opus'>('sonnet');
  const [saved, setSaved] = useState<ScreenSummary[]>([]);
  const [refKey, setRefKey] = useState('sample:channelList');
  const [images, setImages] = useState<{ img: AiImage; name: string }[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [chars, setChars] = useState(0);
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    listScreens()
      .then(setSaved)
      .catch(() => setSaved([]));
  }, []);
  useEffect(() => {
    sessionStorage.setItem(REQUEST_KEY, request);
  }, [request]);
  useEffect(() => {
    if (!busy) return;
    const t0 = Date.now();
    const id = setInterval(() => setElapsed(Math.round((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, [busy]);

  const refOptions = useMemo(
    () => [
      ...Object.entries(SAMPLE_SCREENS).map(([k, s]) => ({ value: `sample:${k}`, label: `샘플 · ${s.label}` })),
      ...saved.map((r) => ({ value: `saved:${r.id}`, label: `저장됨 · ${r.title}` })),
      { value: 'none', label: '참고 화면 없음 (규칙만으로 생성)' },
    ],
    [saved],
  );
  const pickPattern = (p: string) => {
    setPattern(p);
    if (refKey.startsWith('sample:')) setRefKey(p === '목록' ? 'sample:channelList' : 'sample:loanApplicationDetail');
  };

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const next = await Promise.all(list.slice(0, 4 - images.length).map(async (f) => ({ img: await toAiImage(f), name: f.name || '붙여넣은 이미지' })));
    setImages((cur) => [...cur, ...next].slice(0, 4));
  };
  const onPaste = (e: ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files ?? []);
    if (files.length) {
      e.preventDefault();
      addFiles(files);
    }
  };

  const resolveReference = async (): Promise<{ title: string; schema: ScreenSchema } | undefined> => {
    const [kind, id] = refKey.split(':');
    if (kind === 'sample') {
      const s = SAMPLE_SCREENS[id];
      return s && { title: s.label, schema: s.schema };
    }
    if (kind === 'saved') {
      const r = await getScreen(id);
      return { title: r.title, schema: r.schema };
    }
    return undefined;
  };

  const generate = async () => {
    setBusy(true);
    setError('');
    setLog([]);
    setChars(0);
    setElapsed(0);
    abort.current = new AbortController();
    const push = (s: string) => setLog((l) => [...l, s]);
    try {
      const reference = await resolveReference();
      push(reference ? `참고 화면: ${reference.title}` : '참고 화면 없음');
      const onEvent = (e: AiEvent) => {
        if (e.type === 'status') push(e.text);
        if (e.type === 'delta') setChars(e.chars);
      };
      const done = await runAi({ mode: 'generate', request, pattern, area, reference, images: images.map((i) => i.img), model }, onEvent, abort.current.signal);
      push(`생성 완료 · ${formatUsage(done.usage)}`);
      for (const a of done.assumptions) push(`가정: ${a}`);
      push('빈 값을 샘플 데이터로 채우고 저장하는 중…');
      const schema = fillSampleData(done.schema);
      const row = await createScreen({ title: schema.title, area, pattern, schema });
      const blob = await captureThumbnail(schema);
      if (blob) await updateScreen(row.id, { thumbnail_path: await uploadThumbnail(row.id, blob) });
      sessionStorage.removeItem(REQUEST_KEY);
      navigate(`/screens/${row.id}?edit=1`);
    } catch (e) {
      setError((e as Error).name === 'AbortError' ? '중단했습니다.' : ((e as Error).message ?? String(e)));
    } finally {
      setBusy(false);
      abort.current = null;
    }
  };

  const modelOptions = [
    { value: 'sonnet', label: 'Sonnet 5.5 · 기본 (화면당 약 350~650원)' },
    { value: 'opus', label: 'Opus 5.5 · 고품질 (약 2배 비용)' },
  ];
  const logText = [...log, ...(busy && chars > 0 ? [`받은 출력 ${chars.toLocaleString()}자…`] : []), ...(error ? [`오류: ${error}`] : [])].join('\n');

  return (
    <GenPage>
      <GenToolbar>
        <GenToolbarHeading onBack={() => navigate('/')} title="AI로 화면 만들기" />
        {busy && (
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gen-accent-text)', fontVariantNumeric: 'tabular-nums' }}>생성 중 · {elapsed}s</span>
        )}
      </GenToolbar>

      <main style={{ maxWidth: 1500, margin: '0 auto', padding: '28px 32px', display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 20 }}>
        <GenSection
          n="01"
          title="요구사항"
          lead={
            <>
              화면명, 누가 무엇을 하는지, 패널별 항목, 검색 조건·목록 열, 버튼과 동작, 팝업을 적습니다. 기존 어드민 캡처나 손그림을 붙이면 그 레이아웃을
              따릅니다. 자세한 양식은{' '}
              <a href="/intake" onClick={(e) => (e.preventDefault(), navigate('/intake'))}>
                요청서 만들기
              </a>
              에서 채운 뒤 [AI로 바로 생성]을 눌러도 됩니다.
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.6fr', gap: 12 }}>
            <GenField label="영역">
              <GenSelect value={area} options={[...AREAS]} onChange={(e) => setArea(e.target.value)} disabled={busy} />
            </GenField>
            <GenField label="패턴">
              <GenSelect value={pattern} options={[...PATTERNS]} onChange={(e) => pickPattern(e.target.value)} disabled={busy} />
            </GenField>
            <GenField label="모델">
              <GenSelect value={model} options={modelOptions} onChange={(e) => setModel(e.target.value as 'sonnet' | 'opus')} disabled={busy} />
            </GenField>
          </div>
          <GenField label="요구사항" required>
            <GenTextarea rows={16} value={request} placeholder={HINT} onChange={(e) => setRequest(e.target.value)} onPaste={onPaste} disabled={busy} />
          </GenField>
          <GenField label="참고 화면 (같은 형식·같은 메뉴 구조로 생성)">
            <GenSelect value={refKey} options={refOptions} onChange={(e) => setRefKey(e.target.value)} disabled={busy} />
          </GenField>
          <GenField label="캡처 이미지 (최대 4장, 요구사항 칸에 붙여넣기 가능)">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {images.map((im, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={`data:${im.img.media_type};base64,${im.img.data}`}
                    alt={im.name}
                    title={im.name}
                    style={{ height: 70, border: '1px solid var(--gen-border-control)', borderRadius: 4, display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={() => setImages((cur) => cur.filter((_, j) => j !== i))}
                    disabled={busy}
                    aria-label="이미지 제거"
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      border: 0,
                      background: 'var(--gen-danger)',
                      color: '#fff',
                      fontSize: 11,
                      cursor: 'pointer',
                      lineHeight: '18px',
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label
                  style={{
                    fontSize: 12,
                    padding: '6px 10px',
                    border: '1px dashed var(--gen-border-hover)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: 'var(--gen-text-sub)',
                  }}
                >
                  + 이미지 선택
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                    disabled={busy}
                  />
                </label>
              )}
            </div>
          </GenField>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
            <GenButton variant="primary" size="lg" onClick={generate} disabled={busy || !request.trim()}>
              {busy ? `생성 중… ${elapsed}초` : 'AI로 만들기'}
            </GenButton>
            {busy && (
              <GenButton size="lg" onClick={() => abort.current?.abort()}>
                중단
              </GenButton>
            )}
            <span style={{ fontSize: 11, color: 'var(--gen-text-hint)' }}>보통 1~3분 걸립니다. 완료되면 편집 모드로 바로 열립니다.</span>
          </div>
        </GenSection>

        <GenSection n="02" title="진행 상황" style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>
          <GenCodeArea
            size="sm"
            readOnly
            value={logText}
            placeholder="[AI로 만들기]를 누르면 여기에 진행 상황이 표시됩니다."
            height={320}
            data-testid="ai-log"
          />
          <div style={{ fontSize: 11, color: 'var(--gen-text-hint)', marginTop: 10, lineHeight: 1.6 }}>
            결과는 검증을 거쳐 저장되고 빈 값은 샘플 데이터로 채워집니다. 마음에 안 들면 편집 모드의 [AI 수정]으로 문장으로 고치거나, 요구사항을 보강해 다시
            만드세요. 사용량은 사용자별로 하루 한도 안에서 기록됩니다.
          </div>
        </GenSection>
      </main>
    </GenPage>
  );
}
