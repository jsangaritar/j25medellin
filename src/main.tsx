import { registerSW } from 'virtual:pwa-register';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { persister, queryClient } from './app/providers';
import './index.css';

registerSW({ immediate: true });

const rootElement = document.getElementById('root');

if (rootElement) {
  // Restore persisted queries before rendering so data is available on first paint
  persister.restoreQueries(queryClient, {}).then(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
} else {
  console.error('Root element not found');
}
