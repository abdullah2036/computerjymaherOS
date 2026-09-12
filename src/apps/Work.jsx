import { useEffect, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { PROJECTS } from '../data/content.js';
import { Glyph } from '../lib/icons.jsx';

/* The work section as a browser, because the work *is* websites. Each project
   is a tab with its real address in the bar; the button in the page is the
   only thing that leaves the system. */
export default function Work({ payload, phone }) {
  const { t, lang } = useOS();
  const [active, setActive] = useState(payload?.id || PROJECTS[0].id);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (payload?.id) setActive(payload.id); }, [payload]);

  const p = PROJECTS.find((x) => x.id === active) || PROJECTS[0];
  const copy = p[lang];

  const goto = (id) => {
    if (id === active) return;
    setActive(id);
    setLoading(true);
    setTimeout(() => setLoading(false), 420);
  };

  return (
    <div className={`br ${phone ? 'phone' : ''}`}>
      <div className="br-tabs">
        {PROJECTS.map((x) => (
          <button key={x.id} className={`br-tab ${x.id === active ? 'on' : ''}`} onClick={() => goto(x.id)}>
            <span className="br-fav" />
            <span className="br-tab-t">{x[lang].title}</span>
          </button>
        ))}
        <span className="br-newtab" title={t('br_tab')}><Glyph name="plus" size={14} /></span>
      </div>

      <div className="br-chrome">
        <div className="br-nav">
          <button disabled aria-label="Back"><Glyph name="back" size={15} /></button>
          <button disabled aria-label="Forward"><Glyph name="fwd" size={15} /></button>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 420); }} aria-label="Reload">
            <Glyph name="reload" size={15} />
          </button>
        </div>
        <div className="br-url">
          <Glyph name="lock" size={12} />
          <span dir="ltr">{p.url.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>

      <div className={`br-view ${loading ? 'loading' : ''}`}>
        <div className="br-bar" />
        <article className="br-page">
          <div className="br-shot">
            <img src={p.img} alt={copy.title} loading="lazy" />
          </div>
          <div className="br-body">
            <p className="br-cat">{copy.cat}</p>
            <h2>{copy.title}</h2>
            <p className="br-desc">{copy.desc}</p>
            <p className="br-stacklab">{t('br_stack')}</p>
            <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
            <a className="btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">
              {t('br_open_real')}
            </a>
            <p className="note">{t('br_note')}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
