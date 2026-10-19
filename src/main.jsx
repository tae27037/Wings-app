import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './i18n';
createRoot(document.getElementById('root')).render(<AppProvider><App /></AppProvider>);

// PWA: офлайн-кэш. Не нужен внутри Android-оболочки (Capacitor) и Windows-приложения (Electron) — там файлы уже на устройстве.
const native = window.Capacitor?.isNativePlatform?.() || location.protocol === 'app:';
if ('serviceWorker' in navigator && import.meta.env.PROD && !native && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
