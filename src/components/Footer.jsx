import { useEffect, useState } from 'react';
import s from './Footer.module.css';
import Settings from './Settings';
import { useApp } from '../i18n';
import { PAYMENT } from '../config';

const LINKS = ['blog', 'ship', 'return', 'terms', 'privacy', 'withdraw'];
const PAYICON = { transfer: 'M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18', cod: 'M4 16h6l4 2 6-4-3-2-5 2M12 5a2 2 0 100 4 2 2 0 000-4z', card: 'M3 6h18v12H3zM3 10h18M7 15h4' };

export default function Footer({ onCat }) {
  const { t, tr } = useApp();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <footer className={s.footer} id="info">
      <div className={s.cols}>
        <section><h3>{t('infoTitle')}</h3>
          <ul>{LINKS.map((k) => <li key={k}><a href="#info">{t('fl_' + k)}</a></li>)}</ul></section>
        <section><h3>{t('shopTitle')}</h3>
          <ul>{['women', 'men', 'kids'].map((c) => <li key={c}><button onClick={() => onCat(c)}>{t('cat_' + c)}</button></li>)}</ul></section>
        <section><h3>{t('payTitle')}</h3>
          <ul className={s.pay}>{PAYMENT.map((p) => (
            <li key={p.id}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PAYICON[p.id]} /></svg>{tr(p.label)}</li>))}</ul>
          <div className={s.cards}><b>Apple Pay</b><b>Google Pay</b><b>VISA</b><b>Mastercard</b></div></section>
        <section><h3>{t('contactTitle')}</h3>
          <ul><li>info@maison-wigs.example</li><li>+420 000 000 000</li><li>Brno, Česko</li></ul></section>
      </div>
      <div className={s.controls}>
        <Settings />
        <div className={s.social}>{['Instagram', 'Facebook', 'TikTok', 'YouTube'].map((n) => <a key={n} href="#info">{n}</a>)}</div>
      </div>
      <div className={s.copy}>
        <span>Copyright {new Date().getFullYear()} <strong>Maison Wigs</strong>. {t('rights')}</span>
        <span>{t('demo')}</span>
      </div>
      {show && <button className={s.top} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={t('top')}>↑</button>}
    </footer>
  );
}
