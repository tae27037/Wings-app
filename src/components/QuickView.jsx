import { useEffect, useRef, useState } from "react";
import s from "./QuickView.module.css";
import WigArt from "./WigArt";
import { useApp } from "../i18n";
import { ratingOf, reviewsOf, stars } from "../config";

const ZOOM = 2.6; // кратность лупы
const LENS = 170; // диаметр лупы, px

export default function QuickView({ p, onClose, onAdd }) {
  const { t, tr, money, lang } = useApp();
  const [i, setI] = useState(0);
  const [lens, setLens] = useState(null);
  const [failed, setFailed] = useState({});
  const [nat, setNat] = useState({ w: 3, h: 4 }); // реальные размеры текущего фото
  const touchX = useRef(0);
  const n = p.images.length;
  const go = (d) => {
    setI((x) => (x + d + n) % n);
    setLens(null);
  };

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  // Лупа: считаем так же, как браузер считает object-fit: cover + object-position: center top
  const move = (e) => {
    if (failed[i]) return;
    const r = e.currentTarget.getBoundingClientRect();
    const scale = Math.max(r.width / nat.w, r.height / nat.h);
    const dw = nat.w * scale;
    const dh = nat.h * scale;
    setLens({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      dw,
      dh,
      ox: (r.width - dw) / 2,
    });
  };

  const rs = reviewsOf(p.id);
  const avg = ratingOf(p.id);
  const label = i === 0 ? t("photoFront") : t("photoBack");
  const rows = [
    [
      t("color"),
      <>
        <i style={{ background: p.hex }} />
        {tr(p.color)}
      </>,
    ],
    [t("length"), t("len_" + p.length)],
    [t("material"), t("mat_" + p.material)],
    [t("spCap"), t("cap_" + p.cap)],
    [t("spDensity"), p.density],
    [t("spWeight"), p.weight],
    [t("spLen"), p.hairLength],
    [t("care"), t("care_" + p.material)],
  ];

  return (
    <div className={s.overlay} onClick={onClose}>
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={s.close} onClick={onClose} aria-label={t("close")}>
          ×
        </button>

        <div className={s.art}>
          <div
            className={s.stage}
            onMouseMove={move}
            onMouseLeave={() => setLens(null)}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const d = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(d) > 50) go(d < 0 ? 1 : -1);
            }}
          >
            {failed[i] ? (
              <div className={s.fallback}>
                <WigArt product={p} size={200} />
              </div>
            ) : (
              <img
                src={p.images[i]}
                alt={`${p.name}: ${label}`}
                draggable="false"
                onLoad={(e) =>
                  setNat({
                    w: e.target.naturalWidth,
                    h: e.target.naturalHeight,
                  })
                }
                onError={() => setFailed({ ...failed, [i]: true })}
              />
            )}
            {lens && (
              <div
                className={s.lens}
                style={{
                  left: lens.x - LENS / 2,
                  top: lens.y - LENS / 2,
                  width: LENS,
                  height: LENS,
                  backgroundImage: `url(${p.images[i]})`,
                  backgroundSize: `${lens.dw * ZOOM}px ${lens.dh * ZOOM}px`,
                  backgroundPosition: `${-((lens.x - lens.ox) * ZOOM - LENS / 2)}px ${-(lens.y * ZOOM - LENS / 2)}px`,
                }}
              />
            )}
            <button
              className={`${s.nav} ${s.prev}`}
              onClick={() => go(-1)}
              aria-label={t("prev")}
            >
              ‹
            </button>
            <button
              className={`${s.nav} ${s.next}`}
              onClick={() => go(1)}
              aria-label={t("next")}
            >
              ›
            </button>
          </div>

          <div className={s.thumbs}>
            {p.images.map((_, k) => (
              <button
                key={k}
                className={k === i ? s.on : ""}
                aria-pressed={k === i}
                onClick={() => {
                  setI(k);
                  setLens(null);
                }}
              >
                {k === 0 ? t("photoFront") : t("photoBack")}
              </button>
            ))}
          </div>
          <p className={s.hint}>{t("zoomHint")}</p>
        </div>

        <div className={s.info}>
          <h2>{p.name}</h2>
          <p className={s.sub}>
            <span className={s.stars}>{stars(avg)}</span>{" "}
            {avg ? avg.toFixed(1) : ""} ({rs.length})
          </p>
          <p className={s.desc}>{tr(p.desc)}</p>
          <dl>
            {rows.map(([k, v]) => (
              <>
                <dt key={k}>{k}</dt>
                <dd>{v}</dd>
              </>
            ))}
          </dl>
          <strong className={s.price}>{money(p.price)}</strong>
          <button
            className={s.cta}
            onClick={() => {
              onAdd(p.id);
              onClose();
            }}
          >
            {t("add")}
          </button>
          <p className={s.note}>{t("tryHome")}</p>
        </div>

        <section className={s.reviews}>
          <h3>
            {t("reviews")} ({rs.length})
          </h3>
          {rs.length ? (
            rs.map((r, k) => (
              <article key={k} className={s.review}>
                <header>
                  <strong>{r.name}</strong>
                  <span className={s.stars}>{stars(r.rating)}</span>
                  <time>
                    {new Date(r.date).toLocaleDateString(
                      lang === "cs" ? "cs-CZ" : "en-GB",
                    )}
                  </time>
                </header>
                <p>{tr(r.text)}</p>
                <small>✓ {t("verified")}</small>
              </article>
            ))
          ) : (
            <p className={s.sub}>{t("noReviews")}</p>
          )}
        </section>
      </div>
    </div>
  );
}
