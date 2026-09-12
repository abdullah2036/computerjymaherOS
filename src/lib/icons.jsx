/* ============================================================
   Icons, drawn here rather than downloaded.

   Every glyph is original geometry on the platform's squircle. They read as
   "an operating system" at dock size without lifting anyone's artwork, and
   because they're SVG they stay crisp at 128px in Launchpad and 22px in a
   title bar.
   ============================================================ */

const R = 14.5; // corner radius on a 64 grid — close to Apple's superellipse

function Tile({ id, stops, children, stroke = true }) {
  return (
    <svg viewBox="0 0 64 64" className="icn" aria-hidden="true">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          {stops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`s-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx={R} fill={`url(#g-${id})`} />
      <rect x="1" y="1" width="62" height="31" rx={R} fill={`url(#s-${id})`} />
      {children}
      {stroke && (
        <rect x="1.5" y="1.5" width="61" height="61" rx={R - 0.5} fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="1" />
      )}
    </svg>
  );
}

export function FinderIcon() {
  return (
    <Tile id="fn" stops={[['0', '#39b9ff'], ['1', '#1273e6']]}>
      <path d="M32 3v58" stroke="rgba(255,255,255,.30)" strokeWidth="1.2" />
      <path d="M1 32h30V3H15.5A14.5 14.5 0 0 0 1 17.5Z" fill="#0f63c9" opacity=".55" />
      <path d="M1 62V32h30v30H15.5A14.5 14.5 0 0 1 1 47.5Z" fill="#0b52aa" opacity=".45" />
      <ellipse cx="22" cy="27" rx="3.1" ry="5" fill="#fff" />
      <ellipse cx="42" cy="27" rx="3.1" ry="5" fill="#fff" />
      <ellipse cx="22" cy="29" rx="1.5" ry="2.2" fill="#123" />
      <ellipse cx="42" cy="29" rx="1.5" ry="2.2" fill="#123" />
      <path d="M18 42q14 9 28 0" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </Tile>
  );
}

export function ServicesIcon() {
  return (
    <Tile id="sv" stops={[['0', '#ffc24b'], ['1', '#f4801f']]}>
      <path
        d="M41.5 18.5a8.8 8.8 0 0 0-11.8 10.6L17.4 41.4a3.6 3.6 0 0 0 5.1 5.1l12.3-12.3a8.8 8.8 0 0 0 10.6-11.8l-5.1 5.1-4.6-1.2-1.2-4.6Z"
        fill="#fff"
      />
      <circle cx="20" cy="44" r="1.5" fill="#f4801f" />
    </Tile>
  );
}

export function BrowserIcon() {
  return (
    <Tile id="br" stops={[['0', '#2ec5ff'], ['1', '#0a6ee0']]}>
      <circle cx="32" cy="32" r="22" fill="#f7fbff" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="rgba(0,0,0,.12)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={32 + Math.cos(a) * 19}
            y1={32 + Math.sin(a) * 19}
            x2={32 + Math.cos(a) * 16.5}
            y2={32 + Math.sin(a) * 16.5}
            stroke="#9fb2c6"
            strokeWidth="1.1"
          />
        );
      })}
      <path d="M44 20 28.5 28.5 20 44l15.5-8.5Z" fill="#ff3b4e" />
      <path d="M20 44 35.5 35.5 44 20l-15.5 8.5Z" fill="#e7ecf2" />
      <circle cx="32" cy="32" r="1.6" fill="#5a6a7d" />
    </Tile>
  );
}

export function StoreIcon() {
  return (
    <Tile id="st" stops={[['0', '#4aa6ff'], ['1', '#1657d6']]}>
      <path d="M18 25h28l-2.6 23a4 4 0 0 1-4 3.5H24.6a4 4 0 0 1-4-3.5Z" fill="#fff" />
      <path d="M25 27v-4a7 7 0 0 1 14 0v4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 35h8M32 31v8" stroke="#1657d6" strokeWidth="2.6" strokeLinecap="round" />
    </Tile>
  );
}

export function MessagesIcon() {
  return (
    <Tile id="ms" stops={[['0', '#6ff07a'], ['1', '#12b333']]}>
      <path
        d="M32 15c-10.5 0-19 6.9-19 15.4 0 4.9 2.8 9.2 7.2 12-.6 2.6-2.1 5-4.3 6.8 3.7-.3 7.2-1.6 10-3.6 1.9.5 3.9.7 6.1.7 10.5 0 19-6.9 19-15.9S42.5 15 32 15Z"
        fill="#fff"
      />
    </Tile>
  );
}

export function ContactIcon() {
  return (
    <Tile id="ct" stops={[['0', '#4fc3ff'], ['1', '#0b74d8']]}>
      <rect x="12" y="20" width="40" height="26" rx="4.5" fill="#fff" />
      <path d="M12.5 23 32 36.5 51.5 23" fill="none" stroke="#0b74d8" strokeWidth="2.6" strokeLinejoin="round" />
    </Tile>
  );
}

export function AboutIcon() {
  return (
    <Tile id="ab" stops={[['0', '#6c7480'], ['1', '#2a2e36']]}>
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        fill="#fff"
        fontFamily="'IBM Plex Sans Arabic', system-ui, sans-serif"
      >
        م
      </text>
    </Tile>
  );
}

export function TerminalIcon() {
  return (
    <Tile id="tm" stops={[['0', '#3a3f46'], ['1', '#14171b']]}>
      <rect x="1" y="1" width="62" height="13" rx={R} fill="#d9dde2" />
      <rect x="1" y="8" width="62" height="6" fill="#d9dde2" />
      <circle cx="9" cy="7.5" r="2" fill="#ff5f57" />
      <circle cx="16" cy="7.5" r="2" fill="#febc2e" />
      <circle cx="23" cy="7.5" r="2" fill="#28c840" />
      <path d="M14 24 24 33l-10 9" fill="none" stroke="#eaeef2" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 44h20" stroke="#eaeef2" strokeWidth="3.4" strokeLinecap="round" />
    </Tile>
  );
}

