import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Button, Input } from '../design-system';
import { Brand, Toolbar } from '../generator/chrome';
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
    <div style={{ minHeight: '100vh', background: 'var(--pp-gray-80)', fontFamily: 'var(--font-sans)', color: 'var(--pp-gray-900)' }}>
      <Toolbar>
        <Brand />
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--pp-gray-450)' }}>{session?.user.email}</span>
        <Button variant="ghost" size="sm" onClick={signOut} style={{ color: '#fff', fontSize: 12 }}>
          로그아웃
        </Button>
      </Toolbar>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>화면 목록</h1>
          <span style={{ fontSize: 12, color: 'var(--pp-gray-700)' }}>{rows ? `${filtered.length} / ${rows.length}개` : ''}</span>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목 · 영역 · 패턴 · 작성자 검색"
            clearable
            width={320}
            style={{ marginLeft: 'auto' }}
            inputStyle={{ height: 34, fontSize: 13 }}
          />
          <Link to="/intake" style={{ fontSize: 13, color: 'var(--pp-navy-800)', whiteSpace: 'nowrap' }}>
            요청서 만들기
          </Link>
          <Link to="/guide" style={{ fontSize: 13, color: 'var(--pp-navy-800)', whiteSpace: 'nowrap' }}>
            사용 안내
          </Link>
          <Button variant="primary" onClick={() => navigate('/generate')} style={{ height: 34 }}>
            AI로 화면 만들기
          </Button>
          <Button variant="danger" onClick={() => setUploadOpen(true)} style={{ height: 34 }}>
            새 화면 올리기
          </Button>
        </div>

        {error && <div style={{ color: 'var(--bs-danger)', fontSize: 13, marginBottom: 16 }}>불러오기 실패: {error}</div>}
        {rows && rows.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: 'var(--pp-gray-700)',
              fontSize: 13,
              background: '#fff',
              border: '1px dashed var(--pp-gray-300)',
              borderRadius: 8,
            }}
          >
            아직 화면이 없습니다. [새 화면 올리기]로 Claude가 만든 스키마 JSON을 올려 보세요.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((r) => {
            const thumb = thumbnailUrl(r.thumbnail_path, r.updated_at);
            return (
              <article
                key={r.id}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/screens/${r.id}`)}
                  style={{
                    display: 'block',
                    padding: 0,
                    border: 0,
                    borderBottom: '1px solid var(--border-default)',
                    background: 'var(--pp-gray-60)',
                    aspectRatio: '1860 / 1100',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  aria-label={`${r.title} 열기`}
                >
                  {thumb ? (
                    <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--pp-gray-500)' }}>
                      미리보기 없음
                    </div>
                  )}
                </button>
                <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--pp-navy-800)',
                        background: 'var(--pp-gray-100)',
                        borderRadius: 3,
                        padding: '1px 6px',
                      }}
                    >
                      {r.area}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--pp-gray-700)', background: 'var(--pp-gray-100)', borderRadius: 3, padding: '1px 6px' }}>
                      {r.pattern}
                    </span>
                  </div>
                  <a
                    href={`/screens/${r.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/screens/${r.id}`);
                    }}
                    style={{ fontSize: 15, fontWeight: 700, color: 'var(--pp-gray-900)' }}
                  >
                    {r.title}
                  </a>
                  <div style={{ fontSize: 11, color: 'var(--pp-gray-700)', marginTop: 'auto' }}>
                    {fmt(r.updated_at)} · {r.created_by_email ?? '-'}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/screens/${r.id}`)}>
                      열기
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => duplicate(r)}>
                      복제
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(r)} style={{ marginLeft: 'auto', color: 'var(--bs-danger)' }}>
                      삭제
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
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
    </div>
  );
}
