import { useState } from 'react';
import { useOS } from '../lib/store.jsx';
import { PROCESS } from '../data/content.js';

/* About This Machine. The specs table is the studio's specs — where it is,
   what it's made of, what it's rated at — which is the joke and also the
   fastest way to read a company. */
export default function About({ phone }) {
  const { t, b, lang } = useOS();
  const [tab, setTab] = useState('overview');

  const specs = [
    ['ab_spec_loc', 'ab_spec_loc_v'],
    ['ab_spec_since', 'ab_spec_since_v'],
    ['ab_spec_stack', 'ab_spec_stack_v'],
    ['ab_spec_lang', 'ab_spec_lang_v'],
    ['ab_spec_status', 'ab_spec_status_v'],
  ];

  return (
    <div className={`ab ${phone ? 'phone' : ''}`}>
      <div className="ab-hero">
        <div className="ab-mark" aria-hidden="true">م</div>
        <h2>{t('ab_machine')}</h2>
        <p className="ab-ver">{t('ab_version')}</p>
        <p className="ab-est">{b('est')}</p>
      </div>

      <nav className="seg">
        {[['overview', 'ab_overview'], ['process', 'ab_process'], ['specs', 'ab_specs']].map(([id, key]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{t(key)}</button>
        ))}
      </nav>

      {tab === 'overview' && (
        <div className="ab-pane">
          <p className="ab-lede">{b('enter_body')}</p>
          <ul className="ab-stats">
            <li><b>{b('stat1_n')}</b><span>{b('stat1_l')}</span></li>
            <li><b>{b('stat2_n')}</b><span>{b('stat2_l')}</span></li>
            <li><b>{b('stat3_n')}</b><span>{b('stat3_l')}</span></li>
          </ul>
          <p className="note">{t('ab_disclaimer')}</p>
        </div>
      )}

      {tab === 'process' && (
        <div className="ab-pane">
          <ol className="proc tight">
            {PROCESS.map((p, i) => (
              <li key={p}>
                <span className="proc-n">{lang === 'ar' ? ['١', '٢', '٣', '٤'][i] : i + 1}</span>
                <div>
                  <h3>{b(`${p}_t`)}</h3>
                  <p>{b(`${p}_d`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {tab === 'specs' && (
        <div className="ab-pane">
          <table className="ab-specs">
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k}><th>{t(k)}</th><td>{t(v)}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="note">{b('footer')}</p>
        </div>
      )}
    </div>
  );
}
