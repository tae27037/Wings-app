import s from './Usp.module.css';
import { useApp } from '../i18n';
import { FREE_FROM } from '../config';

const ICONS = {
  truck: 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  back: 'M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M18 3v4h-4M6 21v-4h4',
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  chat: 'M4 5h16v11H9l-5 4z',
};

export default function Usp() {
  const { t, money } = useApp();
  return (
    <ul className={s.usp}>
      {[['truck', 1], ['card', 2], ['back', 3], ['home', 4], ['shield', 5], ['chat', 6]].map(([ic, n]) => (
        <li key={n}>
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[ic]} /></svg>
          <div><strong>{t(`usp${n}t`)}</strong><span>{t(`usp${n}d`).replace('{x}', money(FREE_FROM))}</span></div>
        </li>
      ))}
    </ul>
  );
}
