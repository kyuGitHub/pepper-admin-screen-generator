import { useLocation, useNavigate } from 'react-router-dom';
import { GenBrand, GenNav } from '../generator/ui';

const MENU = [
  { label: '화면 목록', to: '/' },
  { label: '요청서 만들기', to: '/intake' },
  { label: '사용 안내', to: '/guide' },
];

/** Brand + top menu for the toolbar of the main pages. */
export function AppNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <>
      <GenBrand />
      <span style={{ width: 1, height: 18, background: 'var(--gen-border-control)', flexShrink: 0 }} />
      <GenNav items={MENU.map((m) => ({ label: m.label, active: pathname === m.to, onClick: () => navigate(m.to) }))} />
    </>
  );
}
