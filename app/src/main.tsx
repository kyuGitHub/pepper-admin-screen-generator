import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './design-system';
import { ScreenRenderer } from './renderer/ScreenRenderer';
import { loanApplicationDetailScreen } from './screens/loanApplicationDetail/schema';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScreenRenderer schema={loanApplicationDetailScreen} />
  </StrictMode>,
);
