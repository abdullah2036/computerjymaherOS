import { useOS } from '../lib/store.jsx';

/* The door. The site asks one question before it decides what it is. */

function MacArt() {
  return (
    <svg viewBox="0 0 120 78" className="ch-art" aria-hidden="true">
      <rect x="14" y="6" width="92" height="58" rx="5" fill="currentColor" opacity=".16" />
      <rect x="17.5" y="9.5" width="85" height="51" rx="3" fill="currentColor" opacity=".30" />
      <rect x="22" y="14" width="46" height="4" rx="2" fill="currentColor" opacity=".55" />
      <rect x="22" y="23" width="66" height="3" rx="1.5" fill="currentColor" opacity=".32" />
      <rect x="22" y="30" width="58" height="3" rx="1.5" fill="currentColor" opacity=".32" />
      <rect x="22" y="44" width="76" height="12" rx="3" fill="currentColor" opacity=".22" />
      <path d="M2 68h116l-5 6H7Z" fill="currentColor" opacity=".38" />
      <rect x="50" y="68" width="20" height="2" rx="1" fill="currentColor" opacity=".6" />
    </svg>
  );
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 120 78" className="ch-art" aria-hidden="true">
      <rect x="44" y="2" width="32" height="74" rx="7" fill="currentColor" opacity=".16" />
      <rect x="46.5" y="4.5" width="27" height="69" rx="5" fill="currentColor" opacity=".30" />
      <rect x="54" y="7" width="12" height="2.6" rx="1.3" fill="currentColor" opacity=".6" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <rect key={`${r}-${c}`} x={50 + c * 7.5} y={16 + r * 9} width="6" height="6" rx="1.8" fill="currentColor" opacity=".48" />
      )))}
      <rect x="49" y="60" width="22" height="9" rx="3" fill="currentColor" opacity=".26" />
      <rect x="54" y="71" width="12" height="1.8" rx=".9" fill="currentColor" opacity=".6" />
    </svg>
  );
}

export default function Chooser({ detected }) {
  const { t, b, lang, set, toggleLang } = useOS();

  const pick = (device) => set({ device, booted: false });

  return (
    <div className="ch">
      <button className="ch-lang" onClick={toggleLang}>{lang === 'ar' ? 'English' : 'العربية'}</button>

      <header className="ch-head">
        <div className="ch-mark" aria-hidden="true">م</div>
        <h1>{b('wordmark')} <span>{b('wordmark_alt')}</span></h1>
        <p className="ch-tag">{b('tagline')} · {b('est')}</p>
      </header>

      <h2 className="ch-q">{t('choose_title')}</h2>
      <p className="ch-body">{t('choose_body')}</p>

      <div className="ch-cards">
        <button className={`ch-card ${detected === 'mac' ? 'sug' : ''}`} onClick={() => pick('mac')}>
          {detected === 'mac' && <span className="ch-badge">{t('choose_detected')}</span>}
          <MacArt />
          <h3>{t('choose_mac')}</h3>
          <p>{t('choose_mac_sub')}</p>
        </button>

        <button className={`ch-card ${detected === 'phone' ? 'sug' : ''}`} onClick={() => pick('phone')}>
          {detected === 'phone' && <span className="ch-badge">{t('choose_detected')}</span>}
          <PhoneArt />
          <h3>{t('choose_phone')}</h3>
          <p>{t('choose_phone_sub')}</p>
        </button>
      </div>

      <p className="ch-hint">{t('choose_hint')}</p>
    </div>
  );
}
