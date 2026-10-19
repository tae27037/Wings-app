// Минимальный сервер-посредник между сайтом и Anthropic API. Ключ живёт только здесь, в переменной окружения.
// Запуск: ANTHROPIC_API_KEY=sk-... npm run chat-proxy   (Node 18+)
import http from 'node:http';
import { readFileSync } from 'node:fs';

const PORT = 8787;
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
const ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
if (!KEY) console.warn('ANTHROPIC_API_KEY is not set, requests will fail');

const catalog = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url), 'utf8'))
  .map(({ id, name, category, length, material, color, price }) => ({ id, name, category, length, material, color: color.en, priceCZK: price }));

const system = (lang) => `You are Wiggy, a friendly stylist assistant for the wig shop Maison Wigs. Reply in ${lang === 'cs' ? 'Czech' : 'English'} in 2-4 short sentences.
Recommend only wigs from this catalog: ${JSON.stringify(catalog)}.
Never give medical advice or claim medical benefits; for health questions kindly refer the person to their doctor and mention that the shop offers free help choosing a wig.
If the request is unclear, ask one clarifying question. Never invent prices, discounts or policies.
Finish with a last line "IDS: 1,2" listing up to 3 recommended wig ids, or "IDS:" if none.`;

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST') return res.writeHead(405).end();
  let body = '';
  for await (const c of req) { body += c; if (body.length > 20000) return res.writeHead(413).end(); }
  try {
    const { message, lang = 'cs', history = [] } = JSON.parse(body);
    const msgs = [];
    for (const m of history.slice(-8)) {
      const role = m.from === 'me' ? 'user' : 'assistant';
      if (!msgs.length && role === 'assistant') continue;
      if (msgs.at(-1)?.role === role) msgs.at(-1).content += '\n' + m.text; else msgs.push({ role, content: String(m.text) });
    }
    if (msgs.at(-1)?.role === 'user') msgs.at(-1).content += '\n' + message; else msgs.push({ role: 'user', content: String(message).slice(0, 1000) });
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: system(lang), messages: msgs }),
    });
    const d = await r.json();
    const text = d.content?.[0]?.text ?? '';
    const m = text.match(/IDS:\s*([\d,\s]*)\s*$/);
    const ids = m ? m[1].split(',').map(Number).filter(Boolean).slice(0, 3) : [];
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ reply: text.replace(/IDS:[^\n]*$/, '').trim(), ids }));
  } catch { res.writeHead(500).end('{}'); }
}).listen(PORT, () => console.log('Chat proxy on http://localhost:' + PORT));
