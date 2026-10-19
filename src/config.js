import products from "./data/products.json";
import reviews from "./data/reviews.json";

const fixPath = (s) => s.replace(/^\/?public\//, "/");

export const PRODUCTS = products.map((p) => ({
  ...p,
  image: fixPath(p.image),
  images: (p.images || [p.image]).map(fixPath),
}));
export const FREE_FROM = 3000; // CZK
export const LENGTHS = ["short", "bob", "mid", "long"];
export const MATERIALS = ["human", "synthetic"];
export const DELIVERY = [
  {
    id: "packeta",
    price: 69,
    label: { cs: "Zásilkovna – výdejní místo", en: "Packeta pickup point" },
    eta: { cs: "1–2 dny", en: "1–2 days" },
  },
  {
    id: "courier",
    price: 119,
    label: { cs: "Kurýr PPL", en: "PPL courier" },
    eta: { cs: "1–2 dny", en: "1–2 days" },
  },
  {
    id: "pickup",
    price: 0,
    label: { cs: "Osobní odběr v Brně", en: "Pick-up in Brno" },
    eta: { cs: "ihned", en: "same day" },
  },
];
export const PAYMENT = [
  { id: "card", fee: 0, label: { cs: "Platební karta", en: "Card" } },
  {
    id: "transfer",
    fee: 0,
    label: { cs: "Bankovní převod", en: "Bank transfer" },
  },
  { id: "cod", fee: 39, label: { cs: "Dobírka", en: "Cash on delivery" } },
];
export const COUNTRIES = {
  CZ: { cs: "Česko", en: "Czechia" },
  SK: { cs: "Slovensko", en: "Slovakia" },
  DE: { cs: "Německo", en: "Germany" },
  AT: { cs: "Rakousko", en: "Austria" },
};

export const reviewsOf = (id) => reviews.filter((r) => r.productId === id);
export const ratingOf = (id) => {
  const r = reviewsOf(id);
  return r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : 0;
};
export const stars = (r) =>
  "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
export const cartLines = (cart) =>
  Object.entries(cart).map(([id, qty]) => ({
    p: PRODUCTS.find((x) => x.id === +id),
    qty,
  }));
export const subtotalOf = (lines) =>
  lines.reduce((a, l) => a + l.p.price * l.qty, 0);
export const shippingCost = (d, sub) => (sub >= FREE_FROM ? 0 : d.price);
