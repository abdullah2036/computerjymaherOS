import { useEffect, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { SERVICES, PROCESS } from '../data/content.js';
import { Glyph } from '../lib/icons.jsx';

/* The services app. Left is the list, right is the one you picked — the
   shape System Settings uses, because a price list is a settings list with
   money in it. On the phone the two halves become two screens. */
export default function Services({ payload, phone }) {
  const { b, t, lang, wa } = useOS();
  const [sel, setSel] = useState(payload?.id || (phone ? null : 's1'));
  const [tab, setTab] = useState(payload?.tab === 'process' ? 'process' : 'list');

  /* the terminal (or Finder) can point an already-open window at something */
  useEffect(() => {
    if (!payload) return;
    if (payload.tab === 'process') setTab('process');
    if (payload.id) { setSel(payload.id); setTab('list'); }
  }, [payload]);

  const service = SERVICES.find((s) => s.id === sel);

  const list = (
    <nav className="sv-list" aria-label={t('sv_all')}>
      <p className="sv-group">{t('sv_all')}</p>
      {SERVICES.map((s) => (
        <button
          key={s.id}
          className={`sv-item ${sel === s.id && tab === 'list' ? 'on' : ''}`}
          onClick={() => { setSel(s.id); setTab('list'); }}
        >
          <span className="sv-dot" data-s={s.id} />
          <span className="sv-item-t">{b(`${s.id}_t`)}</span>
          <span className="sv-item-p">{b(`${s.id}_p`)}</span>
          {phone && <Glyph name="chev" size={13} />}
        </button>
      ))}
      <p className="sv-group">{t('sv_process')}</p>
      <button className={`sv-item ${tab === 'process' ? 'on' : ''}`} onClick={() => setTab('process')}>
        <span className="sv-dot" data-s="pr" />
        <span className="sv-item-t">{t('sv_process')}</span>
        {phone && <Glyph name="chev" size={13} />}
      </button>
    </nav>
  );

  const processPane = (
    <div className="sv-detail">
      <h2 className="sv-h" dangerouslySetInnerHTML={{ __html: b('crt_title') }} />
      <p className="sv-lede">{b('crt_body')}</p>
      <ol className="proc">
        {PROCESS.map((p, i) => (
          <li key={p}>
            <span className="proc-n">{lang === 'ar' ? ['١', '٢', '٣', '٤'][i] : i + 1}</span>
            <div>
              <h3>{b(`${p}_t`)}</h3>
              <p>{b(`${p}_d`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );

  const detailPane = service && (
    <div className="sv-detail">
      {phone && (
        <button className="sv-back" onClick={() => setSel(null)}>
          <Glyph name="back" size={14} /> {t('sv_all')}
        </button>
      )}
      <p className="sv-kicker">{b(`${service.id}_obj`)}</p>
      <h2 className="sv-h">{b(`${service.id}_t`)}</h2>
      <p className="sv-lede">{b(`${service.id}_d`)}</p>
      <div className="sv-price">
        <span className="sv-price-n">{b(`${service.id}_p`)}</span>
        <span className="sv-price-u">{b(`${service.id}_u`)}</span>
      </div>
      <button className="btn-primary" onClick={() => wa(service.msg[lang])}>
        {b('book')} · {b(`${service.id}_t`)}
      </button>
      <ul className="sv-meta">
        <li><span>{t('sv_price')}</span><b>{b(`${service.id}_p`)} {b(`${service.id}_u`)}</b></li>
        <li><span>{t('ab_spec_loc')}</span><b>{t('ab_spec_loc_v')}</b></li>
        <li><span>{t('ab_spec_status')}</span><b>{t('ab_spec_status_v')}</b></li>
      </ul>
    </div>
  );

  if (phone) {
    const showDetail = tab === 'process' || sel;
    return (
      <div className="sv phone">
        {!showDetail && list}
        {tab === 'process' ? (
          <div className="sv-detail-wrap">
            <button className="sv-back" onClick={() => setTab('list')}>
              <Glyph name="back" size={14} /> {t('sv_all')}
            </button>
            {processPane}
          </div>
        ) : (
          sel && detailPane
        )}
      </div>
    );
  }

  return (
    <div className="sv">
      <aside className="sv-side">{list}</aside>
      <section className="sv-main">{tab === 'process' ? processPane : detailPane}</section>
    </div>
  );
}
