import { useEffect, useRef, useState } from 'react'
import World from './World.jsx'
import { Work, Contact } from './Work.jsx'
import Dark from './Dark.jsx'
import Dive from './Dive.jsx'
import Cursor from './Cursor.jsx'
import { LINKS, ext } from './links.js'

export default function App() {
  const [view, setView] = useState('light')
  const [dive, setDive] = useState(null)
  const [open, setOpen] = useState(null)
  const after = useRef('top')

  const go = (x, y, to, title, target = 'top') => { if (dive) return; after.current = target; setOpen(title || null); setDive({ x, y, to }) }
  const mid = () => { setView(dive.to); document.documentElement.classList.toggle('isdark', dive.to === 'dark'); scrollTo({ top: 0, behavior: 'instant' }) }
  useEffect(() => { if (view === 'light' && after.current === 'talk') setTimeout(() => document.getElementById('talk')?.scrollIntoView(), 80) }, [view])
  useEffect(() => {
    const c = e => { const b = e.target.closest?.('#climb'); if (b) { e.preventDefault(); go(e.clientX, e.clientY, 'light') } }
    document.addEventListener('click', c); return () => document.removeEventListener('click', c)
  })
  const out = (e, t) => { e.preventDefault(); go(e.clientX, e.clientY, 'light', null, t) }

  return (
    <>
      <nav>
        <a className="logo" href="#brain" onClick={view === 'dark' ? e => out(e, 'top') : undefined}>Vishesh</a>
        {view === 'light'
          ? <div><a href="#brain">brain</a><a href="#work">work</a><a href={LINKS.github} {...ext(LINKS.github)}>github</a><a href="#talk">let's talk</a></div>
          : <div><a href="#brain" onClick={e => out(e, 'top')}>brain</a><a href="#all-work" className="cur">work</a><a href={LINKS.github} {...ext(LINKS.github)}>github</a><a href="#talk" onClick={e => out(e, 'talk')}>let's talk</a></div>}
      </nav>
      {view === 'light'
        ? <main><World /><Work onDive={go} /><Contact onDive={go} /></main>
        : <main><Dark openTitle={open} /></main>}
      {dive && <Dive d={dive} onMid={mid} onEnd={() => setDive(null)} />}
      <Cursor />
    </>
  )
}
