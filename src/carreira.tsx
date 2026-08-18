import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CarreiraPage from './CarreiraPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CarreiraPage />
  </StrictMode>
);
