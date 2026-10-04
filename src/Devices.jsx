import { useRef } from 'react'
import { useShots } from './shots.js'

const Screens = ({ p, cls }) => {
  const [shots, i] = useShots(p.slug)
  return shots.length ? shots.map((s, k) => <img key={s} src={s} alt={`${p.title} screenshot ${k + 1}`} className={k === i ? 'on' : ''} draggable={false} />) : null
}

// iPhone 17-style simulator: titanium frame, dynamic island, status bar, home indicator, tilt + glare.
export function Phone({ p }) {
  const ref = useRef(), [shots] = [useShots(p.slug)[0]]
  const move = e => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height, s = ref.current.style
    s.setProperty('--rx', (.5 - y) * 12 + 'deg'); s.setProperty('--ry', (x - .5) * 14 + 'deg'); s.setProperty('--gx', x * 100 + '%'); s.setProperty('--gy', y * 100 + '%')
  }
  const leave = () => { const s = ref.current.style; s.setProperty('--rx', '0deg'); s.setProperty('--ry', '0deg') }
  return (
    <div className="ph-wrap">
      <div className="ph" ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ '--ac': p.ac }} role="img" aria-label={`${p.title} on an iPhone`}>
        <i className="sbtn a" /><i className="sbtn v1" /><i className="sbtn v2" /><i className="sbtn pw" />
        <div className="ph-bezel"><div className="ph-screen">
          <Screens p={p} />
          {!shots.length && (
            <div className="ph-ph">
              <div className="ico">{p.svg}</div>
              <h4>{p.title}</h4>
              <i className="sk" style={{ width: '82%' }} /><i className="sk" style={{ width: '64%' }} /><i className="sk" style={{ width: '74%' }} />
              <div className="cards"><i /><i /></div>
              <small>screenshot goes here</small>
            </div>
          )}
          <div className="ph-sb"><span>9:41</span>
            <svg viewBox="0 0 60 14" aria-hidden="true"><path fill="currentColor" d="M1 10h2v3H1zM5 8h2v5H5zM9 5.5h2V13H9zM13 3h2v10h-2z"/><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M22 6.5a7 7 0 0 1 10 0M24.5 9a3.5 3.5 0 0 1 5 0"/><rect x="38" y="3" width="19" height="9" rx="2.6" fill="none" stroke="currentColor" opacity=".5"/><rect x="39.6" y="4.6" width="14" height="5.8" rx="1.4" fill="currentColor"/><path d="M58.4 6v3" stroke="currentColor" opacity=".5"/></svg>
          </div>
          <div className="ph-di" /><div className="ph-home" /><div className="ph-glare" />
        </div></div>
      </div>
    </div>
  )
}

// Browser window for the websites (Scrybe, AdaptiveRAG, Agent Researcher).
export function Browser({ p }) {
  const [shots] = [useShots(p.slug)[0]]
  let host = 'your-site-url'; try { if (p.site) host = new URL(p.site).host } catch {}
  return (
    <div className="bw" style={{ '--ac': p.ac }}>
      <div className="bw-bar"><i /><i /><i /><span className="bw-url">{host}</span></div>
      <div className="bw-screen">
        <Screens p={p} />
        {!shots.length && (
          <div className="bw-ph"><div className="ico">{p.svg}</div><h4>{p.title}</h4><i className="sk" style={{ width: '46%' }} /><i className="sk" style={{ width: '32%' }} /><small>website screenshot goes here</small></div>
        )}
      </div>
    </div>
  )
}

export const Visual = ({ p }) => (p.group === 'apps' ? <Phone p={p} /> : <Browser p={p} />)
