import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DepoimentosPage from './DepoimentosPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DepoimentosPage />
  </StrictMode>
);
