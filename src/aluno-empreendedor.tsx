import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AlunoEmpreendedorPage from './AlunoEmpreendedorPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlunoEmpreendedorPage />
  </StrictMode>
);
