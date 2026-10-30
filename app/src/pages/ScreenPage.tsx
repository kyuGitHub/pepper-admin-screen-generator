import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EditorFrame } from '../editor/EditorFrame';
import { ExportMenu } from '../generator/ExportMenu';
import { GenCanvas, GenPage, GenToolbar, GenToolbarButton, GenToolbarHeading } from '../generator/ui';
import { deleteScreen, duplicateScreen, getScreen, updateScreen, uploadThumbnail, type ScreenRow } from '../lib/screens';
import { authorLabel, formatKst } from '../lib/datetime';
import { captureThumbnail } from '../lib/thumbnail';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';

export function ScreenPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState<ScreenRow | null>(null);
  const [error, setError] = useState('');
  const [params, setParams] = useSearchParams();
  const [editing, setEditingState] = useState(params.get('edit') === '1');
  const setEditing = (on: boolean) => {
    setEditingState(on);
    if (params.has('edit')) setParams({}, { replace: true });
  };

  useEffect(() => {
    getScreen(id)
      .then(setRow)
      .catch((e) => setError(e.message ?? String(e)));
  }, [id]);

  const duplicate = async () => {
    if (!row) return;
    const copy = await duplicateScreen(row);
    const blob = await captureThumbnail(copy.schema);
    if (blob) await updateScreen(copy.id, { thumbnail_path: await uploadThumbnail(copy.id, blob) });
    navigate(`/screens/${copy.id}`);
  };

  const remove = async () => {
    if (!row || !window.confirm(`"${row.title}" 화면을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    await deleteScreen(row.id, row.thumbnail_path);
    navigate('/', { replace: true });
  };

  const [thumbBusy, setThumbBusy] = useState(false);
  const refreshThumbnail = async () => {
    if (!row) return;
    setThumbBusy(true);
    try {
      const blob = await captureThumbnail(row.schema);
      if (!blob) throw new Error('캡처 결과가 비어 있습니다.');
      const thumbnail_path = await uploadThumbnail(row.id, blob);
      await updateScreen(row.id, { thumbnail_path });
      setRow({ ...row, thumbnail_path, updated_at: new Date().toISOString() });
      window.alert('썸네일을 다시 만들었습니다. 목록에서 확인하세요.');
    } catch (e) {
      window.alert(`썸네일 생성 실패: ${(e as Error).message ?? e}`);
    } finally {
      setThumbBusy(false);
    }
  };

  const save = async (schema: ScreenSchema) => {
    if (!row) return;
    await updateScreen(row.id, { schema, title: schema.title });
    let thumbnail_path = row.thumbnail_path;
    const blob = await captureThumbnail(schema);
    if (blob) {
      thumbnail_path = await uploadThumbnail(row.id, blob);
      await updateScreen(row.id, { thumbnail_path });
    }
    setRow({ ...row, schema, title: schema.title, thumbnail_path, updated_at: new Date().toISOString() });
    setEditing(false);
  };

  const heading = (
    <GenToolbarHeading
      onBack={() => navigate('/')}
      title={row?.title}
      meta={row && `${row.area} · ${row.pattern} · ${authorLabel(row.created_by_email)} · ${formatKst(row.updated_at)}`}
    />
  );

  if (editing && row) return <EditorFrame schema={row.schema} heading={heading} onSave={save} onExit={() => setEditing(false)} aiEnabled />;

  return (
    <GenPage fullHeight>
      <GenToolbar>
        {heading}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <GenToolbarButton tone="primary" onClick={() => setEditing(true)} disabled={!row}>
            편집
          </GenToolbarButton>
          <GenToolbarButton onClick={duplicate} disabled={!row}>
            복제
          </GenToolbarButton>
          {row && (
            <ExportMenu
              schema={row.schema}
              title={row.title}
              meta={{
                area: row.area,
                pattern: row.pattern,
                author: row.created_by_email ?? undefined,
                updatedAt: formatKst(row.updated_at),
              }}
              extra={[{ label: '썸네일 갱신', hint: '목록 카드 이미지를 다시 생성', onSelect: refreshThumbnail, disabled: thumbBusy }]}
            />
          )}
          <GenToolbarButton tone="danger" onClick={remove} disabled={!row}>
            삭제
          </GenToolbarButton>
        </div>
      </GenToolbar>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {error && <div style={{ padding: 30, color: 'var(--gen-danger)', fontSize: 13 }}>불러오기 실패: {error}</div>}
        {row && (
          <GenCanvas label={row.title} meta="1860 × 1100">
            <ScreenRenderer schema={row.schema} />
          </GenCanvas>
        )}
      </div>
    </GenPage>
  );
}
