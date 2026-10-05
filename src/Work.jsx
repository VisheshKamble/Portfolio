import { useEffect, useRef, useState } from 'react'
import { all } from './details.jsx'
import { Phone, Browser } from './Devices.jsx'
import Detail from './Detail.jsx'
import { S } from './stickers.jsx'

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
      {open && <Detail p={open} onClose={() => setOpen(null)} />}
    </section>
  )
}

export function Contact() {
  const ref = useRef(), [on, setOn] = useState(false)
  useEffect(() => { const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: .3 }); io.observe(ref.current); return () => io.disconnect() }, [])
  return (
    <section className={'end' + (on ? ' on' : '')} id="talk" ref={ref}>
      <svg className="arc" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120C200 90 300 360 520 420S760 300 800 140S880 40 900 30" /></svg>
      <h1>oh, hi.<br />i'm <em>vishesh.</em></h1>
      <p className="sub">still curious.<br />still building.<br />still opening tabs.</p>
      <p className="big">let's build something<br />the internet <em>hasn't seen yet.</em></p>
      <a className="btn fill" href="mailto:you@example.com">you@example.com ↗</a><br />
      <a className="btn" href="#">linkedin ↗</a><a className="btn" href="#">github ↗</a><a className="btn" href="#">x ↗</a>
      <div className="fun" data-b="hey"><span className="hand">fun fact:<br />i'm building a portfolio<br />before my photo exists.</span><div className="astro2">{S.astronaut}</div></div>
      {/* Replace the span with <img src="/me.png" alt="Vishesh" /> */}
      <div className="me"><span className="hand">your photo<br />goes here</span></div>
      <footer>© 2026 vishesh · <a href="#brain">back to top ↑</a></footer>
    </section>
  )
}
