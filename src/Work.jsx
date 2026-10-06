import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { all } from './details.jsx'
import { Phone, Browser } from './Devices.jsx'
import Project from './Project.jsx'
import { LINKS, ext } from './links.js'
import { S } from './stickers.jsx'
import { SIGN } from './signoff.js'

const FILTERS = [['All', 'all'], ['Apps', 'apps'], ['Agentic AI', 'agents']]

export function Work({ onDive }) {
  const [f, setF] = useState('all'), [open, setOpen] = useState(null)
  const feat = all.filter(p => p.light), apps = feat.filter(p => p.group === 'apps'), agents = feat.filter(p => p.group === 'agents')
  const pick = (e, p) => { e.preventDefault(); setOpen(p) }
  return (
    <section className="work" id="work">
      <div className="wm" aria-hidden="true">WORKS</div>
      <aside>
        <small>selected work / 2024—now</small>
        <h2>a few things,<br /><em>chosen on purpose.</em></h2>
        <p>apps people hold, and agents that think. built end to end.</p>
        <small>show me</small>
        <div className="chips">{FILTERS.map(([l, v]) => <button key={v} className="chip" aria-pressed={f === v} onClick={() => setF(v)}>{l}</button>)}</div>
      </aside>
      <div className="rows">
        {f !== 'agents' && <>
          <div className="grp">01 — applications</div>
          <div className="phones">
            {apps.map(p => (
              <a className="pcard" href="#" key={p.title} data-b="open the story ↗" onClick={e => pick(e, p)}>
                <div className="stage"><Phone p={p} /></div>
                <div className="meta"><div><small>{p.kind}</small><h3>{p.title}</h3><p>{p.blurb}</p>{p.stack.length > 0 && <em>{p.stack.join(' · ')}</em>}</div><span className="arr">↗</span></div>
              </a>
            ))}
          </div>
        </>}
        {f !== 'apps' && <>
          <div className="grp">02 — agentic ai track</div>
          {agents.map(p => (
            <a className="row" href="#" key={p.title} data-b="see it live ↗" onClick={e => pick(e, p)}>
              <div className="shot"><Browser p={p} /></div>
              <div className="meta"><div><small>{p.kind}</small><h3>{p.title}</h3><p>{p.blurb}</p><em>{p.stack.join(' · ')}</em></div><span className="arr">↗</span></div>
            </a>
          ))}
        </>}
        <div className="more">
          <span className="serif">interested? <span className="g">there's more.</span></span>
          <a className="btn pill" href="#" data-b="careful" onClick={e => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); onDive(r.left + r.width / 2, r.top + r.height / 2, 'dark') }}>
            <b className="t1">more rabbit holes →</b><b className="t2">you sure? →</b><b className="t3">okay...</b>
          </a>
        </div>
      </div>
      {open && <Project list={feat} start={open} onClose={() => setOpen(null)} />}
    </section>
  )
}

