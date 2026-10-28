import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Button, Input } from '../design-system';
import { CenterCard, ErrorText, Field, inputInner, inputStyle } from '../generator/chrome';
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
    <CenterCard title="비밀번호 설정">
      <form onSubmit={submit}>
        <Field label="새 비밀번호 (8자 이상)">
          <Input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={inputStyle}
            inputStyle={inputInner}
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label="새 비밀번호 확인">
          <Input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            style={inputStyle}
            inputStyle={inputInner}
            autoComplete="new-password"
            required
          />
        </Field>
        <ErrorText>{error}</ErrorText>
        <Button type="submit" variant="primary" size="lg" disabled={busy} style={{ width: '100%' }}>
          저장하고 시작하기
        </Button>
      </form>
    </CenterCard>
  );
}
