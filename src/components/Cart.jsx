import s from "./Cart.module.css";
import ProductImage from "./ProductImage";
import { useApp } from "../i18n";
import { FREE_FROM, cartLines, subtotalOf } from "../config";

export default function Cart({ cart, guest, onQty, onShop, onCheckout }) {
  const { t, tr, money } = useApp();
  const lines = cartLines(cart);
  const total = subtotalOf(lines);
  const left = Math.max(0, FREE_FROM - total);

  if (!lines.length) {
    return (
      <div className={s.empty}>
        <h1>{t("emptyCart")}</h1>
        <p>{t("emptyHint")}</p>
        <button onClick={onShop}>{t("goCatalog")}</button>
      </div>
    );
  }

  return (
    <div className={s.layout}>
      <section className={s.list}>
        <h1>{t("cartTitle")}</h1>
        {lines.map(({ p, qty }) => (
          <div key={p.id} className={s.line}>
            <div className={s.thumb}>
              <ProductImage p={p} size={64} />
            </div>
            <div className={s.name}>
              <h3>{p.name}</h3>
              <p>
                {tr(p.color)} · {t("len_" + p.length)}
              </p>
            </div>
            <div className={s.qty}>
              <button onClick={() => onQty(p.id, -1)} aria-label="−">
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => onQty(p.id, 1)} aria-label="+">
                +
              </button>
            </div>
            <strong>{money(p.price * qty)}</strong>
          </div>
        ))}
      </section>

      <aside className={s.summary}>
        <h2>{t("yourOrder")}</h2>
        <div className={s.bar}>
          <i
            style={{ width: `${Math.min(100, (total / FREE_FROM) * 100)}%` }}
          />
        </div>
        <p className={s.ship}>
          {left ? t("freeLeft").replace("{x}", money(left)) : t("freeShip")}
        </p>
        <div className={s.sum}>
          <span>{t("subtotal")}</span>
          <strong>{money(total)}</strong>
        </div>

        <button className={s.cta} onClick={onCheckout}>
          {t("checkout")}
        </button>
        {/* подсказка только для гостей: оформление требует входа */}
        {guest && <p className={s.ship}>{t("authNeeded")}</p>}

        <ul>
          <li>{t("perk1")}</li>
          <li>{t("perk2")}</li>
          <li>{t("perk3")}</li>
        </ul>
      </aside>
    </div>
  );
}
