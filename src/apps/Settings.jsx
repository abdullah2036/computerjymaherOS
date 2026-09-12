import { useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { WALLPAPERS } from '../data/os.js';
import { Glyph } from '../lib/icons.jsx';

function Toggle({ on, onChange, id }) {
  return (
    <button id={id} role="switch" aria-checked={on} className={`sw ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export default function Settings({ phone }) {
  const { t, lang, set, wallpaper, reduceMotion, dockSize, magnify, device } = useOS();
  const [pane, setPane] = useState('appearance');

  const panes = phone
    ? [['appearance', 'se_appearance'], ['language', 'se_language'], ['general', 'se_general']]
    : [['appearance', 'se_appearance'], ['language', 'se_language'], ['dock', 'se_dock'], ['general', 'se_general']];

  const body = {
    appearance: (
      <>
        <h3>{t('se_wallpaper')}</h3>
        <div className="se-walls">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              className={`se-wall ${wallpaper === w.id ? 'on' : ''}`}
              style={{ backgroundImage: w.css }}
              onClick={() => set({ wallpaper: w.id })}
              aria-label={lang === 'ar' ? w.ar : w.en}
            >
              {wallpaper === w.id && <span className="se-wall-c"><Glyph name="check" size={14} /></span>}
              <span className="se-wall-n">{lang === 'ar' ? w.ar : w.en}</span>
            </button>
          ))}
        </div>
      </>
    ),
    language: (
      <>
        <h3>{t('se_language')}</h3>
        <div className="se-langs">
          {[['ar', 'العربية', 'Arabic'], ['en', 'English', 'الإنجليزية']].map(([id, native, other]) => (
            <button key={id} className={`se-lang ${lang === id ? 'on' : ''}`} onClick={() => set({ lang: id })}>
              <b>{native}</b>
              <span>{other}</span>
              {lang === id && <Glyph name="check" size={15} />}
            </button>
          ))}
        </div>
        <p className="note">
          {lang === 'ar'
            ? 'تغيير اللغة يقلب اتجاه النظام بالكامل — النوافذ، الشريط، والطرفية.'
            : 'Switching the language flips the whole system’s direction — windows, dock, and terminal.'}
        </p>
      </>
    ),
    dock: (
      <>
        <h3>{t('se_dock')}</h3>
        <div className="se-row">
          <label htmlFor="ds">{t('se_docksize')}</label>
          <div className="se-slider">
            <span>{t('se_small')}</span>
            <input id="ds" type="range" min="42" max="76" value={dockSize} onChange={(e) => set({ dockSize: +e.target.value })} />
            <span>{t('se_large')}</span>
          </div>
        </div>
        <div className="se-row">
          <label htmlFor="mg">{t('se_magnify')}</label>
          <Toggle id="mg" on={magnify} onChange={(v) => set({ magnify: v })} />
        </div>
      </>
    ),
    general: (
      <>
        <h3>{t('se_motion')}</h3>
        <div className="se-row">
          <div>
            <label htmlFor="rm">{t('se_reduce')}</label>
            <p className="se-sub">{t('se_reduce_d')}</p>
          </div>
          <Toggle id="rm" on={reduceMotion} onChange={(v) => set({ reduceMotion: v })} />
        </div>
        <h3>{t('se_device')}</h3>
        <button
          className="btn-quiet wide"
          onClick={() => set({ device: device === 'mac' ? 'phone' : 'mac', booted: false })}
        >
          {device === 'mac' ? t('se_switch_phone') : t('se_switch_mac')}
        </button>
      </>
    ),
  };

  return (
    <div className={`se ${phone ? 'phone' : ''}`}>
      <aside className="se-side">
        {panes.map(([id, key]) => (
          <button key={id} className={`se-nav ${pane === id ? 'on' : ''}`} onClick={() => setPane(id)}>
            {t(key)}
          </button>
        ))}
      </aside>
      <section className="se-main">{body[pane]}</section>
    </div>
  );
}
