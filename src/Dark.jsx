import { useCallback, useEffect, useRef, useState } from 'react'
import { all, apps, agents } from './details.jsx'
import { Phone, Shot } from './Devices.jsx'
import Project from './Project.jsx'
import { S } from './stickers.jsx'
import { LINKS, ext } from './links.js'
import earth from './assets/earth.webp'

const seeded = s => () => (s = (s * 16807) % 2147483647) / 2147483647
// a fixed field of tiny stars behind the whole page, [x%, y%, radius, twinkle seconds, delay, peak opacity]
const STARS = (() => { const r = seeded(11); return Array.from({ length: 130 }, () => [r() * 100, r() * 100, r() * 1.3 + .35, 2.4 + r() * 4, r() * 5, .35 + r() * .6]) })()
// 4-point sparkles, [left %, top %, size px]
const SPARKS = [[11, 12, 15], [47, 26, 11], [83, 17, 14], [63, 58, 10], [24, 78, 12], [90, 48, 9]]
// loose hand-drawn squiggles that drift by during "down we go."
const SQUIGS = [
  [18, 22, 'M4 20C10 4 30 8 24 20S6 34 12 24', 0], [78, 17, 'M3 12C12 2 32 6 26 18S4 26 14 16', 1.2],
  [12, 70, 'M5 18c3-12 23-10 20 2s-18 10-14 0', .6], [86, 74, 'M4 22C8 6 30 8 26 20S8 32 16 20', 1.8], [64, 86, 'M2 10c10 10 22-6 30 4', .9],
]
const Spark = ({ className = '', style }) => <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.8 7 17 11.2 24 12 17 12.8 12.8 17 12 24 11.2 17 7 12.8 0 12 7 11.2 11.2 7 12 0Z" /></svg>

// down we go. -> you fell in. -> the page. Any scroll / click / key skips ahead.
function useIntro(skip) {
  const [stage, setStage] = useState(skip ? 'hero' : 'down')
  useEffect(() => {
    if (stage === 'hero') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage('hero'); return }
    const t0 = performance.now(), a = setTimeout(() => setStage('fell'), 2300), z = setTimeout(() => setStage('hero'), 4300)
    const skipIt = () => { if (performance.now() - t0 > 1200) setStage('hero') }, evs = ['wheel', 'touchmove', 'keydown', 'pointerdown']
    evs.forEach(e => addEventListener(e, skipIt, { passive: true }))
    return () => { clearTimeout(a); clearTimeout(z); evs.forEach(e => removeEventListener(e, skipIt)) }
  }, [])
  useEffect(() => {
    document.body.classList.toggle('dk-lock', stage !== 'hero')
    return () => document.body.classList.remove('dk-lock')
  }, [stage])
  return stage
}

function useReveal() {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('dk-in'); io.disconnect() } }, { threshold: .1 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return ref
}

function Hero({ stage }) {
  const ref = useRef()
  const move = e => { // gentle parallax: the astronaut and the headphones drift against the pointer
    if (e.pointerType !== 'mouse' || stage !== 'hero') return
    const r = ref.current.getBoundingClientRect(), st = ref.current.style
    st.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); st.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3))
  }
  return (
    <section className="dk-hero" data-stage={stage} ref={ref} onPointerMove={move}>
      <div className="dk-earth" aria-hidden="true"><img src={earth} alt="" draggable={false} /></div>
      <div className="dk-atmo" aria-hidden="true" />
      <i className="dk-shoot" aria-hidden="true" />

      <svg className="dk-line" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path className="l0" pathLength="1" d="M-40 392C80 352 190 238 318 252C446 266 470 430 346 452C240 468 224 352 330 338C530 312 590 650 850 696C1010 724 1150 646 1330 548" />
        <path className="l1" pathLength="1" d="M-40 392C80 352 190 238 318 252C446 266 470 430 346 452C240 468 224 352 330 338C530 312 590 650 850 696C1010 724 1150 646 1330 548" />
      </svg>

      <div className="dk-astro"><div className="par"><div className="flt">{S.astronaut}</div></div></div>
      {SPARKS.map(([x, y, s], i) => <Spark key={i} className="dk-spk" style={{ left: x + '%', top: y + '%', width: s, '--dl': i * .7 + 's' }} />)}

      {SQUIGS.map(([x, y, d, dl], i) => (
        <svg key={i} className="dk-sq" viewBox="0 0 40 40" aria-hidden="true" style={{ left: x + '%', top: y + '%', '--dl': dl + 's' }}><path d={d} pathLength="1" /></svg>
      ))}
      <p className="dk-down hand">down<br />we go.</p>

      <div className="dk-title">
        <h2>you fell in.</h2>
        <p className="a hand">here's the rest.</p>
        <p className="b hand">don't worry, it's nice down here.</p>
      </div>
      <p className="dk-note hand">the projects that happened when<br />"i wonder if..." turned<br />into "okay, let's build it."</p>

      <h3 className="aw" id="all-work">all work.
        <svg viewBox="0 0 40 40" width="40" aria-hidden="true"><path d="M20 20c2-3 6-1 5 3s-7 5-10 1-1-11 6-12 14 4 13 13-8 15-18 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </h3>
    </section>
  )
}

