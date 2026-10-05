import { useEffect, useMemo, useRef, useState } from 'react'
import { Stk } from './Sticker.jsx'
import { genLine, S as SH, ART, TLN } from './line.js'

const REL = 8800 + SH
const unit = () => Math.min(innerHeight / 900, innerWidth / 1000) // world scale: fits height on desktop, width on phones
const At = ({ x, y, w, c = '', b, children, r = 0 }) => (
  <div className={'at ' + c} data-b={b} style={{ '--x': x, '--y': y, ...(w ? { '--w': w } : {}), transform: r ? `rotate(${r}deg)` : undefined }}>{children}</div>
)
const TL = [
  ['up', 'learned to build screens.', 'flutter apps with supabase behind them. aurix came out of it.', 'chapter 01', 'phone'],
  ['dn', 'taught a phone to read signs.', 'VANI: indian sign language recognition, YOLOv11, ten languages.', 'chapter 02', 'detect'],
  ['up', 'went deep on ml.', 'two-tower retrieval, bandits, models that rank and adapt.', 'chapter 03', 'towers'],
  ['dn', 'started building agents.', 'langgraph, retrieval, video understanding. scrybe, adaptiverag.', 'chapter 04', 'graph'],
  ['up', 'final year.', 'agent researcher, and a very long list of rabbit holes.', 'chapter 05', 'cap'],
]
// tiny hand-drawn icons (70x70 box) that sit opposite each chapter card
const ICON = {
  phone: <><rect x="20" y="4" width="30" height="58" rx="8" /><path d="M30 11h10" /><path className="y" d="M39 22 28 38h8l-3 14 12-18h-8z" /></>,
  detect: <><path d="M8 22V8h14M48 8h14v14M62 48v14H48M22 62H8V48" /><path d="M28 50V30M35 50V24M42 50V28M49 50V34" /><path d="M28 50q10 12 21 0" /><circle className="y" cx="35" cy="14" r="3.5" /></>,
  towers: <><path d="M6 62V32h16v30zM48 62V16h16v46z" /><path d="M22 42q14-22 26-14" /><path className="y" d="M44 22l6 4-7 5z" /><path d="M12 40h4M54 26h4M54 36h4" /></>,
  graph: <><circle cx="35" cy="12" r="7" className="y" /><circle cx="11" cy="54" r="7" /><circle cx="59" cy="54" r="7" /><path d="M31 18 15 48M39 18l16 30M18 54h34" /><path d="M35 29v10M30 34h10" /></>,
  cap: <><path d="M35 12 67 27 35 42 3 27z" /><path d="M17 35v14q18 13 36 0V35M67 27v20" /><circle className="y" cx="67" cy="50" r="3.5" /></>,
}
// the scribble's "thoughts": little doodles that draw themselves in around the knot once it settles (48x48 boxes, offsets from its centre)
const DD = [
]
const DOODLE = {
  code: <path d="M16 12 4 24l12 12M32 12l12 12-12 12M27 8l-6 32" />,
  phone: <><rect x="14" y="3" width="20" height="42" rx="5" /><path d="M21 9h6" /><path className="y" d="M26 17l-6 10h6l-3 10 9-13h-6z" /></>,
  spark: <path className="y" d="M24 3C25 16 32 23 45 24 32 25 25 32 24 45 23 32 16 25 3 24 16 23 23 16 24 3z" />,
  qm: <path d="M14 16c0-8 6-11 11-11s10 4 10 10c0 8-9 8-10 16M25 41v2" />,
  ball: <><circle cx="24" cy="24" r="17" className="rd" /><path d="M10 14c8 6 8 14 0 20M38 14c-8 6-8 14 0 20M12 20l4 2M12 26l4 1M36 20l-4 2M36 26l-4 1" /></>,
  hp: <path d="M8 30v-6a16 16 0 0 1 32 0v6M8 28h7v14H8zM33 28h7v14h-7z" />,
  agent: <><circle cx="24" cy="8" r="5" className="y" /><circle cx="8" cy="38" r="5" /><circle cx="40" cy="38" r="5" /><path d="M21 12 11 33M27 12l10 21M13 38h22" /></>,
}
const SENT = 'somehow, i keep ending up taking ownership.'.split(' ')

