import { useState, type ChangeEvent } from 'react';
import { Button, Input, Modal, Select } from '../design-system';
import { ErrorText, Field, inputInner, inputStyle } from '../generator/chrome';
import { AREAS, PATTERNS, createScreen, updateScreen, uploadThumbnail } from '../lib/screens';
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

  const reset = () => {
    setTitle('');
    setText('');
    setErrors([]);
    setBusy('');
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const content = await f.text();
    setText(content);
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
      const row = await createScreen({ title: title.trim(), area, pattern, schema: result.schema });
      setBusy('thumb');
      const blob = await captureThumbnail(result.schema);
      if (blob) {
        const path = await uploadThumbnail(row.id, blob);
        await updateScreen(row.id, { thumbnail_path: path });
      }
      reset();
      onCreated(row.id);
    } catch (e) {
      setBusy('');
      setErrors([e instanceof Error ? e.message : String(e)]);
    }
  };

  return (
    <Modal
      open={open}
      title="새 화면 올리기"
      width={760}
      onClose={() => {
        reset();
        onClose();
      }}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={!!busy}>
            취소
          </Button>
          <Button variant="primary" onClick={save} disabled={!!busy || !text.trim()}>
            {busy === 'saving' ? '저장 중…' : busy === 'thumb' ? '썸네일 생성 중…' : '저장'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px', gap: 12 }}>
        <Field label="화면 이름">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 채널 목록" style={inputStyle} inputStyle={inputInner} />
        </Field>
        <Field label="영역">
          <Select options={[...AREAS]} value={area} onChange={(e) => setArea(e.target.value)} width="100%" style={{ height: 34, fontSize: 13 }} />
        </Field>
        <Field label="패턴">
          <Select options={[...PATTERNS]} value={pattern} onChange={(e) => setPattern(e.target.value)} width="100%" style={{ height: 34, fontSize: 13 }} />
        </Field>
      </div>
      <Field label="화면 스키마 JSON (Claude가 만들어 준 내용을 붙여넣거나 파일 선택)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <input type="file" accept=".json,application/json" onChange={onFile} style={{ fontSize: 12 }} />
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Select
              options={Object.entries(SAMPLE_SCREENS).map(([value, s]) => ({ value, label: s.label }))}
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              width={240}
            />
            <Button
              variant="outline"
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
            </Button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setErrors([]);
          }}
          spellCheck={false}
          placeholder='{ "title": "...", "shell": { ... }, "tabs": [ ... ], "data": { ... } }'
          style={{
            display: 'block',
            width: '100%',
            height: 260,
            padding: 10,
            border: '1px solid var(--pp-gray-200)',
            borderRadius: 4,
            fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
            fontSize: 12,
            lineHeight: 1.5,
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </Field>
      <ErrorText>{errors.join('\n')}</ErrorText>
    </Modal>
  );
}
