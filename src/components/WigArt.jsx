// Иллюстрация парика на SVG — заменяется фото товара, когда оно появится
const SHAPES = {
  'short': 'M24 80 C20 40 46 16 80 16 C114 16 140 40 136 80 L124 74 C120 50 102 40 80 40 C58 40 40 50 36 74 Z',
  'bob': 'M20 96 C14 46 40 14 80 14 C120 14 146 46 140 96 L128 92 C126 60 106 44 80 44 C54 44 34 60 32 92 Z',
  'mid': 'M16 130 C8 56 36 14 80 14 C124 14 152 56 144 130 L130 126 C130 70 112 46 80 46 C48 46 30 70 30 126 Z',
  'long': 'M12 176 C4 70 34 14 80 14 C126 14 156 70 148 176 L132 170 C134 80 114 46 80 46 C46 46 26 80 28 170 Z',
};
export default function WigArt({ product, size = 160 }) {
  const id = 'g' + product.id;
  return (
    <svg viewBox="0 0 160 190" width={size} height={size * 1.19} role="img" aria-label={`${product.name}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={product.hex} />
          <stop offset="1" stopColor={product.dark} />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="84" rx="40" ry="48" fill="#2f2b36" opacity=".55" />
      <path d={SHAPES[product.length]} fill={`url(#${id})`} />
      <path d="M80 14 C70 40 62 60 52 90 M80 14 C92 40 100 60 110 90" stroke="#fff" strokeOpacity=".18" fill="none" />
    </svg>
  );
}
