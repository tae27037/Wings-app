import { useMemo, useState } from "react";
import s from "./Shop.module.css";
import ProductCard from "./ProductCard";
import { useApp } from "../i18n";
import { PRODUCTS, LENGTHS, MATERIALS, ratingOf } from "../config";

export default function Shop({ liked, onLike, onOpen, onAdd, q, cat }) {
  const { t, tr, money } = useApp();
  const [length, setLength] = useState("");
  const [material, setMaterial] = useState("");
  const [max, setMax] = useState(20000);
  const [sort, setSort] = useState("rating");

  const items = useMemo(() => {
    const list = PRODUCTS.filter(
      (p) =>
        (p.name + tr(p.color)).toLowerCase().includes(q.toLowerCase()) &&
        (cat === "all" || p.category === cat) &&
        (!length || p.length === length) &&
        (!material || p.material === material) &&
        p.price <= max,
    );
    return list.sort((a, b) =>
      sort === "cheap"
        ? a.price - b.price
        : sort === "pricey"
          ? b.price - a.price
          : ratingOf(b.id) - ratingOf(a.id),
    );
  }, [q, cat, length, material, max, sort, tr]);

  const reset = () => {
    setLength("");
    setMaterial("");
    setMax(20000);
  };
  const chips = (list, prefix, value, set) => (
    <div className={s.chips}>
      {list.map((x) => (
        <button
          key={x}
          className={value === x ? s.on : ""}
          aria-pressed={value === x}
          onClick={() => set(value === x ? "" : x)}
        >
          {t(prefix + x)}
        </button>
      ))}
    </div>
  );

  return (
    <div className={s.layout}>
      <aside className={s.filters}>
        <h2>{t("filters")}</h2>
        <label>{t("length")}</label>
        {chips(LENGTHS, "len_", length, setLength)}
        <label>{t("material")}</label>
        {chips(MATERIALS, "mat_", material, setMaterial)}
        <label htmlFor="max">
          {t("budget")} {money(max)}
        </label>
        <input
          id="max"
          type="range"
          min="2000"
          max="20000"
          step="500"
          value={max}
          onChange={(e) => setMax(+e.target.value)}
        />
        <button className={s.reset} onClick={reset}>
          {t("reset")}
        </button>
        <div className={s.tip}>
          <h3>{t("tipTitle")}</h3>
          <p>{t("tipText")}</p>
        </div>
      </aside>
      <section>
        <div className={s.hero}>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroText")}</p>
        </div>
        {cat === "kids" && (
          <aside className={s.kids}>
            <h3>{t("kidsTitle")}</h3>
            <p>{t("kidsText")}</p>
          </aside>
        )}
        <header className={s.head}>
          <h2>
            {t("recommended")} <span>{items.length}</span>
          </h2>
          <select
            className={s.sort}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label={t("sortLabel")}
          >
            <option value="rating">{t("sortRating")}</option>
            <option value="cheap">{t("sortCheap")}</option>
            <option value="pricey">{t("sortPricey")}</option>
          </select>
        </header>
        {items.length ? (
          <div className={s.grid}>
            {items.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                liked={liked.has(p.id)}
                onLike={onLike}
                onOpen={onOpen}
                onAdd={onAdd}
              />
            ))}
          </div>
        ) : (
          <p className={s.empty}>
            {t("none")} <button onClick={reset}>{t("noneBtn")}</button>.
          </p>
        )}
      </section>
    </div>
  );
}