// Opening scribble: two hand-drawn passes that start hair-thin and get bolder as the scribble winds down,
// ending at the main line weight (3px; the group is scaled 1.5x, so 2 here) so the line picks up seamlessly. SVG can't taper a stroke, so each pass
// is cut into many short segments whose widths grow. The tail's end lands exactly where the line starts (250,360).
const scrib = (seed, n, cx, cy, k, tail, w0, w1) => {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647, pts = [], tilt = -.14
  for (let i = 0; i < n; i++) {
    const p = i / (n - 1), swell = Math.sin(Math.PI * Math.min(1, p * 1.08)) ** .7 // grows, peaks, settles
    const a = i * 2.4 + Math.sin(i * .5) * .5, flick = i % 11 === 7 ? 1.45 : 1 // occasional long flick strokes
    const d = (42 + r() * 135 * swell + 22 * swell) * flick * k
    const x = Math.cos(a) * d * 1.12 + (r() - .5) * 34, y = Math.sin(a * 1.3) * d * .8 + (r() - .5) * 34
    pts.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)].map(v => +v.toFixed(1)))
  }
  if (tail) pts[n - 1] = [338, 205] // settle on the right, ready to hand off to the line
  const f = v => +v.toFixed(1), segs = []; let cur = pts[0]
  for (let i = 1; i < n - 1; i++) {
    const e = [f((pts[i][0] + pts[i + 1][0]) / 2), f((pts[i][1] + pts[i + 1][1]) / 2)]
    segs.push(`M${cur} Q${pts[i]} ${e}`); cur = e
  }
  if (tail) {
    segs.push(`M${cur} Q345 215 350 250`, 'M350 250 C352 295 318 330 285 342', 'M285 342 Q262 350 250 360')
  } else segs.push(`M${cur} L${pts[n - 1]}`)
  const T = segs.length
  return segs.map((d, j) => ({ d, w: +(w0 + (w1 - w0) * (j / (T - 1)) ** 1.8).toFixed(2) })) // slow to thicken, bold at the end
}
const SCRIB = scrib(7, 92, 170, 135, 1, true, .3, 2)
const SCRIB2 = scrib(23, 54, 175, 140, .9, false, .2, .9)
const ease = p => p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2

