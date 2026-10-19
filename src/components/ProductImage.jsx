// import { useState } from 'react';
// import WigArt from './WigArt';

// export default function ProductImage({ p, size = 160 }) {
//   const [failed, setFailed] = useState(!p.image);
//   if (failed) return <WigArt product={p} size={size} />;
//   return <img src={p.image} alt={p.name} loading="lazy" onError={() => setFailed(true)} />;
// }

import { useState } from "react";
import WigArt from "./WigArt";

// Показывает фото из products.json; если файла нет, рисует SVG-заглушку.
// objectPosition прижимает фото к верху рамки: если что-то обрезается, то низ (штатив), а не волосы.
export default function ProductImage({ p, size = 160 }) {
  const [failed, setFailed] = useState(!p.image);
  if (failed) return <WigArt product={p} size={size} />;
  return (
    <img
      src={p.image}
      alt={p.name}
      loading="lazy"
      style={{ objectPosition: p.focus || "center top" }}
      onError={() => setFailed(true)}
    />
  );
}
