import { useEffect, useState } from 'react';
import { useOS } from '../lib/store.jsx';

/* Boot. Short on purpose — long enough to sell the illusion, short enough
   that nobody waits for a portfolio to start up. */
export default function Boot() {
  const { t, set, reduceMotion } = useOS();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (reduceMotion) { set({ booted: true, restarting: false }); return; }
    let raf;
    let done = false;
    const started = performance.now();
    const DURATION = 1900;
    const finish = () => {
      if (done) return;
      done = true;
      set({ booted: true, restarting: false });
    };
    const tick = (now) => {
      const k = Math.min(1, (now - started) / DURATION);
      // ease out, then a small pause at full before the desktop appears
      setP(1 - Math.pow(1 - k, 2.2));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 260);
    };
    raf = requestAnimationFrame(tick);
    // rAF stops ticking in a backgrounded tab, so a plain timer guarantees the
    // machine finishes booting even if you looked away while it did
    const guard = setTimeout(finish, DURATION + 700);
    return () => { cancelAnimationFrame(raf); clearTimeout(guard); };
  }, [reduceMotion, set]);

  return (
    <div className="boot">
      <div className="boot-mark" aria-hidden="true">م</div>
      <p className="boot-name">{t('boot_line')}</p>
      <div className="boot-track"><i style={{ transform: `scaleX(${p})` }} /></div>
      <p className="boot-sub">{t('boot_sub')}</p>
    </div>
  );
}
