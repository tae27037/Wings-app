import { useState } from 'react';
import s from './Checkout.module.css';
import { useApp } from '../i18n';
import { DELIVERY, PAYMENT, COUNTRIES, FREE_FROM, cartLines, subtotalOf, shippingCost } from '../config';

const EMPTY = { email: '', name: '', phone: '', street: '', city: '', zip: '', country: 'CZ', delivery: 'packeta', payment: 'card', note: '', terms: false };

export default function Checkout({ cart, bonus = 0, onPlaced, onBack, onShop }) {
  const { t, tr, money } = useApp();
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  const [useBonus, setUseBonus] = useState(false);

  const lines = cartLines(cart);
  const sub = subtotalOf(lines);
  const dl = DELIVERY.find((d) => d.id === f.delivery);
  const pay = PAYMENT.find((p) => p.id === f.payment);
  const ship = shippingCost(dl, sub);
  const maxUse = Math.floor(Math.min(bonus * 10, sub / 2) / 10);
  const disc = useBonus ? maxUse * 10 : 0;
  const total = sub + ship + pay.fee - disc;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  if (done) return (
    <div className={s.done}>
      <div className={s.check}>✓</div>
      <h1>{t('thanks')}</h1>
      <p>{t('orderNo')}: <strong>{done.no}</strong></p>
      <p>{t('sentTo')} <strong>{done.email}</strong></p>
      <p className={s.sum}>{t('total')}: <strong>{money(done.total)}</strong></p>
      <p>{t('earnedMsg').replace('{x}', done.earned)}</p>
      <button className={s.cta} onClick={onShop}>{t('continue')}</button>
    </div>
  );
  if (!lines.length) return (
    <div className={s.done}><h1>{t('emptyCart')}</h1><button className={s.cta} onClick={onShop}>{t('goCatalog')}</button></div>
  );

  const submit = (ev) => {
    ev.preventDefault();
    const home = f.delivery !== 'pickup';
    const rules = {
      email: /^\S+@\S+\.\S+$/.test(f.email),
      name: f.name.trim().includes(' '),
      phone: /^\+?[\d\s]{9,15}$/.test(f.phone.trim()),
      ...(home && { street: f.street.trim().length > 2, city: f.city.trim().length > 1, zip: /^\d{3}\s?\d{2}$|^\d{4,5}$/.test(f.zip.trim()) }),
    };
    const e = {};
    for (const [k, ok] of Object.entries(rules)) if (!ok) e[k] = f[k].trim() ? t('invalid') : t('required');
    if (!f.terms) e.terms = t('required');
    setErr(e);
    const first = Object.keys(e)[0];
    if (first) return document.getElementById('f-' + first)?.focus();
    const no = 'MW-' + Date.now().toString().slice(-6), earned = Math.floor(total / 100);
    setDone({ no, email: f.email, total, earned });
    onPlaced({ no, date: new Date().toISOString(), total, earned, used: disc / 10, items: lines.map(({ p, qty }) => ({ name: p.name, qty })) });
  };

  const field = (k, label, props = {}) => (
    <label className={s.field}>
      <span>{label}</span>
      <input id={'f-' + k} value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} {...props} />
      {err[k] && <em role="alert">{err[k]}</em>}
    </label>
  );
  const options = (name, list, hint) => list.map((o) => (
    <label key={o.id} className={`${s.opt} ${f[name] === o.id ? s.sel : ''}`}>
      <input type="radio" name={name} checked={f[name] === o.id} onChange={() => setF({ ...f, [name]: o.id })} />
      <span>{tr(o.label)}<small>{hint(o)}</small></span>
    </label>
  ));

  return (
    <form className={s.layout} onSubmit={submit} noValidate>
      <div className={s.main}>
        <button type="button" className={s.back} onClick={onBack}>← {t('back')}</button>
        <h1>{t('coTitle')}</h1>
        <section className={s.card}>
          <h2>{t('contact')}</h2>
          <div className={s.grid}>
            {field('email', t('email'), { type: 'email', autoComplete: 'email' })}
            {field('name', t('fullName'), { autoComplete: 'name' })}
            {field('phone', t('phone'), { type: 'tel', autoComplete: 'tel', placeholder: '+420' })}
          </div>
        </section>
        <section className={s.card}>
          <h2>{t('delivery')}</h2>
          <div className={s.opts}>{options('delivery', DELIVERY, (o) => `${tr(o.eta)} · ${!o.price || sub >= FREE_FROM ? t('free') : money(o.price)}`)}</div>
          {f.delivery !== 'pickup' && (
            <div className={s.grid}>
              {field('street', t('street'), { autoComplete: 'street-address' })}
              {field('city', t('city'), { autoComplete: 'address-level2' })}
              {field('zip', t('zip'), { autoComplete: 'postal-code' })}
              <label className={s.field}><span>{t('country')}</span>
                <select value={f.country} onChange={set('country')}>
                  {Object.entries(COUNTRIES).map(([k, v]) => <option key={k} value={k}>{tr(v)}</option>)}
                </select>
              </label>
            </div>
          )}
        </section>
        <section className={s.card}>
          <h2>{t('payment')}</h2>
          <div className={s.opts}>{options('payment', PAYMENT, (o) => (o.fee ? `+ ${money(o.fee)}` : ''))}</div>
          <label className={s.field}><span>{t('note')}</span><input value={f.note} onChange={set('note')} /></label>
        </section>
      </div>
      <aside className={s.summary}>
        <h2>{t('yourOrder')}</h2>
        {lines.map(({ p, qty }) => (
          <div key={p.id} className={s.item}><span>{p.name} × {qty}</span><span>{money(p.price * qty)}</span></div>
        ))}
        <div className={s.item}><span>{t('shipping')}</span><span>{ship ? money(ship) : t('free')}</span></div>
        {pay.fee > 0 && <div className={s.item}><span>{t('payment')}</span><span>{money(pay.fee)}</span></div>}
        {disc > 0 && <div className={s.item}><span>{t('discount')}</span><span>−{money(disc)}</span></div>}
        <div className={`${s.item} ${s.total}`}><span>{t('total')}</span><strong>{money(total)}</strong></div>
        {maxUse > 0 && (
          <label className={s.terms}>
            <input type="checkbox" checked={useBonus} onChange={(e) => setUseBonus(e.target.checked)} />
            <span>{t('useBonus').replace('{x}', maxUse).replace('{y}', money(maxUse * 10))}</span>
          </label>
        )}
        <label className={s.terms}>
          <input id="f-terms" type="checkbox" checked={f.terms} onChange={set('terms')} aria-invalid={!!err.terms} />
          <span>{t('terms')}{err.terms && <em role="alert"> — {err.terms}</em>}</span>
        </label>
        <button className={s.cta}>{t('place')}</button>
      </aside>
    </form>
  );
}
