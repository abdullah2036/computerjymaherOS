import { useEffect, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { WALLPAPERS } from '../data/os.js';
import MenuBar from './MenuBar.jsx';
import Dock from './Dock.jsx';
import Window from './Window.jsx';
import Spotlight from './Spotlight.jsx';
import { Glyph } from '../lib/icons.jsx';

export default function Desktop() {
  const os = useOS();
  const { t, open, set, windows, focused, close, minimize, wallpaperCss, asleep, wallpaper, reduceMotion } = os;
  const [spot, setSpot] = useState(false);
  const [ctx, setCtx] = useState(null);

  /* system-wide keys */
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); setSpot((s) => !s); return; }
      if (mod && e.key.toLowerCase() === 'w' && focused) { e.preventDefault(); close(focused); return; }
      if (mod && e.key.toLowerCase() === 'm' && focused) { e.preventDefault(); minimize(focused); return; }
      if (e.key === 'Escape') setCtx(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focused, close, minimize]);

  useEffect(() => {
    const away = () => setCtx(null);
    window.addEventListener('pointerdown', away);
    return () => window.removeEventListener('pointerdown', away);
  }, []);

  const cycleWallpaper = () => {
    const i = WALLPAPERS.findIndex((w) => w.id === wallpaper);
    set({ wallpaper: WALLPAPERS[(i + 1) % WALLPAPERS.length].id });
  };

  const files = [
    { id: 'f1', label: t('app_services'), kind: 'folder', run: () => open('services') },
    { id: 'f2', label: t('app_work'), kind: 'folder', run: () => open('work') },
    { id: 'f3', label: t('desk_readme'), kind: 'doc', run: () => open('about') },
  ];

  return (
    <div
      className="desk"
      style={{ backgroundImage: wallpaperCss }}
      onContextMenu={(e) => {
        if (e.target.closest('.win, .dock, .mb')) return;
        e.preventDefault();
        setCtx({ x: e.clientX, y: e.clientY });
      }}
    >
      <MenuBar onSpotlight={() => setSpot(true)} />

      <div className="desk-files">
        {files.map((f) => (
          <button key={f.id} className="df" onDoubleClick={f.run} onKeyDown={(e) => e.key === 'Enter' && f.run()}>
            <span className={`df-ic ${f.kind}`}><Glyph name={f.kind} size={30} /></span>
            <span className="df-n">{f.label}</span>
          </button>
        ))}
      </div>

      {windows.map((w) => <Window key={w.id} win={w} />)}

      <Dock />

      {spot && <Spotlight onClose={() => setSpot(false)} />}

      {ctx && (
        <div className="ctx" style={{ left: ctx.x, top: ctx.y }} onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => { setCtx(null); cycleWallpaper(); }}>{t('m_wallpaper')}</button>
          <button onClick={() => { setCtx(null); open('settings'); }}>{t('m_settings')}</button>
          <hr />
          <button onClick={() => { setCtx(null); open('terminal'); }}>{t('m_terminal')}</button>
          <button onClick={() => { setCtx(null); setSpot(true); }}>{t('m_spotlight')}</button>
          <hr />
          <button onClick={() => { setCtx(null); set({ reduceMotion: !reduceMotion }); }}>{t('se_reduce')}</button>
        </div>
      )}

      {asleep && (
        <div className="sleep" onClick={() => set({ asleep: false })} role="button" tabIndex={0}>
          <span>{t('m_sleep')}</span>
        </div>
      )}
    </div>
  );
}
