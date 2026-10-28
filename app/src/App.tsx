import type { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { EditorFrame } from './editor/EditorFrame';
import { ThumbnailCheck } from './pages/ThumbnailCheck';
import { DemoScreenPage } from './pages/DemoScreenPage';
import { IntakePage } from './pages/IntakePage';
import { GuidePage } from './pages/GuidePage';
import { GeneratePage } from './pages/GeneratePage';
import { KitPage } from './pages/KitPage';
import { isConfigured } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import { ScreenListPage } from './pages/ScreenListPage';
import { ScreenPage } from './pages/ScreenPage';
import { SetPasswordPage } from './pages/SetPasswordPage';
import { ScreenRenderer } from './renderer/ScreenRenderer';
import { SAMPLE_SCREENS } from './screens';

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading, needsPassword } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (needsPassword && location.pathname !== '/set-password') return <Navigate to="/set-password" replace />;
  return <>{children}</>;
}

export function App() {
  // Demo mode (no Supabase variables): a built-in sample only, picked with ?screen=<key>; used by `npm run build:single`.
  if (!isConfigured) {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('screen') ?? 'loanApplicationDetail';
    const sample = SAMPLE_SCREENS[key] ?? SAMPLE_SCREENS.loanApplicationDetail;
    if (params.get('kit')) return <KitPage />;
    // The demo pages use router hooks for links; a memory router keeps them working without URLs.
    if (params.get('intake'))
      return (
        <MemoryRouter>
          <IntakePage demo />
        </MemoryRouter>
      );
    if (params.get('guide'))
      return (
        <MemoryRouter>
          <GuidePage demo />
        </MemoryRouter>
      );
    // ?thumb=1 shows what the thumbnail capture produces for the sample (debugging aid, no database needed).
    if (params.get('thumb')) return <ThumbnailCheck schema={sample.schema} />;
    // ?tools=1 shows the sample with the export menu (no database needed).
    if (params.get('tools')) return <DemoScreenPage schema={sample.schema} />;
    // ?edit=1 opens the click editor on the sample; 저장 downloads the edited JSON (there is no database in demo mode).
    if (params.get('edit')) {
      return (
        <EditorFrame
          schema={sample.schema}
          saveLabel="JSON 내려받기"
          onSave={async (schema) => {
            const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${schema.title}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
          }}
          onExit={() => {
            params.delete('edit');
            window.location.search = params.toString();
          }}
        />
      );
    }
    return (
      <div style={{ height: '100vh' }}>
        <ScreenRenderer schema={sample.schema} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/set-password"
            element={
              <RequireAuth>
                <SetPasswordPage />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <ScreenListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/generate"
            element={
              <RequireAuth>
                <GeneratePage />
              </RequireAuth>
            }
          />
          <Route
            path="/intake"
            element={
              <RequireAuth>
                <IntakePage />
              </RequireAuth>
            }
          />
          <Route
            path="/guide"
            element={
              <RequireAuth>
                <GuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/screens/:id"
            element={
              <RequireAuth>
                <ScreenPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
