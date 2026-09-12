import { useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { PRODUCTS } from '../data/content.js';

/* The bench, as a small storefront. Nothing is really in stock — "order"
   composes a WhatsApp message naming the part, which is how the real shop
   would take the order anyway. */
export default function Store({ payload, phone }) {
  const { t, b, lang, wa } = useOS();
  const [sel, setSel] = useState(payload?.id || null);

  const order = (p) => {
    const name = p[lang];
    const price = lang === 'ar' ? p.price_ar : p.price_en;
    wa(lang === 'ar' ? `أرغب في طلب: ${name} — ${price}` : `I'd like to order: ${name} — ${price}`);
  };

  return (
    <div className={`st ${phone ? 'phone' : ''}`}>
      <header className="st-head">
        <h2 dangerouslySetInnerHTML={{ __html: b('bench_title') }} />
        <p>{b('bench_body')}</p>
      </header>
      <div className="st-grid">
        {PRODUCTS.map((p) => (
          <article
            key={p.id}
            className={`st-card ${sel === p.id ? 'on' : ''}`}
            onMouseEnter={() => setSel(p.id)}
            onFocus={() => setSel(p.id)}
          >
            <div className="st-thumb"><span>{p.glyph}</span></div>
            <h3>{p[lang]}</h3>
            <p className="st-price">{lang === 'ar' ? p.price_ar : p.price_en}</p>
            <button className="btn-quiet" onClick={() => order(p)}>{t('st_add')}</button>
          </article>
        ))}
      </div>
      <p className="note st-note">{t('st_note')}</p>
    </div>
  );
}
