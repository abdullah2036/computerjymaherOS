import { useCallback, useEffect, useRef, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { SERVICES, PROJECTS, PRODUCTS, REVIEWS, PROCESS } from '../data/content.js';
import { APPS, resolveApp } from '../lib/apps.jsx';
import { WALLPAPERS } from '../data/os.js';

/* ============================================================
   The shell.

   The fast path through the whole site. Anything the dock, Finder or
   Spotlight can do, one line here does too — `ls` to see the services,
   `open security` to land in the right window, `lang en` to flip the system.
   It runs LTR regardless of the interface language, because a prompt that
   flips direction stops being a prompt.
   ============================================================ */

const SERVICE_ALIAS = {
  s1: ['s1', 'consulting', 'consult', 'advice', 'استشارة', 'الاستشارة'],
  s2: ['s2', 'frontend', 'front', 'ui', 'واجهات', 'الواجهات'],
  s3: ['s3', 'fullstack', 'full-stack', 'backend', 'متكامل', 'تطوير'],
  s4: ['s4', 'security', 'sec', 'pentest', 'أمن', 'تأمين', 'حماية'],
};

function resolveService(q) {
  const s = String(q || '').trim().toLowerCase();
  if (!s) return null;
  const hit = Object.entries(SERVICE_ALIAS).find(([, al]) =>
    al.some((a) => a.toLowerCase() === s || a.toLowerCase().startsWith(s)),
  );
  return hit ? hit[0] : null;
}

const LOGO = [
  '   ______  _____ __  __ ',
  '  / ____/ / /  |/  // / ',
  ' / /     / // /|_/ // /  ',
  '/ /___  / // /  / //_/   ',
  '\\____/_/ //_/  /_/(_)   ',
  '        |_/              ',
];

export default function Terminal({ phone, closeSelf }) {
  const os = useOS();
  const { t, b, lang, open, set, wa } = os;
  const [log, setLog] = useState(() => [{ k: 'text', text: t('tm_welcome') }]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [log]);

  const push = useCallback((...entries) => setLog((l) => [...l, ...entries]), []);
  const say = (text) => ({ k: 'text', text });
  const err = (text) => ({ k: 'err', text });
  const table = (rows, head) => ({ k: 'table', rows, head });

  const COMMANDS = {
    help: () => push(
      say(`${t('tm_cmds')}:`),
      table([
        ['ls', lang === 'ar' ? 'اعرض الخدمات (ls apps / work / store / reviews)' : 'list the services (ls apps / work / store / reviews)'],
        ['open <name>', lang === 'ar' ? 'افتح تطبيقاً أو خدمة' : 'open an app or a service'],
        ['cd <name>', lang === 'ar' ? 'مثل open' : 'same as open'],
        ['about', lang === 'ar' ? 'عن الاستوديو' : 'about the studio'],
        ['process', lang === 'ar' ? 'خطوات العمل الأربع' : 'the four working steps'],
        ['price <name>', lang === 'ar' ? 'سعر خدمة' : 'price of a service'],
        ['contact', lang === 'ar' ? 'افتح واتساب' : 'open WhatsApp'],
        ['lang <ar|en>', lang === 'ar' ? 'غيّر لغة النظام' : 'change the system language'],
        ['wallpaper <id>', lang === 'ar' ? 'غيّر الخلفية' : 'change the wallpaper'],
        ['neofetch', lang === 'ar' ? 'معلومات النظام' : 'system information'],
        ['whoami', lang === 'ar' ? 'من أنت هنا' : 'who you are here'],
        ['date', lang === 'ar' ? 'الوقت الآن' : 'the time right now'],
        ['clear', lang === 'ar' ? 'نظّف الشاشة' : 'clear the screen'],
        ['exit', lang === 'ar' ? 'أغلق الطرفية' : 'close the terminal'],
      ]),
    ),

    ls: (args) => {
      const what = (args[0] || '').toLowerCase();
      if (['app', 'apps', 'applications'].includes(what)) {
        return push(table(APPS.map((a) => [a.id, t(a.key)])));
      }
      if (['work', 'projects', 'portfolio'].includes(what)) {
        return push(table(PROJECTS.map((p) => [p.id, `${p[lang].title} — ${p[lang].cat}`])));
      }
      if (['store', 'shop', 'bench', 'gear'].includes(what)) {
        return push(table(PRODUCTS.map((p) => [p.id, `${p[lang]} — ${lang === 'ar' ? p.price_ar : p.price_en}`])));
      }
      if (['reviews', 'clients'].includes(what)) {
        return push(table(REVIEWS.map((r, i) => [`r${i}`, `${r[lang].n} — ${r[lang].r}`])));
      }
      if (what) return push(err(`ls: ${t('tm_nosuch')}: ${what}`));
      return push(
        table(SERVICES.map((s) => [s.id, `${b(`${s.id}_t`)} — ${b(`${s.id}_p`)} ${b(`${s.id}_u`)}`])),
        say(lang === 'ar'
          ? 'اكتب "open s2" لفتح خدمة، أو "ls apps" لبقية النظام.'
          : 'Type "open s2" to open one, or "ls apps" for the rest of the system.'),
      );
    },

    open: (args) => {
      const q = args.join(' ').trim();
      if (!q) return push(err(`${t('tm_usage')}: open <name>`));

      const sid = resolveService(q);
      if (sid) {
        open('services', { id: sid });
        return push(say(`${t('tm_opening')} ${b(`${sid}_t`)}…`));
      }
      const app = resolveApp(q);
      if (app) {
        open(app.id);
        return push(say(`${t('tm_opening')} ${t(app.key)}…`));
      }
      const proj = PROJECTS.find((p) => p.id === q.toLowerCase() || p.en.title.toLowerCase().includes(q.toLowerCase()));
      if (proj) {
        open('work', { id: proj.id });
        return push(say(`${t('tm_opening')} ${proj[lang].title}…`));
      }
      if (['process', 'steps', 'آلية'].includes(q.toLowerCase())) {
        open('services', { tab: 'process' });
        return push(say(`${t('tm_opening')} ${t('sv_process')}…`));
      }
      return push(err(`open: ${t('tm_nosuch')}: ${q}`), say(t('tm_try')));
    },

    about: () => push(
      say(`${b('wordmark')} ${b('wordmark_alt')} — ${b('tagline')}`),
      say(b('est')),
      say(''),
      say(b('enter_body')),
      say(''),
      say(t('ab_disclaimer')),
    ),

    process: () => push(table(PROCESS.map((p, i) => [`${i + 1}.`, `${b(`${p}_t`)} — ${b(`${p}_d`)}`]))),

    price: (args) => {
      const sid = resolveService(args.join(' '));
      if (!sid) return push(err(`${t('tm_usage')}: price <consulting|frontend|fullstack|security>`));
      return push(say(`${b(`${sid}_t`)}: ${b(`${sid}_p`)} ${b(`${sid}_u`)}`));
    },

    contact: () => { wa(b('contact_body')); return push(say(`${t('tm_opening')} WhatsApp…`)); },

    lang: (args) => {
      const to = (args[0] || '').toLowerCase();
      if (!['ar', 'en'].includes(to)) return push(err(`${t('tm_usage')}: lang <ar|en>`));
      set({ lang: to });
      return push(say(to === 'ar' ? 'اللغة الآن العربية.' : 'Language is now English.'));
    },

    wallpaper: (args) => {
      const id = (args[0] || '').toLowerCase();
      if (!id) return push(table(WALLPAPERS.map((w) => [w.id, lang === 'ar' ? w.ar : w.en])));
      const w = WALLPAPERS.find((x) => x.id === id);
      if (!w) return push(err(`wallpaper: ${t('tm_nosuch')}: ${id}`));
      set({ wallpaper: w.id });
      return push(say(`${lang === 'ar' ? 'الخلفية الآن' : 'Wallpaper is now'} ${lang === 'ar' ? w.ar : w.en}.`));
    },

    neofetch: () => push({
      k: 'fetch',
      rows: [
        ['OS', 'Computerjy Maher OS 4.0 "Workshop"'],
        ['Host', lang === 'ar' ? 'جدة، السعودية' : 'Jeddah, Saudi Arabia'],
        ['Uptime', lang === 'ar' ? '٩+ سنوات' : '9+ years'],
        ['Shell', 'maher-sh'],
        ['Services', String(SERVICES.length)],
        ['Projects', `${PROJECTS.length} ${lang === 'ar' ? 'على الهواء' : 'live'}`],
        ['Rating', `${b('stat2_n')} / 5`],
        ['Locale', lang === 'ar' ? 'ar_SA' : 'en_SA'],
      ],
    }),

    whoami: () => push(say(lang === 'ar'
      ? 'زائر — ومحتمل تكون العميل الجاي.'
      : 'visitor — and possibly the next client.')),

    date: () => push(say(new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-GB'))),
    pwd: () => push(say('/Users/visitor/maher')),
    echo: (args) => push(say(args.join(' '))),
    clear: () => setLog([]),
    exit: () => { push(say(t('tm_bye'))); setTimeout(() => closeSelf?.(), 260); },
    sudo: () => push(err(t('tm_sudo'))),
  };

  const ALIASES = { dir: 'ls', cd: 'open', cat: 'about', man: 'help', '?': 'help', quit: 'exit', services: 'ls', hire: 'contact', book: 'contact' };

  const run = (raw) => {
    const line = raw.trim();
    push({ k: 'cmd', text: raw });
    if (!line) return;
    setHistory((h) => [line, ...h].slice(0, 60));
    setHIdx(-1);

    const [head, ...args] = line.split(/\s+/);
    const name = ALIASES[head.toLowerCase()] || head.toLowerCase();
    const fn = COMMANDS[name];
    if (!fn) return push(err(`${head}: ${t('tm_notfound')}`), say(t('tm_try')));
    fn(args);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') {
      run(value);
      setValue('');
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(hIdx + 1, history.length - 1);
      if (next >= 0) { setHIdx(next); setValue(history[next]); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = hIdx - 1;
      setHIdx(next);
      setValue(next < 0 ? '' : history[next]);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = value.split(/\s+/);
      if (parts.length <= 1) {
        const pool = [...Object.keys(COMMANDS), ...Object.keys(ALIASES)];
        const hit = pool.find((c) => c.startsWith(parts[0]?.toLowerCase() || ''));
        if (hit) setValue(`${hit} `);
      } else {
        const pool = [...APPS.map((a) => a.id), ...SERVICES.map((s) => s.id), 'consulting', 'frontend', 'fullstack', 'security', 'process'];
        const hit = pool.find((c) => c.startsWith(parts[parts.length - 1].toLowerCase()));
        if (hit) setValue([...parts.slice(0, -1), hit].join(' '));
      }
      return;
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setLog([]); }
  };

  return (
    <div className={`tm ${phone ? 'phone' : ''}`} dir="ltr" onClick={() => inputRef.current?.focus()}>
      <div className="tm-log">
        {log.map((e, i) => {
          if (e.k === 'cmd') return <p key={i} className="tm-cmd"><span className="tm-ps">visitor@maher ~ %</span> {e.text}</p>;
          if (e.k === 'err') return <p key={i} className="tm-err">{e.text}</p>;
          if (e.k === 'table') return (
            <div key={i} className="tm-table">
              {e.rows.map(([a, c], j) => (
                <p key={j}><span className="tm-key">{a}</span><span className="tm-val">{c}</span></p>
              ))}
            </div>
          );
          if (e.k === 'fetch') return (
            <div key={i} className="tm-fetch">
              <pre className="tm-logo">{LOGO.join('\n')}</pre>
              <div className="tm-table">
                {e.rows.map(([a, c], j) => (
                  <p key={j}><span className="tm-key">{a}</span><span className="tm-val">{c}</span></p>
                ))}
              </div>
            </div>
          );
          return <p key={i} className="tm-out">{e.text || '\u00A0'}</p>;
        })}
        <div ref={endRef} />
      </div>

      <div className="tm-input">
        <span className="tm-ps">visitor@maher ~ %</span>
        <input
          ref={inputRef}
          value={value}
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
          aria-label="terminal"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
        />
      </div>
    </div>
  );
}
