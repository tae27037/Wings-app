import s from './Settings.module.css';
import { useApp } from '../i18n';

export default function Settings() {
  const { lang, setLang, cur, setCur, theme, setTheme, t } = useApp();
  return (
    <div className={s.bar}>
      <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
        <option value="cs">CZ</option><option value="en">EN</option>
      </select>
      <select value={cur} onChange={(e) => setCur(e.target.value)} aria-label="Currency">
        {['CZK', 'EUR', 'USD'].map((c) => <option key={c}>{c}</option>)}
      </select>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={t('theme')}>{theme === 'dark' ? '☀' : '☾'}</button>
    </div>
  );
}
