import { useMemo, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { SERVICES, PROJECTS, PRODUCTS, REVIEWS } from '../data/content.js';
import { Glyph } from '../lib/icons.jsx';

/* ============================================================
   Finder.

   The brand as a filesystem: every service is a file, every project is a
   file, and opening one hands it to the app that owns it. It's the map of
   the whole site in one window — which is exactly what a homepage is, only
   here you can see the shape of it.
   ============================================================ */

function useTree() {
  const { b, t, lang } = useOS();
  return useMemo(() => {
    const L = (ar, en) => (lang === 'ar' ? ar : en);
    return {
      root: {
        name: t('fn_root'),
        items: [
          { id: 'd-services', kind: 'folder', to: 'services', name: t('app_services'), size: `${SERVICES.length} ${t('fn_items')}` },
          { id: 'd-work', kind: 'folder', to: 'work', name: L('الأعمال', 'Work'), size: `${PROJECTS.length} ${t('fn_items')}` },
          { id: 'd-store', kind: 'folder', to: 'store', name: t('app_store'), size: `${PRODUCTS.length} ${t('fn_items')}` },
          { id: 'd-reviews', kind: 'folder', to: 'reviews', name: L('الآراء', 'Reviews'), size: `${REVIEWS.length} ${t('fn_items')}` },
          { id: 'f-readme', kind: 'doc', name: t('desk_readme'), size: '1 KB', doc: 'readme' },
          { id: 'f-cv', kind: 'doc', name: t('desk_cv'), size: '2 KB', doc: 'profile' },
        ],
      },
      services: {
        name: t('app_services'),
        items: SERVICES.map((s) => ({
          id: s.id, kind: 'service', name: b(`${s.id}_t`), size: b(`${s.id}_p`),
          app: 'services', payload: { id: s.id },
        })),
      },
      work: {
        name: L('الأعمال', 'Work'),
        items: PROJECTS.map((p) => ({
          id: p.id, kind: 'project', name: p[lang].title, size: p[lang].cat,
          app: 'work', payload: { id: p.id },
        })),
      },
      store: {
        name: t('app_store'),
        items: PRODUCTS.map((p) => ({
          id: p.id, kind: 'product', glyph: p.glyph, name: p[lang], size: lang === 'ar' ? p.price_ar : p.price_en,
          app: 'store', payload: { id: p.id },
        })),
      },
      reviews: {
        name: L('الآراء', 'Reviews'),
        items: REVIEWS.map((r, i) => ({
          id: `r${i}`, kind: 'review', name: r[lang].n, size: r[lang].r,
          app: 'reviews', payload: { index: i },
        })),
      },
    };
  }, [lang, b, t]);
}

const DOCS = {
  readme: {
    ar: `كمبيوترجي ماهر — ورشة رقمية
جدة · منذ ٢٠١٦

استوديو تقني على طاولة واحدة: استشارة، بناء واجهات،
أنظمة متكاملة، وتأمين سيبراني.

هذا النظام بالكامل واجهة تجريبية لعلامة وهمية.
لا يوجد خادم، ولا مخزون، ولا دفع. كل زر «احجز»
يفتح محادثة واتساب.

اختصار: افتح الطرفية واكتب ls.`,
    en: `Computerjy Maher — a digital workshop
Jeddah · since 2016

A tech studio that fits on one bench: consulting, frontend
builds, full-stack systems, and security testing.

This whole system is a front-end exercise for a mock brand.
No server, no stock, no checkout. Every "Book" button opens
a WhatsApp chat.

Shortcut: open Terminal and type ls.`,
  },
  profile: {
    ar: `الملف التعريفي

الاسم        كمبيوترجي ماهر
المقر        جدة، السعودية
التأسيس      ٢٠١٦
التخصص       واجهات أمامية · أنظمة متكاملة · أمن
اللغات       العربية · English
العملة       الريال السعودي (﷼)

الأرقام
+٢٤٠   مشروع ومهمة
٤٫٩    متوسط التقييم
٩+     سنوات خبرة

الحالة: متاح لمشاريع جديدة.`,
    en: `Profile

Name         Computerjy Maher
Based        Jeddah, Saudi Arabia
Since        2016
Focus        Frontend · Full-stack · Security
Languages    العربية · English
Currency     Saudi Riyal (SAR)

The numbers
240+   projects & tasks
4.9    average rating
9+     years of experience

Status: open to new projects.`,
  },
};

function ItemGlyph({ item }) {
  if (item.kind === 'folder') return <span className="fi-folder"><Glyph name="folder" size={30} /></span>;
  if (item.kind === 'product') return <span className="fi-emoji">{item.glyph}</span>;
  if (item.kind === 'doc') return <span className="fi-doc"><Glyph name="doc" size={28} /></span>;
  return <span className="fi-file" data-kind={item.kind}>{item.kind === 'service' ? '⌘' : item.kind === 'project' ? '↗' : '“”'}</span>;
}

export default function Finder({ phone }) {
  const { t, lang, open } = useOS();
  const tree = useTree();
  const [stack, setStack] = useState(['root']);
  const [fwd, setFwd] = useState([]);
  const [sel, setSel] = useState(null);
  const [view, setView] = useState('icon');
  const [doc, setDoc] = useState(null);

  const here = stack[stack.length - 1];
  const folder = tree[here];

  const go = (id) => { setStack((s) => [...s, id]); setFwd([]); setSel(null); };
  const back = () => {
    if (stack.length < 2) return;
    setFwd((f) => [here, ...f]);
    setStack((s) => s.slice(0, -1));
    setSel(null);
  };
  const forward = () => {
    if (!fwd.length) return;
    setStack((s) => [...s, fwd[0]]);
    setFwd((f) => f.slice(1));
  };

  const activate = (item) => {
    if (item.kind === 'folder') return go(item.to);
    if (item.kind === 'doc') return setDoc(item.doc);
    if (item.app) open(item.app, item.payload);
  };

  const KINDS = {
    folder: t('fn_folder'), doc: t('fn_doc'), service: t('fn_service'),
    project: t('fn_project'), product: t('fn_product'), review: t('app_reviews'),
  };

  const sidebar = (
    <aside className="fn-side">
      <p className="fn-group">{t('fn_favorites')}</p>
      {['services', 'work', 'store', 'reviews'].map((id) => (
        <button key={id} className={`fn-sb ${here === id ? 'on' : ''}`} onClick={() => go(id)}>
          <Glyph name="folder" size={15} /> {tree[id].name}
        </button>
      ))}
      <p className="fn-group">{t('fn_locations')}</p>
      <button className={`fn-sb ${here === 'root' ? 'on' : ''}`} onClick={() => setStack(['root'])}>
        <Glyph name="grid" size={15} /> {t('fn_root')}
      </button>
      <button className="fn-sb" onClick={() => open('terminal')}>
        <Glyph name="chev" size={15} /> {t('app_terminal')}
      </button>
    </aside>
  );

  return (
    <div className={`fn ${phone ? 'phone' : ''}`}>
      {!phone && sidebar}
      <section className="fn-main">
        <header className="fn-bar">
          <div className="fn-nav">
            <button onClick={back} disabled={stack.length < 2} aria-label="Back"><Glyph name="back" size={15} /></button>
            <button onClick={forward} disabled={!fwd.length} aria-label="Forward"><Glyph name="fwd" size={15} /></button>
          </div>
          <h2 className="fn-title">{folder.name}</h2>
          <div className="fn-views">
            <button className={view === 'icon' ? 'on' : ''} onClick={() => setView('icon')} aria-label="Icons"><Glyph name="grid" size={14} /></button>
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-label="List"><Glyph name="list" size={14} /></button>
          </div>
        </header>

        {view === 'icon' ? (
          <div className="fn-grid">
            {folder.items.map((item) => (
              <button
                key={item.id}
                className={`fi ${sel === item.id ? 'on' : ''}`}
                onClick={() => (phone ? activate(item) : setSel(item.id))}
                onDoubleClick={() => activate(item)}
                onKeyDown={(e) => e.key === 'Enter' && activate(item)}
              >
                <ItemGlyph item={item} />
                <span className="fi-name">{item.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="fn-tablewrap">
          <table className="fn-table">
            <thead>
              <tr><th>{t('fn_name')}</th><th>{t('fn_kind')}</th><th>{t('fn_size')}</th></tr>
            </thead>
            <tbody>
              {folder.items.map((item) => (
                <tr
                  key={item.id}
                  className={sel === item.id ? 'on' : ''}
                  onClick={() => (phone ? activate(item) : setSel(item.id))}
                  onDoubleClick={() => activate(item)}
                >
                  <td><span className="fn-row-n"><ItemGlyph item={item} />{item.name}</span></td>
                  <td>{KINDS[item.kind]}</td>
                  <td>{item.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        <footer className="fn-status">
          {folder.items.length} {t('fn_items')}
          {sel && <> · {folder.items.find((i) => i.id === sel)?.name}</>}
        </footer>

        {doc && (
          <div className="ql" onClick={() => setDoc(null)}>
            <div className="ql-win" onClick={(e) => e.stopPropagation()}>
              <header><button className="tl red" onClick={() => setDoc(null)} aria-label="Close" /><span>{doc === 'readme' ? t('desk_readme') : t('desk_cv')}</span></header>
              <pre>{DOCS[doc][lang]}</pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
