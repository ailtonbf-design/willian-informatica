import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MelhorIdadePage from './MelhorIdadePage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MelhorIdadePage />
  </StrictMode>
);
