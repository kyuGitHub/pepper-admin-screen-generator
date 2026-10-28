import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../design-system';
import { Brand, Toolbar } from '../generator/chrome';
import { EditorFrame } from '../editor/EditorFrame';
import { deleteScreen, getScreen, updateScreen, uploadThumbnail, type ScreenRow } from '../lib/screens';
import { captureThumbnail } from '../lib/thumbnail';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';

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

  const downloadJson = () => {
    if (!row) return;
    const blob = new Blob([JSON.stringify(row.schema, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${row.title}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditing(true)}
            disabled={!row}
            style={{ background: '#fff', color: 'var(--pp-navy-800)', borderColor: '#fff' }}
          >
            편집
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadJson}
            disabled={!row}
            style={{ background: 'transparent', color: '#fff', borderColor: 'var(--pp-navy-300)' }}
          >
            JSON 내려받기
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={remove}
            disabled={!row}
            style={{ background: 'transparent', color: '#fff', borderColor: 'var(--pp-navy-300)' }}
          >
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
