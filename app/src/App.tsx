import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { isConfigured } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import { ScreenListPage } from './pages/ScreenListPage';
import { ScreenPage } from './pages/ScreenPage';
import { SetPasswordPage } from './pages/SetPasswordPage';
import { ScreenRenderer } from './renderer/ScreenRenderer';
import { loanApplicationDetailScreen } from './screens/loanApplicationDetail/schema';

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading, needsPassword } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (needsPassword && location.pathname !== '/set-password') return <Navigate to="/set-password" replace />;
  return <>{children}</>;
}

export function App() {
  // Demo mode (no Supabase variables): the sample screen only, as used by `npm run build:single`.
  if (!isConfigured)
    return (
      <div style={{ height: '100vh' }}>
        <ScreenRenderer schema={loanApplicationDetailScreen} />
      </div>
    );

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
