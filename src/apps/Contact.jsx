import { useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { WHATSAPP } from '../data/content.js';

/* A compose window. It looks like mail, it sends on WhatsApp — the form is
   there so the visitor arrives in the chat having already said what they
   need, instead of staring at an empty message box. */
export default function Contact({ phone }) {
  const { t, b, lang, wa } = useOS();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const send = () => {
    const s = subject.trim();
    const m = body.trim();
    const fallback = b('contact_body');
    const text = s && m ? `${s}\n\n${m}` : s || m || fallback;
    wa(text);
  };

  return (
    <div className={`ct ${phone ? 'phone' : ''}`}>
      <header className="ct-head">
        <h2>{t('ct_title')}</h2>
        <p>{b('contact_body')}</p>
      </header>

      <div className="ct-field">
        <label>{t('ct_to')}</label>
        <div className="ct-to"><span className="ct-token" dir="ltr">+{WHATSAPP}</span></div>
      </div>

      <div className="ct-field">
        <label htmlFor="ct-s">{t('ct_subject')}</label>
        <input id="ct-s" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t('ct_subject_ph')} />
      </div>

      <div className="ct-field grow">
        <label htmlFor="ct-b">{t('ct_body')}</label>
        <textarea id="ct-b" value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('ct_body_ph')} />
      </div>

      <div className="ct-foot">
        <button className="btn-primary" onClick={send}>{t('ct_send')}</button>
        <p className="note">{t('ct_note')}</p>
      </div>

      <ul className="ct-stats">
        <li><b>{b('stat1_n')}</b><span>{b('stat1_l')}</span></li>
        <li><b>{b('stat2_n')}</b><span>{b('stat2_l')}</span></li>
        <li><b>{b('stat3_n')}</b><span>{b('stat3_l')}</span></li>
      </ul>
    </div>
  );
}
