import { useEffect, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { REVIEWS } from '../data/content.js';
import { Glyph } from '../lib/icons.jsx';

/* Reviews as a messages thread. A testimonial card is a quote with a stock
   photo next to it; a message is something a person actually sent you. Same
   words, and the second one is believed. */

const REPLY = {
  ar: ['يسعدني هذا — أي تعديل لاحق أنا موجود.', 'شكراً لك. الكود موثّق لو احتجتوا تطوير لاحقاً.', 'تمام، أرسلت لك التقرير بصيغة PDF كذلك.', 'شكراً — بالتوفيق في الإطلاق.'],
  en: ['Glad to hear it — I’m around for any tweak later.', 'Thank you. The code is documented if you extend it later.', 'Good — I sent the report as a PDF too.', 'Thanks — good luck with the launch.'],
};

const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('');

export default function Reviews({ payload, phone }) {
  const { t, b, lang, wa } = useOS();
  const [sel, setSel] = useState(payload?.index ?? (phone ? null : 0));

  useEffect(() => { if (payload?.index != null) setSel(payload.index); }, [payload]);

  const list = (
    <aside className="ms-side">
      <header className="ms-side-h">
        <h2>{t('ms_title')}</h2>
        <p>{t('ms_sub')}</p>
      </header>
      {REVIEWS.map((r, i) => (
        <button key={i} className={`ms-conv ${sel === i ? 'on' : ''}`} onClick={() => setSel(i)}>
          <span className="ms-av" data-i={i % 4}>{initials(r[lang].n)}</span>
          <span className="ms-conv-b">
            <span className="ms-conv-n">{r[lang].n}</span>
            <span className="ms-conv-p">{r[lang].q}</span>
          </span>
        </button>
      ))}
    </aside>
  );

  const r = sel != null ? REVIEWS[sel] : null;

  const thread = r && (
    <section className="ms-thread">
      <header className="ms-thread-h">
        {phone && <button className="sv-back" onClick={() => setSel(null)}><Glyph name="back" size={14} /> {t('ms_title')}</button>}
        <span className="ms-av lg" data-i={sel % 4}>{initials(r[lang].n)}</span>
        <div>
          <h3>{r[lang].n}</h3>
          <p>{r[lang].r}</p>
        </div>
        <span className="ms-stars">★★★★★</span>
      </header>
      <div className="ms-log">
        <div className="bubble in">{r[lang].q}</div>
        <div className="bubble out">{REPLY[lang][sel % REPLY[lang].length]}</div>
        <p className="ms-read">{lang === 'ar' ? 'تم التسليم' : 'Delivered'}</p>
      </div>
      <footer className="ms-compose">
        <input readOnly placeholder={t('ms_placeholder')} onFocus={(e) => e.target.blur()} />
        <button className="btn-send" onClick={() => wa(b('contact_body'))} aria-label={t('ct_send')}>
          <Glyph name="fwd" size={15} />
        </button>
      </footer>
      <p className="note">{t('ms_send_note')}</p>
    </section>
  );

  if (phone) return <div className="ms phone">{sel == null ? list : thread}</div>;

  return (
    <div className="ms">
      {list}
      {thread}
    </div>
  );
}
