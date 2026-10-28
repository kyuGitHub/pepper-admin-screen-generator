import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
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
    const key = new URLSearchParams(window.location.search).get('screen') ?? 'loanApplicationDetail';
    const sample = SAMPLE_SCREENS[key] ?? SAMPLE_SCREENS.loanApplicationDetail;
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
