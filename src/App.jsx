import { useEffect, useMemo } from 'react';
import { OSProvider, useOS } from './lib/store.jsx';
import { APPS } from './lib/apps.jsx';
import Chooser from './boot/Chooser.jsx';
import Boot from './boot/Boot.jsx';
import Desktop from './desktop/Desktop.jsx';
import Phone from './phone/Phone.jsx';

function detectDevice() {
  if (typeof window === 'undefined') return 'mac';
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 820;
  return coarse || narrow ? 'phone' : 'mac';
}

function Shutdown() {
  const { t, set } = useOS();
  return (
    <div className="boot off">
      <p className="boot-name">{t('shutdown_msg')}</p>
      <button className="btn-quiet" onClick={() => set({ powered: true, device: null, booted: false })}>
        {t('shutdown_back')}
      </button>
    </div>
  );
}

function Shell() {
  const { device, booted, powered, set, lang } = useOS();
  const detected = useMemo(detectDevice, []);

  /* a link can point straight at one of the two machines:
     …/#mac or …/#phone skips the door */
  useEffect(() => {
    const h = window.location.hash.replace('#', '').toLowerCase();
    if (h === 'mac' || h === 'laptop') set({ device: 'mac' });
    if (h === 'phone' || h === 'ios') set({ device: 'phone' });
  }, [set]);

  useEffect(() => {
    document.title = lang === 'ar' ? 'كمبيوترجي ماهر OS' : 'Computerjy Maher OS';
  }, [lang]);

  if (!powered) return <Shutdown />;
  if (!device) return <Chooser detected={detected} />;
  if (!booted) return <Boot />;
  return device === 'mac' ? <Desktop /> : <Phone />;
}

export default function App() {
  return (
    <OSProvider apps={APPS}>
      <Shell />
    </OSProvider>
  );
}
