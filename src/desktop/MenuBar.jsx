import { useEffect, useRef, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { WALLPAPERS } from '../data/os.js';
import { Glyph } from '../lib/icons.jsx';

/* The menu bar. The app name on the left is whatever window has focus, which
   is the one detail that makes a web page stop feeling like a web page. */

function useClock(lang) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(id);
  }, []);
  const loc = lang === 'ar' ? 'ar-SA' : 'en-GB';
  const date = now.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = now.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
  return `${date}  ${time}`;
}

export default function MenuBar({ onSpotlight }) {
  const os = useOS();
  const { t, b, lang, open, set, focused, windows, byId, close, minimize, zoom, closeAll, toggleLang, wallpaper, reduceMotion } = os;
  const [menu, setMenu] = useState(null);
  const barRef = useRef(null);
  const clock = useClock(lang);

  const win = windows.find((w) => w.id === focused && !w.minimized);
  const app = win ? byId[win.appId] : null;

  useEffect(() => {
    if (!menu) return;
    const away = (e) => { if (!barRef.current?.contains(e.target)) setMenu(null); };
    const esc = (e) => e.key === 'Escape' && setMenu(null);
    window.addEventListener('pointerdown', away);
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('pointerdown', away); window.removeEventListener('keydown', esc); };
  }, [menu]);

  const act = (fn) => () => { setMenu(null); fn?.(); };

  const cycleWallpaper = () => {
    const i = WALLPAPERS.findIndex((w) => w.id === wallpaper);
    set({ wallpaper: WALLPAPERS[(i + 1) % WALLPAPERS.length].id });
  };

  const ITEMS = {
    brand: [
      { label: t('m_about'), onClick: () => open('about') },
      { label: t('m_settings'), onClick: () => open('settings'), sep: true },
      { label: t('m_lang'), onClick: toggleLang },
      { label: t('m_whatsapp'), onClick: () => os.wa(b('contact_body')), sep: true },
      { label: t('m_sleep'), onClick: () => set({ asleep: true }) },
      { label: t('m_restart'), onClick: () => set({ booted: false, restarting: true }) },
      { label: t('m_shutdown'), onClick: () => set({ powered: false }) },
    ],
    m_file: [
      { label: t('m_newwin'), onClick: () => app && open(app.id), disabled: !app },
      { label: t('m_close'), hint: '⌘W', onClick: () => win && close(win.id), disabled: !win, sep: true },
      { label: t('m_closeall'), onClick: closeAll, disabled: !windows.length },
    ],
    m_edit: [
      { label: lang === 'ar' ? 'تراجع' : 'Undo', hint: '⌘Z', disabled: true },
      { label: lang === 'ar' ? 'نسخ' : 'Copy', hint: '⌘C', disabled: true },
      { label: lang === 'ar' ? 'لصق' : 'Paste', hint: '⌘V', disabled: true },
    ],
    m_view: [
      { label: t('m_wallpaper'), onClick: cycleWallpaper },
      { label: t('se_reduce'), check: reduceMotion, onClick: () => set({ reduceMotion: !reduceMotion }) },
      { label: t('m_spotlight'), hint: '⌘K', onClick: onSpotlight, sep: true },
    ],
    m_window: [
      { label: t('m_minimize'), hint: '⌘M', onClick: () => win && minimize(win.id), disabled: !win },
      { label: t('m_zoom'), onClick: () => win && zoom(win.id), disabled: !win, sep: true },
      ...windows.map((w) => ({
        label: t(byId[w.appId].key),
        check: w.id === focused,
        onClick: () => os.focus(w.id),
      })),
    ],
    m_help: [
      { label: t('m_terminal'), onClick: () => open('terminal') },
      { label: t('m_about'), onClick: () => open('about'), sep: true },
      { label: t('m_book'), onClick: () => open('contact') },
    ],
  };

  const Dropdown = ({ id }) => (
    <div className="mb-drop" role="menu">
      {ITEMS[id].map((it, i) => (
        <div key={i}>
          {it.sep && i > 0 && <hr />}
          <button role="menuitem" disabled={it.disabled} onClick={act(it.onClick)}>
            <span className="mb-check">{it.check ? <Glyph name="check" size={12} /> : null}</span>
            <span className="mb-label">{it.label}</span>
            {it.hint && <span className="mb-hint">{it.hint}</span>}
          </button>
        </div>
      ))}
    </div>
  );

  const Trigger = ({ id, children, className = '' }) => (
    <div className={`mb-item ${className} ${menu === id ? 'on' : ''}`}>
      <button
        onClick={() => setMenu(menu === id ? null : id)}
        onPointerEnter={() => menu && setMenu(id)}
      >
        {children}
      </button>
      {menu === id && <Dropdown id={id} />}
    </div>
  );

  return (
    <div className="mb" ref={barRef}>
      <Trigger id="brand" className="mb-brand">م</Trigger>
      <span className="mb-app">{app ? t(app.key) : t('app_finder')}</span>
      {(app?.menus || ['m_file', 'm_edit', 'm_view', 'm_window', 'm_help']).map((m) => (
        <Trigger key={m} id={m}>{t(m)}</Trigger>
      ))}

      <div className="mb-right">
        <button className="mb-icon" onClick={onSpotlight} aria-label={t('m_spotlight')}><Glyph name="search" size={14} /></button>
        <span className="mb-icon"><Glyph name="battery" size={17} /></span>
        <span className="mb-icon"><Glyph name="wifi" size={14} /></span>
        <button className="mb-icon" onClick={() => open('settings')} aria-label={t('m_settings')}><Glyph name="control" size={14} /></button>
        <span className="mb-clock">{clock}</span>
      </div>
    </div>
  );
}
