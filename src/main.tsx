import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-accent-bright">J+ Medellin</h1>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
