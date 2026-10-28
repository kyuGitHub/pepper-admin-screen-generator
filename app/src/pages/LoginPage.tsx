import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { GenButton, GenCenterCard, GenErrorText, GenField, GenInput } from '../generator/ui';
import { db } from '../lib/supabase';

export function LoginPage() {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to={(location.state as { from?: string } | null)?.from ?? '/'} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await db().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 맞지 않습니다.' : error.message);
  };

  return (
    <GenCenterCard title="화면 제너레이터 로그인">
      <form onSubmit={submit}>
        <GenField label="이메일">
          <GenInput size="lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </GenField>
        <GenField label="비밀번호">
          <GenInput size="lg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </GenField>
        <GenErrorText>{error}</GenErrorText>
        <GenButton type="submit" variant="primary" size="lg" block disabled={busy} style={{ marginTop: 6 }}>
          {busy ? '확인 중…' : '로그인'}
        </GenButton>
        <p style={{ margin: '16px 0 0', fontSize: 12, color: 'var(--gen-text-hint)', lineHeight: 1.6 }}>
          계정은 관리자가 초대 메일로 발급합니다. 초대 메일의 링크를 열면 비밀번호 설정 화면으로 이어집니다.
        </p>
      </form>
    </GenCenterCard>
  );
}
