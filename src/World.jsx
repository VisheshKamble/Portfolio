import { useEffect, useMemo, useRef, useState } from 'react'
import { Stk } from './Sticker.jsx'
import { genLine } from './line.js'

const REL = 8800
const unit = () => Math.min(innerHeight / 900, innerWidth / 1000) // world scale: fits height on desktop, width on phones
const At = ({ x, y, w, c = '', b, children, r = 0 }) => (
  <div className={'at ' + c} data-b={b} style={{ '--x': x, '--y': y, ...(w ? { '--w': w } : {}), transform: r ? `rotate(${r}deg)` : undefined }}>{children}</div>
)
const TL = [
  ['up', 'learned to build screens.', 'flutter apps with supabase behind them. aurix came out of it.', 'chapter 01'],
  ['dn', 'taught a phone to read signs.', 'VANI: indian sign language recognition, YOLOv11, ten languages.', 'chapter 02'],
  ['up', 'went deep on ml.', 'two-tower retrieval, bandits, models that rank and adapt.', 'chapter 03'],
  ['dn', 'started building agents.', 'langgraph, retrieval, video understanding. scrybe, adaptiverag.', 'chapter 04'],
  ['up', 'final year.', 'agent researcher, and a very long list of rabbit holes.', 'chapter 05'],
]
const SENT = 'somehow, i keep ending up taking ownership.'.split(' ')

const SCRIB = (() => {
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647, pts = []
  for (let i = 0; i < 46; i++) { const a = i * 2.4, d = 40 + r() * 110; pts.push([200 + Math.cos(a) * d * 1.3 + (r() - .5) * 40, 150 + Math.sin(a * 1.3) * d * .8 + (r() - .5) * 40]) }
  let d = 'M' + pts[0]
  for (let i = 1; i < pts.length - 1; i++) d += ` Q${pts[i]} ${(pts[i][0] + pts[i + 1][0]) / 2},${(pts[i][1] + pts[i + 1][1]) / 2}`
  return d + ' Q330 270 250 360' // tail: the line starts exactly here
})()