export function Contact({ onDive }) {
  const sec = useRef(), hi = useRef(), fig = useRef(), path = useRef(), [on, setOn] = useState(false), [d, setD] = useState('')
  useEffect(() => { const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: .3 }); io.observe(sec.current); return () => io.disconnect() }, [])
  useLayoutEffect(() => {
    // the line leaves the end of "oh, hi.", swoops across the page and stops just ABOVE Vishesh's head (measured from the real layout)
    const lay = () => {
      const s = sec.current.getBoundingClientRect(), h = hi.current.getBoundingClientRect(), f = fig.current.getBoundingClientRect()
      if (innerWidth < 900) return setD('')
      const sx = h.right - s.left + 14, sy = h.top - s.top + h.height * .62, ex = f.left - s.left + f.width * .47, top = f.top - s.top
      const cy = Math.max(top - 125, 96), ey = Math.max(top - 62, cy + 42), dx = ex - sx, low = sy + 150 // cy = crest, ey = where the pen lifts (a gap above the head)
      setD(`M${sx} ${sy}C${sx + dx * .2} ${sy - 55} ${sx + dx * .26} ${low - 10} ${sx + dx * .46} ${low}S${sx + dx * .72} ${cy + 8} ${sx + dx * .85} ${cy}C${sx + dx * .93} ${cy - 8} ${ex + 6} ${ey - 50} ${ex} ${ey}`)
    }
    lay(); document.fonts?.ready.then(lay); addEventListener('resize', lay); const t = setTimeout(lay, 400)
    return () => { removeEventListener('resize', lay); clearTimeout(t) }
  }, [])
  return (
    <section className={'end' + (on ? ' on' : '')} id="talk" ref={sec}>
      <svg className="arc" aria-hidden="true"><path ref={path} d={d} pathLength="1" /></svg>
      <div className="end-l">
        <span className="hand who"><svg viewBox="0 0 30 30" width="26" aria-hidden="true"><path d="M24 4C13 4 7 12 6 24M6 24l-2-9M6 24l8-5" /></svg>so, who made this?</span>
        <h1><span ref={hi}>oh, hi.</span><br />i'm <em>vishesh.</em></h1>
        <p className="sub">still curious.<br />still building.<br />still opening tabs.</p>
        <p className="big">let's build something<br />the internet <em>hasn't seen yet.</em></p>
        <a className="cbtn fill" href={LINKS.mailto} data-b="say hi"><span>{LINKS.email}</span><i>↗</i></a>
        <div className="crow"><a className="cbtn" href={LINKS.linkedin} {...ext(LINKS.linkedin)}><span>linkedin</span><i>↗</i></a><a className="cbtn" href={LINKS.github} {...ext(LINKS.github)}><span>github</span><i>↗</i></a><a className="cbtn" href={LINKS.x} {...ext(LINKS.x)}><span>x</span><i>↗</i></a></div>
      </div>
      <div className="fun" data-b="howzat?!">
        <span className="hand">fun fact:<br />i wanted to be a cricketer.<br />even played for mumbai u16.</span>
        <svg className="farr" viewBox="0 0 50 40" width="46" aria-hidden="true"><path d="M4 6C10 28 26 34 44 30M44 30l-10-7M44 30l-8 9" /></svg>
        <div className="bat"><svg className="swing" viewBox="0 0 60 60" aria-hidden="true"><path d="M8 52C2 34 8 14 28 4M16 54C12 40 16 26 30 16" /></svg>{S.cricket}</div>
      </div>
      <div className="me" ref={fig} data-b="yes, that's me.">
        {S.me}
        <svg className="spark" viewBox="0 0 80 50" aria-hidden="true"><path d="M10 40 20 22M38 30V6M62 40 74 20" /></svg>
      </div>
      <span className="hand note n1"><svg viewBox="0 0 40 30" width="34" aria-hidden="true"><path d="M34 6C20 8 10 14 6 26M6 26l1-10M6 26l10-5" /></svg>that's me, mid-thought,<br />somewhere between<br />two rabbit holes.</span>
      <a className="hand note n2" href="#work" data-b="go on, fall in" onClick={e => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); onDive?.(r.left + r.width / 2, r.top + r.height / 2, 'dark') }}>
        did you peek at the<br />rabbit holes yet?<br />go on. i'll wait.
        <svg viewBox="0 0 50 34" width="40" aria-hidden="true"><path d="M4 6C16 4 34 8 44 24M44 24l-2-12M44 24l-12-6" /></svg>
      </a>
      <div className="sign">
        <span className="hand">that's all about me.<svg viewBox="0 0 50 34" width="38" aria-hidden="true"><path d="M4 6C16 4 34 8 44 24M44 24l-2-12M44 24l-12-6" /></svg></span>
        <svg className="sg" viewBox={`0 0 ${SIGN.w} ${SIGN.h}`} role="img" aria-label="signing off"><path pathLength="1" d={SIGN.d} /><path className="sw" pathLength="1" d={SIGN.swoosh} /></svg>
      </div>
      <footer>© 2026 vishesh · <a href="#brain">back to top ↑</a></footer>
    </section>
  )
}