export default function World() {
  const outer = useRef(), track = useRef(), line = useRef(), head = useRef(), line2 = useRef(), head2 = useRef(), cue = useRef(), scrib = useRef(), scrib2 = useRef()
  const [vu, setVu] = useState(() => Math.round(innerWidth / unit()))
  const B = vu, W = B + REL, narrow = B < 1300
  const g = useMemo(() => genLine(B), [B])

  useEffect(() => { const f = () => setVu(Math.round(innerWidth / unit())); addEventListener('resize', f); return () => removeEventListener('resize', f) }, [])
  useEffect(() => {
    // draw each pass segment by segment, driven by one eased progress value
    const prep = g => { let c = 0; return [...g.children].map(el => { const len = el.getTotalLength(), o = { el, len, start: c, on: false }; c += len; el.style.strokeDasharray = len + ' ' + len; el.style.visibility = 'hidden'; return o }) }
    const passes = [[prep(scrib.current), 4200, 0], [prep(scrib2.current), 3600, 350]]
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const paint = (segs, p) => {
      const tot = segs[segs.length - 1].start + segs[segs.length - 1].len, d = p * tot
      segs.forEach(o => { const l = Math.min(1, Math.max(0, (d - o.start) / o.len)); o.el.style.strokeDashoffset = o.len * (1 - l); const on = l > 0; if (on !== o.on) { o.on = on; o.el.style.visibility = on ? 'visible' : 'hidden' } })
    }
    let raf; const t0 = performance.now()
    const frame = now => {
      let done = true
      passes.forEach(([segs, dur, delay]) => { const t = reduce ? 1 : Math.min(1, Math.max(0, (now - t0 - delay) / dur)); paint(segs, ease(t)); if (t < 1) done = false })
      if (!done) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])
  useEffect(() => {
    const { xs, ys, cl, run, total } = g, p = line.current, p2 = line2.current, PL = p.getTotalLength()
    p.style.strokeDasharray = PL; p2.style.strokeDasharray = PL
    let vw, vh, u, maxS
    const tick = () => {
      const s = Math.min(maxS, Math.max(0, -outer.current.getBoundingClientRect().top)), t = s / maxS * total
      let lo = 0, hi = cl.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; cl[m] < t ? (lo = m + 1) : (hi = m) }
      const cam = Math.min(Math.max(0, run[lo] - vw / u * .6), W - vw / u) // camera follows the pen's furthest x: it pauses while the pen loops
      track.current.style.transform = `translate3d(${-cam * u}px,0,0)`
      const off = PL * (1 - cl[lo] / total); p.style.strokeDashoffset = off; p2.style.strokeDashoffset = off // p2 = the same line, drawn again above the art sticker
      for (const h of [head.current, head2.current]) { h.setAttribute('cx', xs[lo]); h.setAttribute('cy', ys[lo]) }
      cue.current.classList.toggle('gone', s > 30)
      track.current.querySelectorAll('.rv').forEach(e => e.classList.toggle('on', lo >= +e.dataset.i)) // loop labels appear as the pen reaches them
      track.current.querySelectorAll('.w,.ink').forEach(w => w.classList.toggle('on', w.getBoundingClientRect().left < vw * .68))
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
          <g transform={`translate(${B / 2 - 315} 62) scale(1.5)`}><g ref={scrib2} className="sway" opacity=".4">{SCRIB2.map((s, i) => <path key={i} className="scr" d={s.d} style={{ strokeWidth: s.w }} />)}</g><g ref={scrib}>{SCRIB.map((s, i) => <path key={i} className="scr" d={s.d} style={{ strokeWidth: s.w }} />)}</g></g>
          <g transform={`translate(${B / 2 - 60} 264)`}>{DD.map(([k, dx, dy, r, t], i) => (
            <g key={k} transform={`translate(${dx} ${dy}) rotate(${r})`} className="dd" style={{ '--dl': 4.6 + i * .28 + 's' }} data-b={t}>
              <circle r="34" fill="transparent" /><g className="dd-in" transform="translate(-24 -24)">{DOODLE[k]}</g>
            </g>))}</g>
          <path ref={line} className="ln" d={g.d} />
          <circle ref={head} className="pen" r="11" cx={g.xs[0]} cy={g.ys[0]} />
          {g.nodes.map((n, i) => {
            const up = TL[i][0] === 'up', last = i === TL.length - 1
            return (
              <g key={i} className="rv node" data-i={n.i} transform={`translate(${n.x} ${n.y})`}>
                <path className="tk" d={up ? 'M0 -20q7 -16 0 -38' : 'M0 20q7 16 0 38'} />
                <g className="burst">{Array.from({ length: 10 }, (_, k) => <path key={k} transform={`rotate(${k * 36})`} d="M0 -24v-9" />)}</g>
                {last ? <path className="star" d="M0 -20 5.5 -6.5 20 -5.5 9 4 12.5 18 0 10.5-12.5 18-9 4-20-5.5-5.5-6.5z" /> : <><circle className="nr" r="15" /><circle className="nd" r="5" /></>}
                <g className="doodle" transform={`translate(-35 ${up ? 38 : -108})`}>{ICON[TL[i][4]]}</g>
              </g>)
          })}
          {[[d1, 'middle', 0, -22], [d2, 'start', 22, 6], [d3, 'end', -22, 6]].map(([d, a, dx, dy]) => <g key={d.label} className="rv" data-i={d.i}><circle className="dot" cx={d.x} cy={d.y} r="8" /><text x={d.x + dx} y={d.y + dy} textAnchor={a} className="svt">{d.label}</text></g>)}
          <text x={g.ring[0]} y={g.ring[1] + 4} textAnchor="middle" className="rep rv" data-i={g.loopEnd}>repeat.</text>
        </svg>

        <At x={60} y={narrow ? 520 : 610} c="hero-h" b="hey"><h1>the<br />anatomy of a<br /><em>curious developer.</em></h1></At>
        <At x={narrow ? B / 2 + 110 : B / 2 + 250} y={narrow ? 70 : 140} c="note-s"><svg viewBox="0 0 40 24" width="34"><path d="M36 4C24 4 12 8 4 20M4 20l2-9M4 20l9-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>an almost accurate map of<br />everything on my mind.</At>
        <At x={narrow ? 60 : B - 600} y={narrow ? 830 : 740} w={540} c={'cta' + (narrow ? ' l' : '')}><span>or do i say, welcome to my portfolio :)</span><br /><a className="btn" href="#work">view work</a><a className="btn fill" href="#talk">let's talk</a></At>

        <Stk k="laptop" label="laptop, stickered" tip="this is where most things begin." x={B + 150} y={170} w={270} r={-3} />
        <Stk k="cricket" label="cricket, always" tip="ask me about cricket. i dare you." x={B + 470} y={560} w={150} r={8} />
        <At x={B + 800} y={200} c="hand"><span className="hand">i tinker with a lot of stuff.</span></At>
        <At x={B + 800} y={240}><h2>a jack of <span className="ul ink">all trades<svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 9C60 2 110 13 160 6S250 4 297 8" /></svg></span></h2></At>
        <At x={B + 800} y={380} c="sub">what a cool way to say i fall down rabbit holes.</At>
        <Stk k="keys" label="keycaps, with opinions" tip="travel. code. cloud. cricket." x={B + 1900} y={170} w={300} r={-4} />
        <Stk k="head" label="coding playlist, on" tip="headphones on, world off." x={B + 2150} y={590} w={190} r={5} />
        <At x={B + 2385} y={196} c="aside"><span className="hand">yes, i draw too.</span><svg viewBox="0 0 70 50" width="64" aria-hidden="true"><path d="M4 6C34 4 56 16 58 40M58 40l-9-9M58 40l8-10" /></svg></At>
        <Stk k="art" label="doodles, mostly" tip="pens out. brain on paper." x={B + ART.x} y={ART.y} w={ART.w} still />

        <At x={B + SH + 2800} y={100}><h2>but few things<br />have my heart.</h2></At>
        <Stk k="phones" tip="hot reload ⚡" x={B + SH + 2850} y={480} w={150} />
        <At x={B + SH + 3040} y={520} c="beat"><h3>flutter came first.</h3><p>making interfaces feel alive on a tiny screen.</p></At>
        <Stk k="leetcode" label="leetcode" tip="leetcode.com/u/visheshlovessports ↗" href="https://leetcode.com/u/visheshlovessports/" x={B + SH + 3700} y={100} w={150} r={-6} />
        <At x={B + SH + 3880} y={170} c="beat"><h3>problem solving, the fun kind.</h3><p>leetcode is where i sharpen my data structures and algorithms, one puzzle at a time.</p></At>
        <Stk k="brain" tip="thinking… always thinking." x={B + SH + 4290} y={470} w={235} r={-3} />
        <At x={B + SH + 4560} y={500} c="beat"><h3>and now, agents.</h3><p>half engineer. half "what if it just did that for me?"</p></At>

        <At x={B + SH + 5330} y={34} c="reveal">{SENT.map((w, i) => <span key={i} className="w">{w} </span>)}</At>
        {TL.map(([d, t, s, y], i) => {
          const n = g.nodes[i], up = d === 'up'
          return (
            <div key={t} className={'at tl rv ' + d} data-i={n.i} data-b="the short version. very short." style={{ '--x': n.x, '--y': up ? n.y - 66 : n.y + 66 }}>
              <div className="card"><small>{y}</small><b>{t}</b><span>{s}</span></div>
            </div>)
        })}

        <At x={B + SH + 7560} y={60} c="loopt"><h2>apparently, <span className="g">i don't know how to leave things alone.</span></h2></At>
        <At x={B + SH + 7520} y={800} c="hand" b="yes, it's a loop. i'm aware."><span className="hand">most things i got curious about, i ended up building.<br />most things i built, i ended up fixing.</span></At>
        <At x={B + SH + 8380} y={640} c="seework"><a className="btn fill" href="#work">see the work ↓</a></At>
        <svg className="world front" viewBox={`0 0 ${W} 900`} aria-hidden="true">
          <defs><clipPath id="weave">{/* the line passes IN FRONT of each ear and BEHIND the face, so it reads as threaded straight through the head */}
            <rect x={B + ART.x - 80} y={ART.ly - 75} width={80 + ART.w * .105 + 3} height={150} />
            <rect x={B + ART.x + ART.w * .748} y={ART.ly - 75} width={ART.w * .3 + 90} height={150} />
          </clipPath></defs>
          <g clipPath="url(#weave)"><path ref={line2} className="ln" d={g.d} /><circle ref={head2} className="pen" r="11" cx={g.xs[0]} cy={g.ys[0]} /></g>
        </svg>
      </div><div className="cue" ref={cue} aria-hidden="true"><span className="hand">scroll</span><svg viewBox="0 0 60 20" width="46"><path d="M2 10h52M44 3l11 7-11 7" /></svg></div></div>
    </div>
  )
}