export function SettingsIcon() {
  const teeth = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return (
      <rect
        key={i}
        x="29.4"
        y="6"
        width="5.2"
        height="11"
        rx="2"
        fill="#e9edf2"
        transform={`rotate(${(a * 180) / Math.PI} 32 32)`}
      />
    );
  });
  return (
    <Tile id="se" stops={[['0', '#9aa2ad'], ['1', '#4c525b']]}>
      {teeth}
      <circle cx="32" cy="32" r="18" fill="#e9edf2" />
      <circle cx="32" cy="32" r="7.5" fill="#5a616b" />
    </Tile>
  );
}

export function TrashIcon({ full = false }) {
  return (
    <svg viewBox="0 0 64 64" className="icn" aria-hidden="true">
      <defs>
        <linearGradient id="g-tr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfd6de" stopOpacity=".85" />
          <stop offset="0.5" stopColor="#eef2f6" stopOpacity=".6" />
          <stop offset="1" stopColor="#aeb7c2" stopOpacity=".85" />
        </linearGradient>
      </defs>
      <path d="M20 20h24l-2.6 32a4 4 0 0 1-4 3.7H26.6a4 4 0 0 1-4-3.7Z" fill="url(#g-tr)" stroke="rgba(255,255,255,.5)" />
      <rect x="16" y="14" width="32" height="5.5" rx="2.6" fill="#e3e9ef" opacity=".9" />
      <rect x="27" y="10" width="10" height="4" rx="2" fill="#cdd5de" />
      <path d="M28 28v22M36 28v22" stroke="rgba(90,100,115,.5)" strokeWidth="1.6" strokeLinecap="round" />
      {full && <path d="M22 22h20l-1 6H23Z" fill="#8d97a4" opacity=".5" />}
    </svg>
  );
}

/* small monochrome glyphs used in menus, the status bar and sidebars */
export function Glyph({ name, size = 15 }) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.35,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'search':
      return <svg {...p}><circle cx="7" cy="7" r="4.6" /><path d="m10.4 10.4 3.1 3.1" /></svg>;
    case 'wifi':
      return <svg {...p}><path d="M1.6 5.8a10 10 0 0 1 12.8 0M4.2 8.6a6.2 6.2 0 0 1 7.6 0M6.7 11.4a2.4 2.4 0 0 1 2.6 0" /><circle cx="8" cy="13.4" r=".7" fill="currentColor" /></svg>;
    case 'battery':
      return (
        <svg {...p}>
          <rect x="1" y="5" width="11.5" height="6.5" rx="2" />
          <rect x="2.4" y="6.4" width="7.6" height="3.7" rx="1" fill="currentColor" stroke="none" />
          <path d="M14 7.6v1.8" strokeWidth="1.8" />
        </svg>
      );
    case 'control':
      return <svg {...p}><path d="M2 4.5h12M2 11.5h12" /><circle cx="10.5" cy="4.5" r="1.7" fill="currentColor" /><circle cx="5.5" cy="11.5" r="1.7" fill="currentColor" /></svg>;
    case 'folder':
      return <svg {...p}><path d="M1.6 12.5V4.2a1 1 0 0 1 1-1h3.2l1.4 1.7h5.2a1 1 0 0 1 1 1v6.6a1 1 0 0 1-1 1H2.6a1 1 0 0 1-1-1Z" /></svg>;
    case 'doc':
      return <svg {...p}><path d="M3.4 1.8h5.2L12.6 6v8.2a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1V2.8a1 1 0 0 1 1-1Z" /><path d="M8.4 1.9V6h4.1" /></svg>;
    case 'chev':
      return <svg {...p}><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>;
    case 'lock':
      return <svg {...p}><rect x="3.2" y="7" width="9.6" height="7" rx="1.6" /><path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7" /></svg>;
    case 'plus':
      return <svg {...p}><path d="M8 3v10M3 8h10" /></svg>;
    case 'reload':
      return <svg {...p}><path d="M13.4 8a5.4 5.4 0 1 1-1.7-3.9" /><path d="M13.6 2.4v3.4h-3.4" /></svg>;
    case 'back':
      return <svg {...p}><path d="M10 3.5 5.5 8l4.5 4.5" /></svg>;
    case 'fwd':
      return <svg {...p}><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>;
    case 'grid':
      return <svg {...p}><rect x="2" y="2" width="5" height="5" rx="1.4" /><rect x="9" y="2" width="5" height="5" rx="1.4" /><rect x="2" y="9" width="5" height="5" rx="1.4" /><rect x="9" y="9" width="5" height="5" rx="1.4" /></svg>;
    case 'list':
      return <svg {...p}><path d="M2 4h12M2 8h12M2 12h12" /></svg>;
    case 'check':
      return <svg {...p}><path d="m3 8.4 3.3 3.3L13 4.6" strokeWidth="1.8" /></svg>;
    case 'signal':
      return (
        <svg {...p} strokeWidth="0">
          <rect x="1" y="9.6" width="2.4" height="3.4" rx=".8" fill="currentColor" />
          <rect x="4.6" y="7.4" width="2.4" height="5.6" rx=".8" fill="currentColor" />
          <rect x="8.2" y="5.2" width="2.4" height="7.8" rx=".8" fill="currentColor" />
          <rect x="11.8" y="3" width="2.4" height="10" rx=".8" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
