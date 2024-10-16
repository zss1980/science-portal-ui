import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/auth/AuthProvider';
import { AppProvider } from './context/app/AppProvider';
import { DataProvider } from './context/data/DataProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </AppProvider>
  </StrictMode>,
);
