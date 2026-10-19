import { PRODUCTS, FREE_FROM, DELIVERY, PAYMENT, ratingOf } from './config';
import { RATES } from './i18n';

// ---- Режим 1: настоящий ИИ через ваш сервер (см. server/proxy.mjs) ----
// Задайте VITE_CHAT_API_URL в .env. API-ключ хранится ТОЛЬКО на сервере, во фронтенд его класть нельзя.
// ---- Режим 2 (по умолчанию): встроенный бот на правилах, работает без сервера ----
export async function ask(text, ctx) {
  const url = import.meta.env.VITE_CHAT_API_URL;
  if (url) {
    try {
      const r = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang: ctx.lang, history: ctx.history.slice(-8) }),
      });
      const d = await r.json();
      if (d.reply) return { text: d.reply, ids: d.ids || [] };
    } catch { /* падаем на локального бота */ }
  }
  await new Promise((res) => setTimeout(res, 500 + Math.random() * 600)); // «печатает…»
  return local(text, ctx);
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u00a0/g, ' ');
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const top = (list, cheap) => [...list].sort((a, b) => (cheap ? a.price - b.price : ratingOf(b.id) - ratingOf(a.id))).slice(0, 3).map((p) => p.id);

// семейства цветов и поводы -> id товаров (обновляйте при добавлении товаров)
const COLOR_IDS = { blonde: [1, 4, 8], brown: [2, 6, 8, 9, 11, 12], red: [3], black: [5, 2], grey: [10], pink: [7] };
const OCC_IDS = { office: [1, 8, 6], wedding: [2, 4, 1], party: [7, 3, 4], cosplay: [7, 3, 4], everyday: [5, 3, 8] };
const RX = {
  men: /\b(muz\w*|men|man|him|husband|manzel\w*)\b/, women: /\b(zen\w*|dams\w*|women|woman|wife|mama|mamin\w*)\b/,
  kids: /\b(dite|ditete|deti|dete|detsk\w*|dcer\w*|syn|syna|synem|kid\w*|child\w*|daughter|son|boy|girl|kluk\w*|holc\w*)\b/,
  short: /\b(kratk\w*|short|pixie)\b/, bob: /\b(bob|kare)\b/, mid: /\b(polodlouh\w*|stredn\w*|mid\w*|shoulder\w*)\b/, long: /\b(dlouh\w*|long)\b/,
  human: /\b(prave|prirod\w*|real|human|natural\w*)\b/, synthetic: /\b(termo\w*|synt\w*|fibre|fiber)\b/, cheap: /\b(levn\w*|cheap\w*|budget|affordable)\b/,
  blonde: /blond/, brown: /\b(hned\w*|brown|cokol\w*|chocolate|kastan\w*|chestnut)\b/, red: /\b(zrz\w*|ryz\w*|red|copper|mede\w*)\b/,
  black: /\b(cern\w*|black)\b/, grey: /\b(sed\w*|grey|gray|silver|stribr\w*)\b/, pink: /\b(ruz\w*|pink|rose)\b/,
  office: /\b(kancel\w*|office|prace|work)\b/, wedding: /\b(svat\w*|wedding)\b/, party: /\b(party|parti|oslav\w*|ples|club)\b/,
  cosplay: /\bcosplay\b/, everyday: /\b(denn\w*|everyday|daily)\b/,
  horoscope: /\b(horoskop\w*|horoscope)\b/, surprise: /\b(prekvap\w*|surprise)\b/,
  health: /\b(rakovin\w*|cancer|chemo\w*|onkolog\w*|alopeci\w*|vypadavani|lecb\w*|nemoc\w*|hair loss|treatment|sick|illness)\b/,
  bonus: /\b(bonus\w*|body|points?|centimetr\w*|loyalty|veren\w*|odmen\w*|reward\w*)\b/,
  ship: /\b(dopra\w*|shipping|delivery|postov\w*|zasilkovn\w*|packeta|ppl)\b/, ret: /\b(vrac\w*|return\w*|reklam\w*|refund\w*|garanc\w*)\b/,
  pay: /\b(plat\w*|pay\w*|dobirk\w*|card|karta|kartou)\b/, care: /\b(pece|peci|care|wash|myt\w*|stylov\w*)\b/,
  hello: /^(ahoj|cau|dobry den|hello|hi|hey)\b/,
};
const STARS = [
  ['Dnes vás čeká vlasový zvrat: ideální den na novou barvu.', 'A hair twist awaits you today: a perfect day for a new colour.'],
  ['Venuše je ve vlasech, vlnek se nebojte.', 'Venus is in your hair, so do not fear the waves.'],
  ['Merkur radí: vsaďte na odvážnější délku.', 'Mercury advises: go for a bolder length.'],
  ['Vaše aura má dnes odstín platinové blond.', 'Your aura is platinum blonde today.'],
  ['Hvězdy říkají: ofina je správná volba.', 'The stars say: a fringe is the right choice.'],
];

