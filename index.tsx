import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

let rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element missing. Creating a fallback container.');
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
  const recovery = document.createElement('div');
  recovery.style.padding = '16px';
  recovery.style.color = '#f87171';
  recovery.style.backgroundColor = '#111';
  recovery.textContent = 'CLI-Verse could not find the mount point. A fallback container was created. Refresh if this persists.';
  rootElement.appendChild(recovery);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);