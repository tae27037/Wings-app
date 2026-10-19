import { useState } from "react";
import s from "./Header.module.css";
import Settings from "./Settings";
import { useApp } from "../i18n";
import { FREE_FROM } from "../config";

const Svg = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default function Header({
  user,
  view,
  cat,
  count,
  total,
  likedCount,
  query,
  onQuery,
  onNav,
  onCat,
  onAuth,
  onLogout,
}) {
  const { t, money } = useApp();
  const [closed, setClosed] = useState(false);

  return (
    <header className={s.header}>
      {!closed && (
        <div className={s.announce}>
          <span>{t("announce").replace("{x}", money(FREE_FROM))}</span>
          <button onClick={() => setClosed(true)} aria-label={t("close")}>
            ×
          </button>
        </div>
      )}

      <div className={s.util}>
        <nav>
          <a href="#info">{t("howTo")}</a>
          <a href="#info">{t("faq")}</a>
          <a href="#info">{t("fl_terms")}</a>
        </nav>
        <div>
          <span className={s.set}>
            <Settings />
          </span>
          {user ? (
            <>
              <button onClick={() => onNav("account")}>{user.name}</button>
              <button onClick={onLogout}>{t("logout")}</button>
            </>
          ) : (
            <>
              <button onClick={() => onAuth("login")}>{t("login")}</button>
              <button onClick={() => onAuth("register")}>{t("signup")}</button>
            </>
          )}
        </div>
      </div>

      <div className={s.main}>
        <button className={s.logo} onClick={() => onCat("all")}>
          Maison <span>Wigs</span>
        </button>
        <label className={s.search}>
          <Svg>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </Svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t("searchHdr")}
          />
        </label>
        <div className={s.actions}>
          <button onClick={() => onNav("fav")} aria-label={t("favorites")}>
            ♥{likedCount ? ` ${likedCount}` : ""}
          </button>
          <button className={s.acc} onClick={() => onNav("account")}>
            {t("account")}
          </button>
          <button className={s.cart} onClick={() => onNav("cart")}>
            <Svg>
              <path d="M6 8h12l-1 12H7zM9 8V6a3 3 0 016 0v2" />
            </Svg>
            <span>
              {count ? `${t("cart")} · ${money(total)}` : t("cartEmpty")}
            </span>
          </button>
        </div>
      </div>

      <nav className={s.cats}>
        {["all", "women", "men", "kids"].map((c) => (
          <button
            key={c}
            className={view === "shop" && cat === c ? s.on : ""}
            onClick={() => onCat(c)}
          >
            {t("cat_" + c)}
          </button>
        ))}
      </nav>
    </header>
  );
}
