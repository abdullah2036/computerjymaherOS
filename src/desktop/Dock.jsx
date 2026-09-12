import { useCallback, useMemo, useRef, useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { DOCK } from '../lib/apps.jsx';
import { TrashIcon } from '../lib/icons.jsx';

/* ============================================================
   The dock, with the magnification.

   The whole effect is computed from the *resting* layout, never from where
   the icons currently are. Measuring live rects looks right for one frame and
   then eats itself: a grown icon pushes its neighbour away, the neighbour
   measures further from the pointer, so it shrinks — you get one big icon and
   eight small ones instead of a wave.

   So: resting centres → a raised-cosine falloff → new widths → new lefts →
   one shift that keeps the pointer over the same spot it started on. The
   dock's own rectangle never changes size; icons swell up out of it, which is
   what actually happens on a Mac.
   ============================================================ */

const REACH = 150;   // px of influence either side of the pointer
const GROWTH = 0.9;  // extra size for the icon directly under it
const GAP = 5;
const PAD = 5;
const SEP = 11;

export default function Dock() {
  const { t, open, byId, windows, dockSize, magnify, reduceMotion, closeAll, dir } = useOS();
  const [px, setPx] = useState(null);   // pointer, in the rail's own coordinates
  const [hover, setHover] = useState(null);
  const railRef = useRef(null);
  const frame = useRef(0);

  const S = dockSize;
  const live = magnify && !reduceMotion;

  /* in Arabic the dock reads from the right, so the row mirrors */
  const slots = useMemo(() => {
    const apps = DOCK.map((id) => byId[id]).filter(Boolean).map((a) => ({ k: 'app', id: a.id, app: a }));
    const row = [...apps, { k: 'sep', id: 'sep' }, { k: 'trash', id: 'trash' }];
    return dir === 'rtl' ? row.reverse() : row;
  }, [byId, dir]);

  /* resting geometry — the only thing the falloff is ever measured against */
  const rest = useMemo(() => {
    let acc = 0;
    const lefts = [];
    const bases = slots.map((s) => (s.k === 'sep' ? SEP : S));
    bases.forEach((w) => { lefts.push(acc); acc += w + GAP; });
    const width = Math.max(0, acc - GAP);
    const centers = lefts.map((l, i) => l + bases[i] / 2);
    return { lefts, bases, centers, width };
  }, [slots, S]);

  const layout = useMemo(() => {
    const n = slots.length;
    if (px == null || !live) {
      return slots.map((s, i) => ({ left: rest.lefts[i], size: rest.bases[i] }));
    }
    const falloff = (d) => (d >= REACH ? 0 : 0.5 * (1 + Math.cos((d / REACH) * Math.PI)));
    const sizes = slots.map((s, i) =>
      s.k === 'sep' ? SEP : S * (1 + GROWTH * falloff(Math.abs(px - rest.centers[i]))),
    );

    let acc = 0;
    const lefts = sizes.map((w) => { const l = acc; acc += w + GAP; return l; });

    /* keep the pointer over the same point of the row it entered, so the
       icon under the cursor stays under the cursor while everything grows */
    let k = 0;
    while (k < n - 1 && px > rest.lefts[k] + rest.bases[k] + GAP) k += 1;
    const span = rest.bases[k] + GAP;
    const frac = Math.max(0, Math.min(1, (px - rest.lefts[k]) / span));
    const wanted = px - (lefts[k] + frac * (sizes[k] + GAP));

    /* the grown row is wider than the dock, so it has to hang over the ends.
       Clamping it to cover the rect makes it bulge past both rounded corners
       — the way a real dock does — instead of letting one end drift off
       into the wallpaper on its own. */
    const rowWidth = lefts[n - 1] + sizes[n - 1];
    const shift = Math.min(0, Math.max(rest.width - rowWidth, wanted));

    return sizes.map((w, i) => ({ left: lefts[i] + shift, size: w }));
  }, [px, live, slots, rest, S]);

  const onMove = useCallback((e) => {
    if (!live) return;
    const r = railRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setPx(x));
  }, [live]);

  const reset = () => { cancelAnimationFrame(frame.current); setPx(null); setHover(null); };

  const running = new Set(windows.map((w) => w.appId));
  const railH = S;
  const dockH = S + PAD * 2 + 4;

  return (
    <div className="dock-wrap">
      <nav
        className={`dock ${px != null && live ? 'mag' : ''}`}
        style={{ inlineSize: rest.width + PAD * 2, blockSize: dockH }}
        onPointerMove={onMove}
        onPointerLeave={reset}
        aria-label="Dock"
      >
        <div className="dock-rail" ref={railRef} style={{ inlineSize: rest.width, blockSize: railH, insetInlineStart: PAD }}>
          {slots.map((s, i) => {
            const { left, size } = layout[i];
            if (s.k === 'sep') {
              return <span key="sep" className="dk-sep" style={{ left, inlineSize: SEP, blockSize: railH }} />;
            }
            const isTrash = s.k === 'trash';
            const app = s.app;
            return (
              <button
                key={s.id}
                className={`dk ${!isTrash && running.has(app.id) ? 'run' : ''}`}
                style={{ left, inlineSize: size, blockSize: size }}
                onClick={() => (isTrash ? closeAll() : open(app.id))}
                onPointerEnter={() => setHover(s.id)}
                aria-label={isTrash ? t('dock_trash') : t(app.key)}
              >
                {hover === s.id && <span className="dk-tip">{isTrash ? t('dock_trash') : t(app.key)}</span>}
                {isTrash ? <TrashIcon full={windows.length > 0} /> : <app.Icon />}
                <span className="dk-dot" />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
