import {
  FinderIcon, ServicesIcon, BrowserIcon, StoreIcon,
  MessagesIcon, ContactIcon, AboutIcon, TerminalIcon, SettingsIcon,
} from './icons.jsx';

import Finder from '../apps/Finder.jsx';
import Services from '../apps/Services.jsx';
import Work from '../apps/Work.jsx';
import Store from '../apps/Store.jsx';
import Reviews from '../apps/Reviews.jsx';
import Contact from '../apps/Contact.jsx';
import About from '../apps/About.jsx';
import Terminal from '../apps/Terminal.jsx';
import Settings from '../apps/Settings.jsx';

/* ============================================================
   The application registry.

   One entry per app, shared by every surface: the dock reads it, Spotlight
   searches it, the phone's home screen lays it out, and the terminal resolves
   `open <name>` against it. `alias` is what you're allowed to type — the
   shell accepts the Arabic name too, because half the site reads in Arabic.
   ============================================================ */

export const APPS = [
  {
    id: 'finder',
    key: 'app_finder',
    Icon: FinderIcon,
    Component: Finder,
    w: 820, h: 520, minW: 560, minH: 360,
    alias: ['finder', 'files', 'home', 'الباحث', 'الملفات'],
    menus: ['m_file', 'm_edit', 'm_view', 'm_window', 'm_help'],
  },
  {
    id: 'services',
    key: 'app_services',
    Icon: ServicesIcon,
    Component: Services,
    w: 860, h: 580, minW: 600, minH: 420,
    alias: ['services', 'service', 'work-with-me', 'الخدمات', 'خدمات'],
    menus: ['m_file', 'm_view', 'm_window', 'm_help'],
  },
  {
    id: 'work',
    key: 'app_work',
    Icon: BrowserIcon,
    Component: Work,
    w: 920, h: 620, minW: 620, minH: 440,
    alias: ['work', 'browser', 'projects', 'portfolio', 'الأعمال', 'المتصفح'],
    menus: ['m_file', 'm_view', 'm_window', 'm_help'],
  },
  {
    id: 'store',
    key: 'app_store',
    Icon: StoreIcon,
    Component: Store,
    w: 800, h: 580, minW: 560, minH: 400,
    alias: ['store', 'shop', 'bench', 'gear', 'المتجر', 'العتاد'],
    menus: ['m_file', 'm_view', 'm_window', 'm_help'],
  },
  {
    id: 'reviews',
    key: 'app_reviews',
    Icon: MessagesIcon,
    Component: Reviews,
    w: 760, h: 560, minW: 520, minH: 400,
    alias: ['reviews', 'messages', 'testimonials', 'الآراء', 'الرسائل'],
    menus: ['m_file', 'm_edit', 'm_window', 'm_help'],
  },
  {
    id: 'contact',
    key: 'app_contact',
    Icon: ContactIcon,
    Component: Contact,
    w: 640, h: 560, minW: 460, minH: 420,
    alias: ['contact', 'mail', 'hire', 'book', 'تواصل', 'احجز'],
    menus: ['m_file', 'm_edit', 'm_window', 'm_help'],
  },
  {
    id: 'about',
    key: 'app_about',
    Icon: AboutIcon,
    Component: About,
    w: 660, h: 500, minW: 460, minH: 380,
    alias: ['about', 'whoami', 'me', 'حول', 'عني'],
    menus: ['m_file', 'm_window', 'm_help'],
  },
  {
    id: 'terminal',
    key: 'app_terminal',
    Icon: TerminalIcon,
    Component: Terminal,
    w: 740, h: 460, minW: 420, minH: 260,
    alias: ['terminal', 'shell', 'console', 'tty', 'الطرفية'],
    menus: ['m_file', 'm_edit', 'm_view', 'm_window', 'm_help'],
  },
  {
    id: 'settings',
    key: 'app_settings',
    Icon: SettingsIcon,
    Component: Settings,
    w: 780, h: 540, minW: 560, minH: 400,
    alias: ['settings', 'preferences', 'prefs', 'config', 'الإعدادات'],
    menus: ['m_file', 'm_view', 'm_window', 'm_help'],
  },
];

/* the dock order, and which four sit in the phone's dock */
export const DOCK = ['finder', 'services', 'work', 'store', 'reviews', 'contact', 'terminal', 'settings'];
export const PHONE_DOCK = ['services', 'work', 'contact', 'terminal'];
export const PHONE_GRID = ['finder', 'store', 'reviews', 'about', 'settings'];

export function resolveApp(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return null;
  return (
    APPS.find((a) => a.id === q) ||
    APPS.find((a) => a.alias.some((x) => x.toLowerCase() === q)) ||
    APPS.find((a) => a.alias.some((x) => x.toLowerCase().startsWith(q))) ||
    null
  );
}
