import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { GenBrand, GenButton, GenEmptyState, GenInput, GenPage, GenScreenCard, GenToolbar, GenToolbarButton } from '../generator/ui';
import { deleteScreen, duplicateScreen, getScreen, listScreens, thumbnailUrl, updateScreen, uploadThumbnail, type ScreenSummary } from '../lib/screens';
import { captureThumbnail } from '../lib/thumbnail';
import { UploadDialog } from './UploadDialog';

const fmt = (iso: string) => iso.replace('T', ' ').slice(0, 16);

export function ScreenListPage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<ScreenSummary[] | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = () =>
    listScreens()
      .then(setRows)
      .catch((e) => setError(e.message ?? String(e)));
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!rows) return [];
    if (!k) return rows;
    return rows.filter((r) => [r.title, r.area, r.pattern, r.created_by_email ?? ''].some((v) => v.toLowerCase().includes(k)));
  }, [rows, q]);

  const duplicate = async (r: ScreenSummary) => {
    const copy = await duplicateScreen(await getScreen(r.id));
    const blob = await captureThumbnail(copy.schema);
    if (blob) await updateScreen(copy.id, { thumbnail_path: await uploadThumbnail(copy.id, blob) });
    load();
  };

  const remove = async (r: ScreenSummary) => {
    if (!window.confirm(`"${r.title}" 화면을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    await deleteScreen(r.id, r.thumbnail_path);
    load();
  };

  return (
    <GenPage>
      <GenToolbar>
        <GenBrand />
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gen-text-hint)', fontFamily: 'var(--gen-font-mono)' }}>{session?.user.email}</span>
        <GenToolbarButton tone="ghost" onClick={signOut}>
          로그아웃
        </GenToolbarButton>
      </GenToolbar>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>화면 목록</h1>
          <span style={{ fontSize: 12, color: 'var(--gen-text-hint)', fontFamily: 'var(--gen-font-mono)' }}>
            {rows ? `${filtered.length} / ${rows.length}` : ''}
          </span>
          <GenInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목 · 영역 · 패턴 · 작성자 검색"
            width={320}
            style={{ marginLeft: 'auto' }}
          />
          <GenButton variant="ghost" onClick={() => navigate('/intake')}>
            요청서 만들기
          </GenButton>
          <GenButton variant="ghost" onClick={() => navigate('/guide')}>
            사용 안내
          </GenButton>
          <GenButton onClick={() => setUploadOpen(true)}>+ 새 화면 올리기</GenButton>
          <GenButton variant="primary" onClick={() => navigate('/generate')}>
            AI로 화면 만들기
          </GenButton>
        </div>

        {error && <div style={{ color: 'var(--gen-danger)', fontSize: 13, marginBottom: 16 }}>불러오기 실패: {error}</div>}
        {rows && rows.length === 0 && (
          <GenEmptyState>
            아직 화면이 없습니다. [AI로 화면 만들기]로 요구사항을 적거나, [새 화면 올리기]로 Claude가 만든 스키마 JSON을 올려 보세요.
          </GenEmptyState>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((r) => (
            <GenScreenCard
              key={r.id}
              title={r.title}
              area={r.area}
              pattern={r.pattern}
              updatedAt={fmt(r.updated_at)}
              author={r.created_by_email}
              thumbnail={thumbnailUrl(r.thumbnail_path, r.updated_at)}
              onOpen={() => navigate(`/screens/${r.id}`)}
              onDuplicate={() => duplicate(r)}
              onDelete={() => remove(r)}
            />
          ))}
        </div>
      </main>

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onCreated={(id) => {
          setUploadOpen(false);
          navigate(`/screens/${id}`);
        }}
      />
    </GenPage>
  );
}
