import { useEffect, useState } from 'react'
import { all, apps, agents } from './details.jsx'
import { Phone, Browser } from './Devices.jsx'
import Detail from './Detail.jsx'
import { S } from './stickers.jsx'

const GITHUB = '#' // TODO: your github url
const STARS = (() => { let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; return Array.from({ length: 90 }, () => [r() * 100, r() * 100, r() * 1.4 + .4]) })()
const LIGHTS = (() => { let s = 5; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; return Array.from({ length: 70 }, () => [150 + r() * 190, 150 + r() * 200, r() * 1.6 + .5]) })()

function Earth() {
  return (
    <svg className="earth" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="eg" cx=".3" cy=".25"><stop offset="0" stopColor="#4c88ff" /><stop offset=".45" stopColor="#0c2559" /><stop offset="1" stopColor="#02040c" /></radialGradient>
        <radialGradient id="eh"><stop offset=".84" stopColor="#6aa0ff" stopOpacity="0" /><stop offset=".96" stopColor="#6aa0ff" stopOpacity=".5" /><stop offset="1" stopColor="#6aa0ff" stopOpacity="0" /></radialGradient>
        <clipPath id="ec"><circle cx="200" cy="200" r="170" /></clipPath>
      </defs>
      <circle cx="200" cy="200" r="198" fill="url(#eh)" />
      <circle cx="200" cy="200" r="170" fill="url(#eg)" />
      <g clipPath="url(#ec)">
        <path d="M60 150q40-40 90-20t30 50q-30 30-20 70t-40 40-60-50-0-90z" fill="#12301f" opacity=".75" />
        <path d="M230 90q60-20 90 30t-10 70q-50 20-70-10t-20-60z" fill="#12301f" opacity=".7" />
        <path d="M250 240q50-10 70 30t-30 70q-40 0-50-40t10-60z" fill="#12301f" opacity=".7" />
        <path d="M40 240q60 30 160 10t200 40v140H40z" fill="#000" opacity=".45" />
        <g fill="#ffd27a">{LIGHTS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * .7} opacity=".85" />)}</g>
        <g fill="#fff" opacity=".13"><ellipse cx="130" cy="120" rx="60" ry="9" /><ellipse cx="260" cy="190" rx="70" ry="8" /><ellipse cx="170" cy="260" rx="55" ry="7" /></g>
      </g>
    </svg>
  )
}

export default function Dark({ openTitle }) {
  const [open, setOpen] = useState(() => all.find(p => p.title === openTitle) || null)
  const Card = ({ p, app }) => (
    <button className={'dk-card' + (app ? ' app' : '')} data-b="open the story ↗" onClick={() => setOpen(p)}>
      {p.badge && <span className="badge">{p.badge}</span>}
      <div className="dk-shot">{app ? <Phone p={p} /> : <Browser p={p} />}</div>
      <b>{p.title}</b><span>{p.blurb}</span>{p.stack.length > 0 && <em>{p.stack.slice(0, 4).join(' · ')}</em>}<i className="arr">↗</i>
    </button>
  )
  return (
    <div className="dk">
      <section className="dk-hero">
        <svg className="stars" aria-hidden="true">{STARS.map(([x, y, z], i) => <circle key={i} cx={x + '%'} cy={y + '%'} r={z} className={i % 5 ? '' : 'tw'} />)}</svg>
        <Earth />
        <div className="dk-astro">{S.astro}</div>
        <svg className="orbit" viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true"><path d="M180 90C320 60 380 200 520 250S760 330 900 300 1100 330 1200 380" /></svg>
        <h2>you fell in.</h2>
        <p className="sub">don't worry, it's nice down here.</p>
        <p className="hand note">the projects that happened when<br />"i wonder if..." turned<br />into "okay, let's build it."</p>
        <h3 className="aw" id="all-work">all work <svg viewBox="0 0 40 40" width="38" aria-hidden="true"><path d="M20 20c2-3 6-1 5 3s-7 5-10 1-1-11 6-12 14 4 13 13-8 15-18 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></h3>
      </section>
      <section className="dk-work">
        <div className="grp">01 — applications</div>
        <div className="dk-grid apps">{apps.map(p => <Card key={p.title} p={p} app />)}</div>
        <div className="grp" style={{ marginTop: '9vh' }}>02 — agentic ai track</div>
        <div className="dk-grid">{agents.map(p => <Card key={p.title} p={p} />)}</div>
      </section>
      <section className="dk-end" id="gh">
        <a className="serif" href={GITHUB} data-b="more on github ↗">still more on <i>github</i> ↗</a>
        <a className="btn pill" href="#" data-b="back to daylight" id="climb">climb back out ↑</a>
      </section>
      {open && <Detail p={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
