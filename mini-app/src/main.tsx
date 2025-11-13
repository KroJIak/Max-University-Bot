import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { SubgroupProvider } from './shared/state/subgroup';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <SubgroupProvider>
      <App />
    </SubgroupProvider>
  </StrictMode>,
);

