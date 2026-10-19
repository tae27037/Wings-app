import { useEffect, useState } from "react";
import s from "./App.module.css";
import { PRODUCTS, cartLines, subtotalOf } from "./config";
import { useApp } from "./i18n";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Account from "./components/Account";
import Usp from "./components/Usp";
import Footer from "./components/Footer";
import Chat from "./components/Chat";
import QuickView from "./components/QuickView";
import ProductCard from "./components/ProductCard";

// состояние, которое переживает перезагрузку страницы
function usePersist(key, init) {
  const [v, setV] = useState(() => {
    try {
      const x = localStorage.getItem(key);
      return x ? JSON.parse(x) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  }, [key, v]);
  return [v, setV];
}

export default function App() {
  const { t } = useApp();
  const [user, setUser] = usePersist("user", null);
  const [cart, setCart] = usePersist("cart", {});
  const [likedArr, setLikedArr] = usePersist("liked", []);
  const [orders, setOrders] = usePersist("orders", []);
  const [growth, setGrowth] = usePersist("growth", { balance: 5, lifetime: 5 });
  const [view, setView] = useState("shop");
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const [authFor, setAuthFor] = useState(null); // null или { mode, next, notice }

  const liked = new Set(likedArr);
  const like = (id) =>
    setLikedArr((a) =>
      a.includes(id) ? a.filter((x) => x !== id) : [...a, id],
    );
  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const qty = (id, d) =>
    setCart((c) => {
      const n = { ...c, [id]: (c[id] || 0) + d };
      if (n[id] <= 0) delete n[id];
      return n;
    });
  const placed = (o) => {
    setOrders((x) => [o, ...x]);
    setGrowth((g) => ({
      balance: g.balance - o.used + o.earned,
      lifetime: g.lifetime + o.earned,
    }));
    setCart({});
  };

  // открыть страницу входа/регистрации; next = куда вернуть человека после входа
  const openAuth = (mode = "login", next = "shop", notice = false) => {
    setAuthFor({ mode, next, notice });
    window.scrollTo({ top: 0 });
  };
  const nav = (v) => {
    // гостю закрыты только оформление заказа и личный кабинет
    if (!user && (v === "checkout" || v === "account")) {
      return openAuth(
        v === "checkout" ? "register" : "login",
        v,
        v === "checkout",
      );
    }
    setView(v);
    window.scrollTo({ top: 0 });
  };
  const goCat = (c) => {
    setCat(c);
    setQuery("");
    nav("shop");
  };
  const onAuth = (u) => {
    setUser(u);
    setAuthFor(null);
    setView(authFor?.next || "shop");
  };
  const logout = () => {
    setUser(null);
    setView("shop");
  };

  // страница входа показывается только когда гость сам её открыл
  if (authFor && !user) {
    return (
      <Auth
        onAuth={onAuth}
        initialMode={authFor.mode}
        notice={authFor.notice}
        onBack={() => setAuthFor(null)}
      />
    );
  }

  const lines = cartLines(cart);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const favs = PRODUCTS.filter((p) => liked.has(p.id));

  return (
    <>
      <Header
        user={user}
        view={view}
        cat={cat}
        count={count}
        total={subtotalOf(lines)}
        likedCount={liked.size}
        query={query}
        onQuery={(q) => {
          setQuery(q);
          setView("shop");
        }}
        onNav={nav}
        onCat={goCat}
        onAuth={openAuth}
        onLogout={logout}
      />
      <div className={s.app}>
        {view === "shop" && (
          <Shop
            q={query}
            cat={cat}
            liked={liked}
            onLike={like}
            onOpen={setOpen}
            onAdd={add}
          />
        )}
        {view === "fav" && (
          <section>
            <h1 className={s.h1}>{t("favTitle")}</h1>
            {favs.length ? (
              <div className={s.grid}>
                {favs.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    liked
                    onLike={like}
                    onOpen={setOpen}
                    onAdd={add}
                  />
                ))}
              </div>
            ) : (
              <p className={s.muted}>{t("favEmpty")}</p>
            )}
          </section>
        )}
        {view === "cart" && (
          <Cart
            cart={cart}
            guest={!user}
            onQty={qty}
            onShop={() => nav("shop")}
            onCheckout={() => nav("checkout")}
          />
        )}
        {view === "checkout" && user && (
          <Checkout
            cart={cart}
            bonus={growth.balance}
            onPlaced={placed}
            onBack={() => nav("cart")}
            onShop={() => nav("shop")}
          />
        )}
        {view === "account" && user && (
          <Account
            user={user}
            setUser={setUser}
            orders={orders}
            growth={growth}
            onShop={() => nav("shop")}
          />
        )}
        {view === "shop" && <Usp />}
      </div>
      <Footer onCat={goCat} />
      <Chat onOpen={setOpen} onAdd={add} />
      {open && <QuickView p={open} onClose={() => setOpen(null)} onAdd={add} />}
    </>
  );
}
