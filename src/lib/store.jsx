import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { i18n, waLink } from '../data/content.js';
import { os as osStrings, WALLPAPERS } from '../data/os.js';

/* ============================================================
   The kernel.

   One store holds everything the system knows: who is looking (device,
   language), how it looks (wallpaper, motion, dock), and what is open (the
   window list). Every surface — desktop, phone, terminal — drives the system
   through these same actions, which is why `open('services')` behaves
   identically whether it came from the dock, from Spotlight, or from typing
   `open services` in the shell.
   ============================================================ */

const KEY = 'cjm-os';

const DEFAULTS = {
  device: null,          // 'mac' | 'phone' — null means the door hasn't been answered
  booted: false,
  powered: true,
  lang: 'ar',
  wallpaper: 'sonoma',
  reduceMotion: false,
  dockSize: 56,
  magnify: true,
};

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    // `device` and `booted` are deliberately not restored: the door is the
    // point of the site, so every visit gets asked again.
    const { device, booted, powered, ...rest } = saved;
    return { ...DEFAULTS, ...rest };
  } catch {
    return { ...DEFAULTS };
  }
}

/* A window opens where the last one didn't. Classic cascade, wrapped so a
   long session never marches a window off the screen. */
const CASCADE = 26;

function place(state, app) {
  const n = state.windows.length;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const w = Math.min(app.w, Math.max(420, vw - 80));
  const h = Math.min(app.h, Math.max(320, vh - 140));
  const step = (n % 6) * CASCADE;
  const x = Math.round((vw - w) / 2 + step - 60);
  const y = Math.round(Math.max(40, (vh - h) / 2 - 30) + step - 40);
  return {
    x: Math.max(12, Math.min(x, vw - w - 12)),
    y: Math.max(32, Math.min(y, vh - 120)),
    w,
    h,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.patch };

    case 'open': {
      const { app, payload } = action;
      const existing = state.windows.find((wn) => wn.appId === app.id);
      const z = state.z + 1;
      if (existing) {
        return {
          ...state,
          z,
          focused: existing.id,
          windows: state.windows.map((wn) =>
            wn.id === existing.id
              ? { ...wn, z, minimized: false, payload: payload ?? wn.payload }
              : wn,
          ),
        };
      }
      const id = `${app.id}-${Date.now().toString(36)}`;
      const box = place(state, app);
      return {
        ...state,
        z,
        focused: id,
        windows: [...state.windows, { id, appId: app.id, ...box, z, minimized: false, maximized: false, restore: null, payload }],
      };
    }

    case 'close': {
      const windows = state.windows.filter((wn) => wn.id !== action.id);
      const top = windows.filter((wn) => !wn.minimized).sort((a, b) => b.z - a.z)[0];
      return { ...state, windows, focused: top ? top.id : null };
    }

    case 'focus': {
      if (state.focused === action.id) return state;
      const z = state.z + 1;
      return {
        ...state,
        z,
        focused: action.id,
        windows: state.windows.map((wn) => (wn.id === action.id ? { ...wn, z, minimized: false } : wn)),
      };
    }

    case 'minimize': {
      const windows = state.windows.map((wn) => (wn.id === action.id ? { ...wn, minimized: true } : wn));
      const top = windows.filter((wn) => !wn.minimized).sort((a, b) => b.z - a.z)[0];
      return { ...state, windows, focused: top ? top.id : null };
    }

    case 'zoom': {
      const pad = 12;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        ...state,
        windows: state.windows.map((wn) => {
          if (wn.id !== action.id) return wn;
          if (wn.maximized) {
            return { ...wn, maximized: false, ...(wn.restore || {}), restore: null };
          }
          return {
            ...wn,
            maximized: true,
            restore: { x: wn.x, y: wn.y, w: wn.w, h: wn.h },
            x: pad,
            y: 32,
            w: vw - pad * 2,
            h: vh - 32 - 96,
          };
        }),
      };
    }

    case 'move':
      return {
        ...state,
        windows: state.windows.map((wn) => (wn.id === action.id ? { ...wn, x: action.x, y: action.y } : wn)),
      };

    case 'resize':
      return {
        ...state,
        windows: state.windows.map((wn) =>
          wn.id === action.id ? { ...wn, x: action.x ?? wn.x, y: action.y ?? wn.y, w: action.w, h: action.h } : wn,
        ),
      };

    case 'closeAll':
      return { ...state, windows: [], focused: null };

    case 'setPayload':
      return {
        ...state,
        windows: state.windows.map((wn) => (wn.id === action.id ? { ...wn, payload: action.payload } : wn)),
      };

    default:
      return state;
  }
}

const Ctx = createContext(null);

export function OSProvider({ children, apps }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    ...loadPrefs(),
    windows: [],
    focused: null,
    z: 10,
  }));

  /* persist only the preferences, never the session */
  useEffect(() => {
    const { lang, wallpaper, reduceMotion, dockSize, magnify } = state;
    try {
      localStorage.setItem(KEY, JSON.stringify({ lang, wallpaper, reduceMotion, dockSize, magnify }));
    } catch { /* private mode — the system just forgets, which is fine */ }
  }, [state.lang, state.wallpaper, state.reduceMotion, state.dockSize, state.magnify]);

  /* the document follows the reading direction */
  useEffect(() => {
    const dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.lang;
    document.documentElement.dir = dir;
    document.documentElement.dataset.lang = state.lang;
  }, [state.lang]);

  useEffect(() => {
    document.documentElement.dataset.motion = state.reduceMotion ? 'reduced' : 'full';
  }, [state.reduceMotion]);

  /* honour the OS-level preference on first paint */
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      dispatch({ type: 'set', patch: { reduceMotion: true } });
    }
  }, []);

  const byId = useMemo(() => Object.fromEntries(apps.map((a) => [a.id, a])), [apps]);

  const open = useCallback((appId, payload) => {
    const app = byId[appId];
    if (!app) return false;
    dispatch({ type: 'open', app, payload });
    return true;
  }, [byId]);

  const t = useCallback((key) => osStrings[state.lang][key] ?? key, [state.lang]);
  const b = useCallback((key) => i18n[state.lang][key] ?? key, [state.lang]);

  const value = useMemo(() => ({
    ...state,
    apps,
    byId,
    dispatch,
    open,
    t,
    b,
    lang: state.lang,
    dir: state.lang === 'ar' ? 'rtl' : 'ltr',
    wallpaperCss: (WALLPAPERS.find((w) => w.id === state.wallpaper) || WALLPAPERS[0]).css,
    set: (patch) => dispatch({ type: 'set', patch }),
    close: (id) => dispatch({ type: 'close', id }),
    focus: (id) => dispatch({ type: 'focus', id }),
    minimize: (id) => dispatch({ type: 'minimize', id }),
    zoom: (id) => dispatch({ type: 'zoom', id }),
    closeAll: () => dispatch({ type: 'closeAll' }),
    toggleLang: () => dispatch({ type: 'set', patch: { lang: state.lang === 'ar' ? 'en' : 'ar' } }),
    wa: (msg) => window.open(waLink(msg), '_blank', 'noopener'),
  }), [state, apps, byId, open, t, b]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOS() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOS must be used inside <OSProvider>');
  return ctx;
}
