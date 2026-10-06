import { useCallback, useEffect, useRef, useState } from 'react'
import { Phone, Browser } from './Devices.jsx'
import { ext } from './links.js'

const CAT = { apps: 'Application', agents: 'Agentic AI' }
const pad = n => String(n).padStart(2, '0')

// Full-screen project view (the reference's "Billing Migration Studio" screen):
// big serif title + one-liner + buttons on the left, the device on the right, prev / next at the bottom.
// ← → switch project, Esc closes. Scroll inside for "the story". `list` is the set prev/next cycles through.
export default function Project({ list, start, onClose }) {
  const [i, setI] = useState(() => Math.max(0, list.findIndex(x => x.slug === start.slug)))
  const [phase, setPhase] = useState('in') // 'out' plays the leave animation, then the next project comes in
  const [dir, setDir] = useState(1)
  const busy = useRef(false), timer = useRef(), scroller = useRef(), from = useRef(document.activeElement)
  const p = list[i], n = list.length
  const prev = list[(i - 1 + n) % n], next = list[(i + 1) % n]

  const go = useCallback(d => {
    if (busy.current || n < 2) return
    busy.current = true; setDir(d); setPhase('out')
    timer.current = setTimeout(() => {
      setI(x => (x + d + n) % n); setPhase('in'); busy.current = false
      scroller.current?.scrollTo({ top: 0 })
    }, 260)
  }, [n])

  useEffect(() => {
    const k = e => {
      if (e.key === 'Escape') onClose()
      else if (!e.defaultPrevented && e.key === 'ArrowRight') go(1)
      else if (!e.defaultPrevented && e.key === 'ArrowLeft') go(-1)
    }
    addEventListener('keydown', k)
    const b = document.body, was = b.style.overflow; b.style.overflow = 'hidden' // lock the page behind
    return () => { removeEventListener('keydown', k); b.style.overflow = was; clearTimeout(timer.current); from.current?.focus?.({ preventScroll: true }) }
  }, [go, onClose])

  const apps = p.group === 'apps'
  const primary = apps || !p.site ? ['view code ↗', p.code] : ['visit website ↗', p.site]
  const second = !apps && p.site ? ['code ↗', p.code] : null

  return (
    <div className="pv" role="dialog" aria-modal="true" aria-label={p.title} style={{ '--ac': p.ac }}>
      <div className="pv-bg" onClick={onClose} />
      <button className="pv-x" autoFocus onClick={onClose} aria-label="close" data-b="back to the grid"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button>

      <div className="pv-scroll" ref={scroller}>
        <div className={'pv-main ' + phase + (dir > 0 ? ' fwd' : ' back')} key={p.slug}>
          <div className="pv-l">
            <span className="pv-k">{pad(i + 1)} / {CAT[p.group]}</span>
            <h2 className="pv-t">{p.title}</h2>
            {p.badge && <span className="badge">{p.badge}</span>}
            <p className="pv-lead">{p.blurb}</p>
            <div className="pv-act">
              <a className="pv-b fill" href={primary[1]} {...ext(primary[1])} data-b={apps ? 'the repo on github' : 'open it'}>{primary[0]}</a>
              {second ? <a className="pv-b" href={second[1]} {...ext(second[1])}>{second[0]}</a>
                : <a className="pv-b" href="#story" onClick={e => { e.preventDefault(); document.getElementById('pv-story')?.scrollIntoView({ behavior: 'smooth' }) }}>the story ↓</a>}
            </div>
            {p.stack.length > 0 && <div className="pv-tags">{p.stack.map(x => <span key={x}>{x}</span>)}</div>}
          </div>

          <div className="pv-r">
            <svg className="pv-spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.8 7 17 11.2 24 12 17 12.8 12.8 17 12 24 11.2 17 7 12.8 0 12 7 11.2 11.2 7 12 0Z" /></svg>
            <div className="pv-glow" aria-hidden="true" />
            {apps ? <div className="pv-phone"><Phone p={p} /></div> : <div className="pv-site"><Browser p={p} /></div>}
          </div>
        </div>

        <section className={'pv-story ' + phase} id="pv-story" key={'s' + p.slug}>
          <div className="pv-story-in">
            <h3 className="pv-sl">the story · {p.kind} · {p.status}</h3>
            {p.about && <p className="pv-about">{p.about}</p>}
            {p.points.length > 0 && <ol className="pv-points">{p.points.map((x, k) => <li key={k}><span>{pad(k + 1)}</span>{x}</li>)}</ol>}
            <div className="pv-end">
              <a className="pv-b fill" href={p.code} {...ext(p.code)}>view code ↗</a>
              {!apps && p.site && <a className="pv-b" href={p.site} {...ext(p.site)}>visit website ↗</a>}
            </div>
          </div>
        </section>
      </div>

      {n > 1 && (
        <div className="pv-nav">
          <button onClick={() => go(-1)} data-b={'← ' + prev.title}>← prev</button>
          <button onClick={() => go(1)} data-b={next.title + ' →'}>next →</button>
        </div>
      )}
    </div>
  )
}
