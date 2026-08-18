import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FilhosBrilhantesPage from './FilhosBrilhantesPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FilhosBrilhantesPage />
  </StrictMode>
);
