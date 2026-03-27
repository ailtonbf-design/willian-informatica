import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CursosPage from './CursosPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CursosPage />
  </StrictMode>
);
