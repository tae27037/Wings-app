import s from './ProductCard.module.css';
import ProductImage from './ProductImage';
import { useApp } from '../i18n';
import { ratingOf, reviewsOf } from '../config';

export default function ProductCard({ p, liked, onLike, onOpen, onAdd }) {
  const { t, tr, money } = useApp();
  const avg = ratingOf(p.id);
  return (
    <article className={s.card}>
      <button className={s.media} onClick={() => onOpen(p)} aria-label={p.name}>
        <ProductImage p={p} />
        {p.tag && <span className={s.tag}>{t('tag_' + p.tag)}</span>}
      </button>
      <button className={`${s.like} ${liked ? s.liked : ''}`} onClick={() => onLike(p.id)} aria-pressed={liked} aria-label={t('favAdd')}>♥</button>
      <div className={s.body}>
        <h3><button className={s.title} onClick={() => onOpen(p)}>{p.name}</button></h3>
        <p className={s.meta}>{avg ? `★ ${avg.toFixed(1)} (${reviewsOf(p.id).length}) · ` : ''}{tr(p.color)}</p>
        <p className={s.meta}>{t('len_' + p.length)} · {t('mat_' + p.material)}</p>
        <div className={s.row}>
          <strong>{money(p.price)}</strong>
          <button className={s.add} onClick={() => onAdd(p.id)}>{t('add')}</button>
        </div>
      </div>
    </article>
  );
}
