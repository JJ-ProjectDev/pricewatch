import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

function App() {
  return (
    <main className="app-shell">
      <section className="status-panel">
        <p className="eyebrow">Iteration 1 Foundation</p>
        <h1>PriceWatch</h1>
        <p className="summary">
          The local development platform is ready: React, NestJS, PostgreSQL,
          Redis, and RabbitMQ are wired together with Docker Compose.
        </p>
        <a className="health-link" href={`${apiBaseUrl}/health`}>
          Open API health
        </a>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
