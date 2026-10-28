import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { GenButton, GenCenterCard, GenErrorText, GenField, GenInput } from '../generator/ui';
import { db } from '../lib/supabase';

/** Shown after an invite or password-reset link: the user picks a password, then goes to the list. */
export function SetPasswordPage() {
  const { clearNeedsPassword } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setError('비밀번호는 8자 이상이어야 합니다.');
    if (pw !== pw2) return setError('두 비밀번호가 다릅니다.');
    setBusy(true);
    const { error } = await db().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setError(error.message);
    clearNeedsPassword();
    window.history.replaceState(null, '', window.location.pathname);
    navigate('/', { replace: true });
  };

  return (
    <GenCenterCard title="비밀번호 설정">
      <form onSubmit={submit}>
        <GenField label="새 비밀번호 (8자 이상)">
          <GenInput size="lg" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" required />
        </GenField>
        <GenField label="새 비밀번호 확인">
          <GenInput size="lg" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" required />
        </GenField>
        <GenErrorText>{error}</GenErrorText>
        <GenButton type="submit" variant="primary" size="lg" block disabled={busy} style={{ marginTop: 6 }}>
          저장하고 시작하기
        </GenButton>
      </form>
    </GenCenterCard>
  );
}