export default function World() {
  const outer = useRef(), track = useRef(), line = useRef(), head = useRef(), scrib = useRef()
  const [vu, setVu] = useState(() => Math.round(innerWidth / unit()))
  const B = vu, W = B + REL, narrow = B < 1300
  const g = useMemo(() => genLine(B), [B])

  useEffect(() => { const f = () => setVu(Math.round(innerWidth / unit())); addEventListener('resize', f); return () => removeEventListener('resize', f) }, [])
  useEffect(() => {
    const sc = scrib.current, L = sc.getTotalLength(); sc.style.strokeDasharray = L
    const a = sc.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 3400, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' })
    return () => a.cancel()
  }, [])
  useEffect(() => {
    const { xs, ys, cl, run, total } = g, p = line.current, PL = p.getTotalLength()
    p.style.strokeDasharray = PL
    let vw, vh, u, maxS
    const tick = () => {
      const s = Math.min(maxS, Math.max(0, -outer.current.getBoundingClientRect().top)), t = s / maxS * total
      let lo = 0, hi = cl.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; cl[m] < t ? (lo = m + 1) : (hi = m) }
      const cam = Math.min(Math.max(0, run[lo] - vw / u * .6), W - vw / u) // camera follows the pen's furthest x: it pauses while the pen loops
      track.current.style.transform = `translate3d(${-cam * u}px,0,0)`
      p.style.strokeDashoffset = PL * (1 - cl[lo] / total)
      head.current.setAttribute('cx', xs[lo]); head.current.setAttribute('cy', ys[lo])
      track.current.querySelectorAll('.w').forEach(w => w.classList.toggle('on', w.getBoundingClientRect().left < vw * .68))
    }
    const size = () => { vw = innerWidth; vh = innerHeight; u = unit(); document.documentElement.style.setProperty('--u', u + 'px'); maxS = total * .62 * u; outer.current.style.height = maxS + vh + 'px'; tick() }
    size(); document.fonts?.ready.then(size)
    addEventListener('resize', size); addEventListener('scroll', tick, { passive: true })
    return () => { removeEventListener('resize', size); removeEventListener('scroll', tick) }
  }, [g, W])

  const [d1, d2, d3] = g.dots
  return (
    <div className="outer" ref={outer} id="brain">
      <div className="pin"><div className="track" ref={track} style={{ width: `calc(${W} * var(--u))` }}>
        <svg className="world" viewBox={`0 0 ${W} 900`} aria-hidden="true">
          <circle cx={B / 2} cy={350} r={270} fill="transparent" data-b="yes, it's a loop. i'm aware." />
          <g transform={`translate(${B / 2 - 240} 170) scale(1.2)`}><path ref={scrib} className="scr" d={SCRIB} /></g>
          <path ref={line} className="ln" d={g.d} />
          <circle ref={head} className="pen" r="11" cx={g.xs[0]} cy={g.ys[0]} />
          {[[d1, 'middle', 0, -22], [d2, 'start', 22, 6], [d3, 'end', -22, 6]].map(([d, a, dx, dy]) => <g key={d.label}><circle className="dot" cx={d.x} cy={d.y} r="8" /><text x={d.x + dx} y={d.y + dy} textAnchor={a} className="svt">{d.label}</text></g>)}
          <text x={g.ring[0]} y={g.ring[1] + 4} textAnchor="middle" className="rep">repeat.</text>
        </svg>

        <At x={60} y={narrow ? 520 : 610} c="hero-h" b="hey"><h1>the<br />anatomy of a<br /><em>curious developer.</em></h1></At>
        <At x={narrow ? B / 2 + 110 : B / 2 + 250} y={narrow ? 70 : 140} c="note-s"><svg viewBox="0 0 40 24" width="34"><path d="M36 4C24 4 12 8 4 20M4 20l2-9M4 20l9-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>an almost accurate map of<br />everything on my mind.</At>
        <At x={narrow ? 60 : B - 600} y={narrow ? 830 : 740} w={540} c={'cta' + (narrow ? ' l' : '')}><span>or do i say, welcome to my portfolio :)</span><br /><a className="btn" href="#work">view work</a><a className="btn fill" href="#talk">let's talk</a></At>

        <Stk k="laptop" label="laptop, stickered" tip="this is where most things begin." x={B + 150} y={170} w={270} r={-3} />
        <Stk k="cricket" label="cricket, always" tip="ask me about cricket. i dare you." x={B + 470} y={560} w={150} r={8} />
        <At x={B + 800} y={200} c="hand"><span className="hand">i tinker with a lot of stuff.</span></At>
        <At x={B + 800} y={240}><h2>a jack of all trades</h2></At>
        <At x={B + 800} y={380} c="sub">what a cool way to say i fall down rabbit holes.</At>
        <Stk k="keys" label="keycaps, with opinions" tip="travel. code. cloud. cricket." x={B + 1900} y={170} w={300} r={-4} />
        <Stk k="head" label="coding playlist, on" tip="headphones on, world off." x={B + 2150} y={590} w={190} r={5} />

        <At x={B + 2800} y={100}><h2>but few things<br />have my heart.</h2></At>
        <Stk k="phones" tip="hot reload ⚡" x={B + 2850} y={480} w={150} />
        <At x={B + 3040} y={520} c="beat"><h3>flutter came first.</h3><p>making interfaces feel alive on a tiny screen.</p></At>
        <Stk k="phones2" tip="turns out, people." x={B + 3700} y={130} w={150} r={-6} />
        <At x={B + 3880} y={170} c="beat"><h3>turns out, i like people too.</h3><p>building VANI for sign language made code feel personal.</p></At>
        <Stk k="phones3" tip="thinking…" x={B + 4350} y={480} w={170} r={4} />
        <At x={B + 4560} y={500} c="beat"><h3>and now, agents.</h3><p>half engineer. half "what if it just did that for me?"</p></At>

        {TL.map(([d, t, s, y], i) => (
          <At key={t} x={B + 5300 + i * 420} y={0} c={'tl ' + d} b="the short version. very short.">
            {d === 'dn' && <i className="tick" />}<div><b>{t}</b><span>{s}</span><small>{y}</small></div>{d === 'up' && <i className="tick" />}
          </At>
        ))}
        <At x={B + 5250} y={790} c="reveal">{SENT.map((w, i) => <span key={i} className="w">{w} </span>)}</At>

        <At x={B + 7450} y={70} c="loopt"><h2>apparently, <span className="g">i don't know how to leave things alone.</span></h2></At>
        <At x={B + 7250} y={800} c="hand" b="yes, it's a loop. i'm aware."><span className="hand">most things i got curious about, i ended up building.<br />most things i built, i ended up fixing.</span></At>
        <At x={B + 8380} y={640} c="seework"><a className="btn fill" href="#work">see the work ↓</a></At>
      </div></div>
    </div>
  )
}
