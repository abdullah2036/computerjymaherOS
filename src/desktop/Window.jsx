import { useCallback, useRef } from 'react';
import { useOS } from '../lib/store.jsx';

/* ============================================================
   A window.

   Dragging and resizing write straight to the element's style and only
   commit to the store on pointer-up. React re-rendering a tree on every
   mousemove is what makes browser "desktops" feel like slideshows; this
   keeps the grab at the pointer.
   ============================================================ */

const MENUBAR = 26;
const DOCK_ZONE = 92;

export default function Window({ win }) {
  const { byId, focused, focus, close, minimize, zoom, dispatch, t } = useOS();
  const app = byId[win.appId];
  const ref = useRef(null);
  const live = useRef(null);

  const isFocused = focused === win.id;

  /* shared pointer loop for both dragging and resizing */
  const grab = useCallback((e, mode) => {
    if (e.button !== 0) return;
    if (win.maximized && mode === 'move') return;
    e.preventDefault();
    focus(win.id);

    const el = ref.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const box = { x: win.x, y: win.y, w: win.w, h: win.h };
    const minW = app.minW || 360;
    const minH = app.minH || 240;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    live.current = { ...box };
    el.classList.add('dragging');

    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let { x, y, w, h } = box;

      if (mode === 'move') {
        x = box.x + dx;
        y = box.y + dy;
        // keep the title bar reachable: never under the menu bar, never
        // dragged so far off-screen that you can't grab it back
        y = Math.max(MENUBAR, Math.min(y, vh - 44));
        x = Math.max(-w + 120, Math.min(x, vw - 120));
      } else {
        if (mode.includes('e')) w = Math.max(minW, box.w + dx);
        if (mode.includes('s')) h = Math.max(minH, box.h + dy);
        if (mode.includes('w')) {
          const nw = Math.max(minW, box.w - dx);
          x = box.x + (box.w - nw);
          w = nw;
        }
        if (mode.includes('n')) {
          const nh = Math.max(minH, box.h - dy);
          y = Math.max(MENUBAR, box.y + (box.h - nh));
          h = box.y + box.h - y;
        }
        w = Math.min(w, vw - 8);
        h = Math.min(h, vh - MENUBAR - 8);
      }

      live.current = { x, y, w, h };
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.classList.remove('dragging');
      const next = live.current;
      if (mode === 'move') dispatch({ type: 'move', id: win.id, x: next.x, y: next.y });
      else dispatch({ type: 'resize', id: win.id, ...next });
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, [win, app, focus, dispatch]);

  const Body = app.Component;

  return (
    <section
      ref={ref}
      className={`win ${isFocused ? 'on' : ''} ${win.minimized ? 'is-min' : ''} ${win.maximized ? 'is-max' : ''}`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onPointerDown={() => focus(win.id)}
      role="dialog"
      aria-label={t(app.key)}
      aria-hidden={win.minimized}
    >
      <header className="win-bar" onPointerDown={(e) => grab(e, 'move')} onDoubleClick={() => zoom(win.id)}>
        <div className="lights" onPointerDown={(e) => e.stopPropagation()}>
          <button className="tl red" onClick={() => close(win.id)} aria-label={t('m_close')}><span>×</span></button>
          <button className="tl amber" onClick={() => minimize(win.id)} aria-label={t('m_minimize')}><span>–</span></button>
          <button className="tl green" onClick={() => zoom(win.id)} aria-label={t('m_zoom')}><span>{win.maximized ? '↙' : '↗'}</span></button>
        </div>
        <h1 className="win-title">{t(app.key)}</h1>
      </header>

      <div className="win-body">
        <Body payload={win.payload} closeSelf={() => close(win.id)} />
      </div>

      {!win.maximized && ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((m) => (
        <span key={m} className={`rs rs-${m}`} onPointerDown={(e) => grab(e, m)} />
      ))}
    </section>
  );
}
