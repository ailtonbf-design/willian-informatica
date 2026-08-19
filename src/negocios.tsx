import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import NegociosPage from './NegociosPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NegociosPage />
  </StrictMode>
);
