import { useEffect, useMemo, useRef, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { SERVICES, PROJECTS } from '../data/content.js';
import { Glyph } from '../lib/icons.jsx';

/* Search across the whole system, not just app names — a service, a project,
   or an action like "open WhatsApp". ⌘K / Ctrl-K anywhere. */
export default function Spotlight({ onClose }) {
  const { t, b, lang, apps, open, wa, toggleLang } = useOS();
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const hit = (s) => !needle || String(s).toLowerCase().includes(needle);

    const appRows = apps
      .filter((a) => hit(t(a.key)) || a.alias.some((x) => hit(x)))
      .map((a) => ({ id: `a-${a.id}`, group: t('spot_apps'), label: t(a.key), Icon: a.Icon, run: () => open(a.id) }));

    const svcRows = SERVICES
      .filter((s) => hit(b(`${s.id}_t`)) || hit(s.id) || hit(s.obj))
      .map((s) => ({
        id: `s-${s.id}`, group: t('spot_services'), label: b(`${s.id}_t`), meta: b(`${s.id}_p`),
        run: () => open('services', { id: s.id }),
      }));

    const projRows = PROJECTS
      .filter((p) => hit(p[lang].title) || hit(p.id))
      .map((p) => ({
        id: `p-${p.id}`, group: t('fn_project'), label: p[lang].title, meta: p[lang].cat,
        run: () => open('work', { id: p.id }),
      }));

    const actions = [
      { id: 'x-wa', group: t('spot_actions'), label: t('m_whatsapp'), run: () => wa(b('contact_body')) },
      { id: 'x-lang', group: t('spot_actions'), label: t('m_lang'), run: toggleLang },
      { id: 'x-proc', group: t('spot_actions'), label: t('sv_process'), run: () => open('services', { tab: 'process' }) },
    ].filter((a) => hit(a.label));

    return [...appRows, ...svcRows, ...projRows, ...actions].slice(0, 9);
  }, [q, apps, lang, t, b, open, wa, toggleLang]);

  useEffect(() => { setI(0); }, [q]);

  const fire = (r) => { r?.run(); onClose(); };

  const onKey = (e) => {
    if (e.key === 'Escape') return onClose();
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(n + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(n - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); fire(results[i]); }
  };

  let lastGroup = null;

  return (
    <div className="sp-scrim" onPointerDown={onClose}>
      <div className="sp" onPointerDown={(e) => e.stopPropagation()}>
        <div className="sp-field">
          <Glyph name="search" size={20} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder={t('spot_placeholder')}
            aria-label={t('spot_placeholder')}
          />
        </div>
        {results.length > 0 ? (
          <ul className="sp-list">
            {results.map((r, n) => {
              const head = r.group !== lastGroup ? r.group : null;
              lastGroup = r.group;
              return (
                <li key={r.id}>
                  {head && <p className="sp-group">{head}</p>}
                  <button
                    className={n === i ? 'on' : ''}
                    onPointerEnter={() => setI(n)}
                    onClick={() => fire(r)}
                  >
                    <span className="sp-ic">{r.Icon ? <r.Icon /> : <Glyph name="chev" size={14} />}</span>
                    <span className="sp-lb">{r.label}</span>
                    {r.meta && <span className="sp-meta">{r.meta}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="sp-none">{t('spot_none')}</p>
        )}
      </div>
    </div>
  );
}
