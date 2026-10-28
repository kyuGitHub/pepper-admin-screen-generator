import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../design-system';
import { Brand, Toolbar } from '../generator/chrome';
import { EditorFrame } from '../editor/EditorFrame';
import { ExportMenu } from '../generator/ExportMenu';
import { deleteScreen, duplicateScreen, getScreen, updateScreen, uploadThumbnail, type ScreenRow } from '../lib/screens';
import { captureThumbnail } from '../lib/thumbnail';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';

const tbBtn = { background: 'transparent', color: '#fff', borderColor: 'var(--pp-navy-300)' } as const;

export function ScreenPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState<ScreenRow | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

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

  const heading = (
    <>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 13 }}>
        ← 목록
      </Link>
      <span style={{ color: 'var(--pp-gray-450)' }}>|</span>
      <Brand />
      {row && (
        <>
          <span style={{ marginLeft: 12, fontWeight: 700 }}>{row.title}</span>
          <span style={{ fontSize: 11, color: 'var(--pp-gray-450)' }}>
            {row.area} · {row.pattern}
          </span>
        </>
      )}
    </>
  );

  if (editing && row) return <EditorFrame schema={row.schema} heading={heading} onSave={save} onExit={() => setEditing(false)} />;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        {heading}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditing(true)}
            disabled={!row}
            style={{ background: '#fff', color: 'var(--pp-navy-800)', borderColor: '#fff' }}
          >
            편집
          </Button>
          <Button variant="outline" size="sm" onClick={duplicate} disabled={!row} style={tbBtn}>
            복제
          </Button>
          {row && (
            <ExportMenu
              schema={row.schema}
              title={row.title}
              meta={{
                area: row.area,
                pattern: row.pattern,
                author: row.created_by_email ?? undefined,
                updatedAt: row.updated_at.replace('T', ' ').slice(0, 16),
              }}
              extra={[{ label: '썸네일 갱신', hint: '목록 카드 이미지를 다시 생성', onSelect: refreshThumbnail, disabled: thumbBusy }]}
            />
          )}
          <Button variant="outline" size="sm" onClick={remove} disabled={!row} style={tbBtn}>
            삭제
          </Button>
        </div>
      </Toolbar>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {error && <div style={{ padding: 30, color: 'var(--bs-danger)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>불러오기 실패: {error}</div>}
        {row && <ScreenRenderer schema={row.schema} />}
      </div>
    </div>
  );
}