function local(raw, { lang, money, cur }) {
  const q = norm(raw);
  const r = (cs, en, ids = []) => ({ text: lang === 'cs' ? cs : en, ids });
  const f = (k) => RX[k].test(q);
  const cat = f('kids') ? 'kids' : f('men') && !f('women') ? 'men' : f('women') ? 'women' : '';

  if (f('horoscope')) { const [cs, en] = pick(STARS); return r(`✦ ${cs} Doporučuji:`, `✦ ${en} I suggest:`, [pick(PRODUCTS).id]); }
  if (f('surprise')) { const p = pick(PRODUCTS); return r(`Překvapení! Dnešní tip: ${p.name}.`, `Surprise! Today's pick: ${p.name}.`, [p.id]); }
  if (f('health')) {
    const ids = cat === 'kids' ? top(PRODUCTS.filter((p) => p.category === 'kids')) : top(PRODUCTS.filter((p) => p.cap !== 'wefted'));
    return r('Rozumím, je to citlivé téma. Zdravotní rady vám dát neumím, ty patří lékaři. S výběrem paruky vám ale zdarma poradíme a nabízíme i měkké modely bez švů. Tady jsou tipy:',
      'I understand this is a sensitive topic. I cannot give medical advice, that is for your doctor. We do help you choose a wig for free and offer soft seam-free models. Here are some ideas:', ids);
  }
  if (f('bonus')) return r('Za každých 100 Kč vám naroste 1 cm vlasů. Centimetry můžete při platbě změnit na slevu (1 cm = 10 Kč, nejvýše polovina objednávky). Nový účet začíná s 5 cm. Stav najdete v sekci Můj účet.',
    'Every 100 CZK grows your hair by 1 cm. You can turn centimetres into a discount at checkout (1 cm = 10 CZK, up to half of the order). A new account starts with 5 cm. Check your balance under My account.');
  if (f('ship')) {
    const list = DELIVERY.map((d) => `${lang === 'cs' ? d.label.cs : d.label.en}: ${d.price ? money(d.price) : (lang === 'cs' ? 'zdarma' : 'free')}`).join('; ');
    return r(`Doprava je zdarma nad ${money(FREE_FROM)}. ${list}.`, `Shipping is free over ${money(FREE_FROM)}. ${list}.`);
  }
  if (f('ret')) return r('Vrátit lze do 30 dnů a doma si paruku můžete 3 dny vyzkoušet. Pokud nebudete spokojeni, vrátíme peníze.', 'You can return within 30 days and try the wig at home for 3 days. If you are not happy, we refund you.');
  if (f('pay')) return r(`Platit můžete kartou, bankovním převodem nebo na dobírku (příplatek ${money(PAYMENT[2].fee)}).`, `You can pay by card, bank transfer or cash on delivery (extra ${money(PAYMENT[2].fee)}).`);
  if (f('care')) return r('Pravé vlasy lze stylovat kulmou i žehličkou, termovlákno do 180 °C. Myjte šetrným šamponem a česejte od konečků ke kořínkům.', 'Real hair can be styled with curling and straightening irons, heat-friendly fibre up to 180 °C. Wash with a gentle shampoo and brush from the ends up.');

  // подбор по параметрам
  const bm = q.match(/(\d{1,3}(?: \d{3})+|\d{3,6})\s*(kc|czk|eur|€|usd|\$)?/);
  let max = 0;
  if (bm) {
    const u = bm[2], code = u === 'eur' || u === '€' ? 'EUR' : u === 'usd' || u === '$' ? 'USD' : u ? 'CZK' : cur;
    max = +bm[1].replace(/ /g, '') / RATES[code];
    if (max < 500) max = 0;
  }
  const pickKey = (keys) => keys.find((k) => f(k)) || '';
  const length = pickKey(['short', 'bob', 'mid', 'long']), material = pickKey(['human', 'synthetic']);
  const color = pickKey(Object.keys(COLOR_IDS)), occ = pickKey(Object.keys(OCC_IDS));
  const asked = cat || length || material || color || occ || max || f('cheap');

  if (!asked) {
    if (f('hello')) return r('Ahoj! S čím vám mohu poradit? Zkuste napsat délku, barvu, rozpočet nebo příležitost.', 'Hi! How can I help? Try telling me a length, colour, budget or occasion.');
    return r('S výběrem vám poradím. Napište třeba délku, barvu, rozpočet nebo příležitost (kancelář, svatba, párty), případně pro koho paruku hledáte.',
      'I can help you choose. Tell me a length, colour, budget or occasion (office, wedding, party), or who the wig is for.');
  }
  let list = PRODUCTS.filter((p) => (!cat || p.category === cat) && (!length || p.length === length) && (!material || p.material === material)
    && (!color || COLOR_IDS[color].includes(p.id)) && (!max || p.price <= max));
  if (occ) { const pref = list.filter((p) => OCC_IDS[occ].includes(p.id)); list = pref.length ? pref : OCC_IDS[occ].map((id) => PRODUCTS.find((p) => p.id === id)); }
  const relaxed = !list.length;
  if (relaxed) list = PRODUCTS.filter((p) => !cat || p.category === cat);
  const kids = cat === 'kids' ? [' U dětských modelů máme měkkou bavlněnou podšívku bez švů, rádi vám zdarma poradíme.', ' Our children\'s models have a soft seam-free cotton lining, and we are happy to advise for free.'] : ['', ''];
  return r((relaxed ? 'Přesnou shodu nemám, ale nejblíž jsou tyto paruky:' : 'Podle vašeho zadání doporučuji tyto paruky:') + kids[0],
    (relaxed ? 'I have no exact match, but these are the closest:' : 'Based on what you told me, I suggest these wigs:') + kids[1], top(list, f('cheap')));
}
