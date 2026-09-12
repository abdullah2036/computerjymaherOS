import { useEffect, useRef, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { PHONE_DOCK, PHONE_GRID } from '../lib/apps.jsx';
import { Glyph } from '../lib/icons.jsx';

/* ============================================================
   The phone.

   Same apps, same store, different grammar: one thing on screen at a time,
   opened by tapping its icon and dismissed by pushing it back down. On a
   real phone it fills the screen; on a laptop it sits in a device frame so
   you can see the other half of the idea without changing machines.
   ============================================================ */

function StatusBar({ dark = false }) {
  const { lang, t } = useOS();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`ios-status ${dark ? 'dark' : ''}`}>
      <span className="ios-time">{time}</span>
      <span className="ios-island" />
      <span className="ios-meters">
        <Glyph name="signal" size={15} />
        <Glyph name="wifi" size={14} />
        <Glyph name="battery" size={17} />
      </span>
    </div>
  );
}

function AppIcon({ app, onOpen, label = true }) {
  const { t } = useOS();
  const ref = useRef(null);
  return (
    <button
      ref={ref}
      className="ios-icon"
      onClick={() => {
        const r = ref.current.getBoundingClientRect();
        onOpen(app.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <span className="ios-icon-art"><app.Icon /></span>
      {label && <span className="ios-icon-l">{t(app.key)}</span>}
    </button>
  );
}

export default function Phone() {
  const os = useOS();
  const { t, byId, open, windows, closeAll, wallpaperCss, reduceMotion } = os;
  const [active, setActive] = useState(null);   // { app, origin }
  const [closing, setClosing] = useState(false);
  const dragRef = useRef(null);
  const sheetRef = useRef(null);
  const screenRef = useRef(null);

  const grid = PHONE_GRID.map((id) => byId[id]).filter(Boolean);
  const dock = PHONE_DOCK.map((id) => byId[id]).filter(Boolean);

  /* the terminal and Finder can still "open" things — on the phone that means
     swapping which app is on screen, so the store stays the single source of
     truth for navigation */
  useEffect(() => {
    const top = windows[windows.length - 1];
    if (top && top.appId !== active?.app?.id) {
      setActive({ app: byId[top.appId], origin: null, payload: top.payload });
    }
  }, [windows]);

  /* the app grows out of the icon you tapped, so the origin has to be
     measured against the screen rather than the viewport — on a laptop the
     screen sits inside a device frame */
  const launch = (id, point) => {
    const app = byId[id];
    if (!app) return;
    const r = screenRef.current?.getBoundingClientRect();
    const origin = r && point ? { x: point.x - r.left, y: point.y - r.top } : null;
    setClosing(false);
    setActive({ app, origin, payload: null });
    // the phone runs one app at a time, so launching replaces rather than
    // stacks — otherwise leaving an app would drop you into whatever you had
    // open before it instead of the home screen
    closeAll();
    open(id);
  };

  const dismiss = () => {
    if (!active) return;
    setClosing(true);
    window.setTimeout(() => {
      setActive(null);
      setClosing(false);
      closeAll();
    }, reduceMotion ? 0 : 260);
  };

  /* push the app back down to leave it */
  const onHandleDown = (e) => {
    const startY = e.clientY;
    dragRef.current = startY;
    const el = sheetRef.current;
    const move = (ev) => {
      const dy = Math.max(0, ev.clientY - startY);
      if (el) el.style.transform = `translateY(${dy * 0.6}px) scale(${1 - Math.min(dy, 300) / 1600})`;
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (el) el.style.transform = '';
      if (ev.clientY - startY > 60) dismiss();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const Body = active?.app?.Component;
  const originStyle = active?.origin
    ? { '--ox': `${active.origin.x}px`, '--oy': `${active.origin.y}px` }
    : { '--ox': '50%', '--oy': '80%' };

  return (
    <div className="ios-stage">
      <div className="ios-device">
        <div className="ios-screen" ref={screenRef} style={{ backgroundImage: wallpaperCss }}>
          <StatusBar />

          <div className="ios-home">
            <div className="ios-grid">
              {grid.map((app) => <AppIcon key={app.id} app={app} onOpen={launch} />)}
            </div>
            <div className="ios-dots"><i className="on" /><i /></div>
          </div>

          <div className="ios-dock">
            {dock.map((app) => <AppIcon key={app.id} app={app} onOpen={launch} label={false} />)}
          </div>

          <div className="ios-bar" />

          {active && (
            <div
              ref={sheetRef}
              className={`ios-app ${closing ? 'out' : 'in'}`}
              style={originStyle}
            >
              <StatusBar dark />
              <header className="ios-app-h">
                <h2>{t(active.app.key)}</h2>
                <button className="ios-x" onClick={dismiss} aria-label={t('ph_back')}>×</button>
              </header>
              <div className="ios-app-b">
                <Body payload={active.payload} phone closeSelf={dismiss} />
              </div>
              <div className="ios-bar dark" onPointerDown={onHandleDown} onClick={dismiss} title={t('ph_swipe')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
