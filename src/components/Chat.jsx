import { useEffect, useRef, useState } from 'react';
import s from './Chat.module.css';
import { useApp } from '../i18n';
import { PRODUCTS } from '../config';
import ProductImage from './ProductImage';
import { ask } from '../assistant';

const CHIPS = ['office', 'party', 'men', 'kids', 'bonus', 'surprise', 'horoscope'];

export default function Chat({ onOpen, onAdd }) {
  const { t, tr, money, lang, cur } = useApp();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([]);
  const end = useRef(null);

  useEffect(() => { if (open && !msgs.length) setMsgs([{ from: 'bot', text: t('chatHello') }]); }, [open]); // eslint-disable-line
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, busy]);

  const send = async (m) => {
    const q = m.trim();
    if (!q || busy) return;
    const history = msgs;
    setText('');
    setMsgs((x) => [...x, { from: 'me', text: q }]);
    setBusy(true);
    const res = await ask(q, { lang, money, cur, history });
    setMsgs((x) => [...x, { from: 'bot', text: res.text, ids: res.ids }]);
    setBusy(false);
  };

  if (!open) return <button className={s.fab} onClick={() => setOpen(true)}><span aria-hidden="true">✦</span> {t('chatOpen')}</button>;
  return (
    <section className={s.panel} role="dialog" aria-label={t('chatTitle')}>
      <header>
        <div><strong>✦ {t('chatTitle')}</strong><small>{t('chatNote')}</small></div>
        <button onClick={() => setOpen(false)} aria-label={t('close')}>×</button>
      </header>
      <div className={s.list} aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`${s.msg} ${m.from === 'me' ? s.me : ''}`}>
            <p>{m.text}</p>
            {m.ids?.map((id) => {
              const p = PRODUCTS.find((x) => x.id === id);
              return p && (
                <div key={id} className={s.prod}>
                  <div className={s.thumb}><ProductImage p={p} size={36} /></div>
                  <div><strong>{p.name}</strong><span>{tr(p.color)} · {money(p.price)}</span></div>
                  <button onClick={() => onOpen(p)}>{t('detail')}</button>
                  <button className={s.add} onClick={() => onAdd(p.id)} aria-label={t('add')}>+</button>
                </div>
              );
            })}
          </div>
        ))}
        {busy && <div className={s.msg}><p className={s.dots}><i /><i /><i /></p></div>}
        <div ref={end} />
      </div>
      <div className={s.chips}>{CHIPS.map((c) => <button key={c} onClick={() => send(t('chip_' + c))}>{t('chip_' + c)}</button>)}</div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t('chatPh')} aria-label={t('chatPh')} />
        <button disabled={busy}>{t('chatSend')}</button>
      </form>
    </section>
  );
}
