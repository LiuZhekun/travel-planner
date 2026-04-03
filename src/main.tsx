import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  // GitHub Pages：使用相对路径避免 base="/" 问题
  navigator.serviceWorker
    .register('./sw.js')
    .catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerServiceWorker();
