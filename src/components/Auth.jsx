import { useState } from "react";
import s from "./Auth.module.css";
import Settings from "./Settings";
import ProductImage from "./ProductImage";
import { useApp } from "../i18n";
import { PRODUCTS } from "../config";

export default function Auth({
  onAuth,
  initialMode = "register",
  notice = false,
  onBack,
}) {
  const { t } = useApp();
  const [mode, setMode] = useState(initialMode); // открывается в нужном режиме: вход или регистрация
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr(t("errEmail"));
    if (form.password.length < 6) return setErr(t("errPass"));
    onAuth({ name: form.name || form.email.split("@")[0], email: form.email });
  };

  return (
    <main className={s.wrap}>
      <div className={s.settings}>
        <Settings />
      </div>

      <section className={s.left}>
        <div className={s.logo}>Maison Wigs</div>
        <h1>{t("h1")}</h1>
        <p className={s.lead}>{t("lead")}</p>

        {/* пояснение, почему просят войти (например, при оформлении заказа) */}
        {notice && <p className={s.notice}>{t("authNeeded")}</p>}

        <form onSubmit={submit} className={s.form} noValidate>
          {mode === "register" && (
            <input
              placeholder={t("name")}
              value={form.name}
              onChange={set("name")}
              autoComplete="name"
            />
          )}
          <input
            placeholder={t("email")}
            type="email"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
          />
          <input
            placeholder={t("password")}
            type="password"
            value={form.password}
            onChange={set("password")}
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
          />
          {err && (
            <p className={s.err} role="alert">
              {err}
            </p>
          )}
          <div className={s.actions}>
            <button className={s.primary}>
              {mode === "register" ? t("create") : t("login")}
            </button>
            <button
              type="button"
              className={s.link}
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                setErr("");
              }}
            >
              {mode === "register" ? t("haveAcc") : t("create")}
            </button>
          </div>
        </form>

        {/* вернуться к просмотру каталога без входа */}
        {onBack && (
          <button type="button" className={s.back} onClick={onBack}>
            ← {t("browseOnly")}
          </button>
        )}
      </section>

      <section className={s.right} aria-hidden="true">
        <div className={s.phone}>
          <div className={s.grid}>
            {PRODUCTS.slice(0, 4).map((p) => (
              <div key={p.id} className={s.tile}>
                <ProductImage p={p} size={92} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
