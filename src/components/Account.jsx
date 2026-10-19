import { useState } from 'react';
import s from './Account.module.css';
import { useApp } from '../i18n';

const LEVELS = [['short', 0], ['bob', 10], ['mid', 30], ['long', 60]]; // уровень, нужно см
const MAX = 60;

export default function Account({ user, setUser, orders, growth, onShop }) {
  const { t, money, lang } = useApp();
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({ name: user.name, email: user.email || '' });
  const [msg, setMsg] = useState('');
  const idx = LEVELS.reduce((a, [, min], i) => (growth.lifetime >= min ? i : a), 0);
  const next = LEVELS[idx + 1];
  const code = 'WIG-' + (user.name.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase() || 'FRND') + '5';
  const tabs = [['overview', t('acc_overview')], ['orders', t('acc_orders') + (orders.length ? ` (${orders.length})` : '')], ['profile', t('acc_profile')]];

  const copy = () => { navigator.clipboard?.writeText(code); setMsg(t('copied')); setTimeout(() => setMsg(''), 1500); };
  const save = (e) => { e.preventDefault(); setUser({ ...user, ...form }); setMsg(t('saved')); setTimeout(() => setMsg(''), 1500); };

  return (
    <div className={s.wrap}>
      <h1>{t('hello').replace('{x}', user.name)}</h1>
      <div className={s.tabs} role="tablist">{tabs.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? s.on : ''} onClick={() => setTab(k)}>{l}</button>))}</div>

      {tab === 'overview' && (
        <div className={s.grid}>
          <section className={`${s.card} ${s.grow}`}>
            <div className={s.top}>
              <div><h2>{t('growTitle')}</h2><p>{t('growText')}</p></div>
              <div className={s.big}><strong>{growth.lifetime}</strong> cm<span>{t('lvlLabel')}: {t('len_' + LEVELS[idx][0])}</span></div>
            </div>
            <div className={s.ruler} role="progressbar" aria-valuemin="0" aria-valuemax={MAX} aria-valuenow={Math.min(growth.lifetime, MAX)}>
              <i style={{ width: `${Math.min(100, (growth.lifetime / MAX) * 100)}%` }} />
              {LEVELS.slice(1).map(([k, min]) => (
                <span key={k} style={{ left: `${(min / MAX) * 100}%` }} className={growth.lifetime >= min ? s.reached : ''}>{min} cm<small>{t('len_' + k)}</small></span>))}
            </div>
            <p className={s.next}>{next ? t('nextLevel').replace('{x}', next[1] - growth.lifetime).replace('{y}', t('len_' + next[0])) : t('maxLevel')}</p>
            <p className={s.balance}>{t('bonusAvail').replace('{x}', growth.balance)}</p>
          </section>
          <section className={s.card}>
            <h2>{t('perks')}</h2>
            <ul className={s.perks}>{LEVELS.map(([k, min], i) => (
              <li key={k} className={i <= idx ? s.got : ''}><b>{i <= idx ? '✓' : '○'}</b><span>{t('perk_' + k)}<small>{min} cm · {t('len_' + k)}</small></span></li>))}</ul>
          </section>
          <section className={s.card}>
            <h2>{t('referral')}</h2><p>{t('refText')}</p>
            <div className={s.code}><code>{code}</code><button onClick={copy}>{msg || t('copy')}</button></div>
          </section>
        </div>
      )}

      {tab === 'orders' && (orders.length ? (
        <div className={s.orders}>{orders.map((o) => (
          <article key={o.no} className={s.card}>
            <header><strong>{o.no}</strong><time>{new Date(o.date).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-GB')}</time></header>
            <p>{o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</p>
            <footer><strong>{money(o.total)}</strong><span className={s.earn}>+{o.earned} cm</span></footer>
          </article>))}</div>
      ) : <div className={s.empty}><p>{t('noOrders')}</p><button onClick={onShop}>{t('goCatalog')}</button></div>)}

      {tab === 'profile' && (
        <form className={`${s.card} ${s.form}`} onSubmit={save}>
          <label>{t('fullName')}<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>{t('email')}<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <div><button className={s.save}>{t('saveProfile')}</button> <span className={s.ok}>{msg}</span></div>
        </form>
      )}
    </div>
  );
}
