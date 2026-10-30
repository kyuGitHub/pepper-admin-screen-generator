import { useState, type ChangeEvent } from 'react';
import { GenButton, GenCheckbox, GenCodeArea, GenDialog, GenErrorText, GenField, GenInput, GenSelect } from '../generator/ui';
import { AREAS, PATTERNS, createScreen, updateScreen, uploadThumbnail } from '../lib/screens';
import { fillSampleData } from '../lib/sampleData';
import { captureThumbnail } from '../lib/thumbnail';
import { validateScreenSchema } from '../lib/validateSchema';
import { SAMPLE_SCREENS } from '../screens';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

/** "새 화면" dialog: paste or pick a schema JSON file, name it, save, capture a thumbnail. */
export function UploadDialog({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [area, setArea] = useState<string>(AREAS[0]);
  const [pattern, setPattern] = useState<string>(PATTERNS[0]);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState<'' | 'saving' | 'thumb'>('');
  const [sample, setSample] = useState(Object.keys(SAMPLE_SCREENS)[0]);
  const [fill, setFill] = useState(true);
  const [fileName, setFileName] = useState('');

  const reset = () => {
    setTitle('');
    setText('');
    setErrors([]);
    setBusy('');
    setFileName('');
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setText(await f.text());
    setFileName(f.name);
    if (!title) setTitle(f.name.replace(/\.json$/i, ''));
    setErrors([]);
  };

  const save = async () => {
    const result = validateScreenSchema(text);
    if (!result.ok || !result.schema) return setErrors(result.errors);
    if (!title.trim()) return setErrors(['화면 이름을 입력하세요.']);
    setErrors([]);
    setBusy('saving');
    try {
      const schema = fill ? fillSampleData(result.schema) : result.schema;
      const row = await createScreen({ title: title.trim(), area, pattern, schema });
      setBusy('thumb');
      const blob = await captureThumbnail(schema);
      if (blob) await updateScreen(row.id, { thumbnail_path: await uploadThumbnail(row.id, blob) });
      reset();
      onCreated(row.id);
    } catch (e) {
      setBusy('');
      setErrors([e instanceof Error ? e.message : String(e)]);
    }
  };

  const close = () => {
    if (busy) return;
    reset();
    onClose();
  };

  return (
    <GenDialog
      open={open}
      title="새 화면 올리기"
      width={760}
      onClose={close}
      footer={
        <>
          <GenButton onClick={close} disabled={!!busy}>
            취소
          </GenButton>
          <GenButton variant="primary" onClick={save} disabled={!!busy || !text.trim()}>
            {busy === 'saving' ? '저장 중…' : busy === 'thumb' ? '썸네일 생성 중…' : '저장'}
          </GenButton>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px', gap: 12 }}>
        <GenField label="화면 이름">
          <GenInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 채널 목록" />
        </GenField>
        <GenField label="영역">
          <GenSelect options={[...AREAS]} value={area} onChange={(e) => setArea(e.target.value)} />
        </GenField>
        <GenField label="패턴">
          <GenSelect options={[...PATTERNS]} value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </GenField>
      </div>
      <GenField label="화면 스키마 JSON (Claude가 만들어 준 내용을 붙여넣거나 파일 선택)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <label>
            <GenButton size="sm" onClick={(e) => (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement | null)?.click()}>
              파일 선택…
            </GenButton>
            <input type="file" accept=".json,application/json" onChange={onFile} style={{ display: 'none' }} />
          </label>
          <span style={{ fontSize: 11, color: 'var(--gen-text-hint)', fontVariantNumeric: 'tabular-nums' }}>{fileName || '.json'}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <GenSelect
              size="sm"
              width={220}
              options={Object.entries(SAMPLE_SCREENS).map(([value, s]) => ({ value, label: s.label }))}
              value={sample}
              onChange={(e) => setSample(e.target.value)}
            />
            <GenButton
              size="sm"
              onClick={() => {
                const s = SAMPLE_SCREENS[sample];
                setText(JSON.stringify(s.schema, null, 2));
                if (!title) setTitle(`${s.label} (샘플)`);
                setArea(s.area);
                setPattern(s.pattern);
                setErrors([]);
              }}
            >
              샘플 불러오기
            </GenButton>
          </div>
        </div>
        <GenCodeArea
          value={text}
          onChange={(v) => {
            setText(v);
            setErrors([]);
          }}
          placeholder='{ "title": "...", "shell": { ... }, "tabs": [ ... ], "data": { ... } }'
        />
      </GenField>
      <GenCheckbox label="빈 값·빈 목록은 샘플 데이터로 채우기 (라벨·키·단위로 추정, 실제 고객 정보 아님)" checked={fill} onChange={setFill} />
      <GenErrorText>{errors.join('\n')}</GenErrorText>
    </GenDialog>
  );
}
