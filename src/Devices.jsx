import { useRef, useState } from 'react'
import { shotsFor, useShots } from './shots.js'
import { Cover } from './Covers.jsx'

// Website screenshots crossfade; with none yet, the generated cover art stands in.
const Shots = ({ p }) => {
  const [shots, i] = useShots(p.slug)
  return shots.length ? shots.map((s, k) => <img key={s} src={s} alt={`${p.title} screenshot ${k + 1}`} className={k === i ? 'on' : ''} draggable={false} />) : <Cover p={p} />
}

// One placeholder screen (used until real screenshots exist); k varies the layout so sliding is visible.
const PhScreen = ({ p, k }) => (
  <div className="ph-ph">
    <div className="ico">{p.svg}</div>
    <h4>{p.title}</h4>
    {k === 0 && <><i className="sk" style={{ width: '82%' }} /><i className="sk" style={{ width: '64%' }} /><i className="sk" style={{ width: '74%' }} /><div className="cards"><i /><i /></div></>}
    {k === 1 && <>{[88, 70, 80, 60, 76].map((w, j) => <i key={j} className="sk row" style={{ width: w + '%' }} />)}</>}
    {k === 2 && <><div className="ring" /><i className="sk" style={{ width: '56%' }} /><div className="cards"><i /><i /><i /></div></>}
    <small>screenshot {k + 1} goes here · swipe ↔</small>
  </div>
)

// iPhone 17-style simulator: titanium frame, dynamic island, status bar, home indicator, tilt + glare.
// The screen is a swipeable carousel (touch swipe, mouse drag, trackpad, arrow keys, dots).
export function Phone({ p }) {
  const ref = useRef(), tr = useRef(), drag = useRef({ on: false, x: 0, i: 0, moved: 0 })
  const shots = shotsFor(p.slug), n = shots.length || 3
  const [idx, setIdx] = useState(0)
  const go = i => { const t = tr.current; t.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * t.clientWidth, behavior: 'smooth' }) }
  const tilt = e => {
    if (drag.current.on || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height, st = ref.current.style
    st.setProperty('--rx', (.5 - y) * 12 + 'deg'); st.setProperty('--ry', (x - .5) * 14 + 'deg'); st.setProperty('--gx', x * 100 + '%'); st.setProperty('--gy', y * 100 + '%')
  }
  const flat = () => { const st = ref.current.style; st.setProperty('--rx', '0deg'); st.setProperty('--ry', '0deg') }
  const down = e => { if (e.pointerType !== 'mouse') return; const t = tr.current; Object.assign(drag.current, { on: true, x: e.clientX, i: Math.round(t.scrollLeft / t.clientWidth), moved: 0, l: t.scrollLeft }); t.classList.add('drag') }
  const move = e => { const d = drag.current; if (!d.on) return; const dx = e.clientX - d.x; d.moved = Math.max(d.moved, Math.abs(dx)); tr.current.scrollLeft = d.l - dx }
  const up = e => {
    const d = drag.current; if (!d.on) return; d.on = false; const t = tr.current, dx = e.clientX - d.x, w = t.clientWidth
    t.classList.remove('drag'); go(dx < -w * .14 ? d.i + 1 : dx > w * .14 ? d.i - 1 : d.i)
  }
  const key = e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1) } }
  return (
    <div className="ph-wrap">
      <div className="ph" ref={ref} onPointerMove={tilt} onPointerLeave={flat} style={{ '--ac': p.ac }} role="group" aria-roledescription="carousel" aria-label={`${p.title} on an iPhone`}>
        <i className="sbtn a" /><i className="sbtn v1" /><i className="sbtn v2" /><i className="sbtn pw" />
        <div className="ph-bezel"><div className="ph-screen">
          <div className="ph-track" ref={tr} tabIndex={0} aria-label="swipe to see more screens" data-b={n > 1 ? 'swipe ↔' : undefined}
            onScroll={e => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onKeyDown={key}
            onClickCapture={e => { if (drag.current.moved > 6) { e.preventDefault(); e.stopPropagation(); drag.current.moved = 0 } }}>
            {shots.length ? shots.map((s, k) => <img key={s} src={s} alt={`${p.title} screen ${k + 1} of ${n}`} draggable={false} />) : [0, 1, 2].map(k => <PhScreen key={k} p={p} k={k} />)}
          </div>
          {n > 1 && <div className="ph-dots">{Array.from({ length: n }, (_, k) => <button key={k} className={k === idx ? 'on' : ''} aria-label={`screen ${k + 1}`} onClick={e => { e.preventDefault(); e.stopPropagation(); go(k) }} />)}</div>}
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
  let host = p.site ? '' : p.slug + '.app'; try { if (p.site) host = new URL(p.site).host } catch {}
  return (
    <div className="bw" style={{ '--ac': p.ac }}>
      <div className="bw-bar"><i /><i /><i /><span className="bw-url">{host}</span></div>
      <div className="bw-screen"><Shots p={p} /></div>
    </div>
  )
}

// Just the page, no browser chrome (the cards on the rabbit-hole page).
export const Shot = ({ p }) => <div className="shot-s" style={{ '--ac': p.ac }}><Shots p={p} /></div>

export const Visual = ({ p }) => (p.group === 'apps' ? <Phone p={p} /> : <Browser p={p} />)