function Card({ p, i, onOpen }) {
  const ref = useReveal(), app = p.group === 'apps'
  return (
    <div ref={ref} className={'dk-card dk-rv' + (app ? ' app' : '')} style={{ '--ac': p.ac, '--d': (i % 3) * 90 + 'ms' }}
      role="button" tabIndex={0} aria-label={`open ${p.title}`} data-b="open the story ↗" onClick={() => onOpen(p)}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); onOpen(p) } }}>
      {p.badge && <span className="badge">{p.badge}</span>}
      <div className="dk-shot">{app ? <Phone p={p} /> : <Shot p={p} />}</div>
      <div className="dk-meta">
        <small>{p.status}</small>
        <b>{p.title}</b>
        <span>{p.blurb}</span>
        {p.stack.length > 0 && <em>{p.stack.slice(0, 4).join(' · ')}</em>}
      </div>
      <i className="arr" aria-hidden="true">↗</i>
    </div>
  )
}

const FILTERS = [['All', 'all', all.length], ['Apps', 'apps', apps.length], ['Agentic AI', 'agents', agents.length]]

export default function Dark({ openTitle }) {
  const pre = all.find(p => p.title === openTitle) || null
  const [open, setOpen] = useState(pre), [f, setF] = useState('all')
  const stage = useIntro(!!pre)
  const close = useCallback(() => setOpen(null), [])
  return (
    <div className="dk">
      <svg className="dk-dust" aria-hidden="true">
        {STARS.map(([x, y, r, td, dl, o], i) => <circle key={i} cx={x + '%'} cy={y + '%'} r={r} className={i % 3 ? '' : 'tw'} style={{ '--td': td + 's', '--dl': dl + 's', '--o': o, opacity: o }} />)}
      </svg>

      <Hero stage={stage} />

      <section className="dk-work">
        <div className="dk-bar">
          <div className="chips" role="group" aria-label="filter projects">
            {FILTERS.map(([l, v, n]) => <button key={v} className="chip" aria-pressed={f === v} onClick={() => setF(v)}>{l}<sup>{n}</sup></button>)}
          </div>
        </div>

        {f !== 'agents' && <>
          <header className="dk-grp"><div><small>01 — applications</small><h3>the ones you can <i>hold.</i></h3></div></header>
          <div className="dk-grid apps" key={'a' + f}>{apps.map((p, i) => <Card key={p.slug} p={p} i={i} onOpen={setOpen} />)}</div>
        </>}
        {f !== 'apps' && <>
          <header className="dk-grp"><div><small>02 — agentic ai track</small><h3>and now, <i>agents.</i></h3></div><div className="dk-brain" aria-hidden="true">{S.brain}</div></header>
          <div className="dk-grid agents" key={'g' + f}>{agents.map((p, i) => <Card key={p.slug} p={p} i={i} onOpen={setOpen} />)}</div>
        </>}
      </section>

      <section className="dk-end" id="gh">
        <a className="serif" href={LINKS.github} {...ext(LINKS.github)} data-b="more on github ↗">still more on <i>github</i> ↗</a>
        <a className="btn pill" href="#" data-b="back to daylight" id="climb">climb back out ↑</a>
        <small className="dk-credit">earth photo · freepik</small>
      </section>

      {open && <Project list={all} start={open} onClose={close} />}
    </div>
  )
}
