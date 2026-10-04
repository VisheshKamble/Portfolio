import { useRef, useState } from 'react'
import Scribble from './Scribble.jsx'
import Thread from './Thread.jsx'
import { objects, hearts, projects } from './art.jsx'

const FILTERS = ['all', 'ai', 'ml', 'mobile']
const LINKS = { email: 'you@example.com', linkedin: '#', github: '#', x: '#' } // TODO: your real links

export default function App() {
  const main = useRef(), scrib = useRef(), me = useRef()
  const [filter, setFilter] = useState('all')
  const shown = projects.filter(p => filter === 'all' || p.tags.includes(filter))

  return (
    <>
      <nav>
        <a className="logo" href="#top">Vishesh</a>
        <div><a href="#brain">brain</a><a href="#work">work</a><a href={LINKS.github}>github</a><a href="#talk">let's talk</a></div>
      </nav>

      <main id="top" ref={main}>
        <Thread mainRef={main} scribbleRef={scrib} meRef={me} />

        <section className="hero" id="brain">
          <Scribble pathRef={scrib} />
          <div className="hand note in" style={{ animationDelay: '1.6s' }}>↙ an almost accurate map of<br />everything on my mind.</div>
          <h1 className="in">the<br />anatomy of a<br /><em>curious developer.</em></h1>
          <div className="cta in" style={{ animationDelay: '1.2s' }}>
            or do i say, welcome to my portfolio :)<br />
            <a className="btn" href="#work">view work</a><a className="btn fill" href="#talk">let's talk</a>
          </div>
        </section>

        <section className="pad">
          <p className="hand">i tinker with a lot of stuff.</p>
          <h2>a jack of all trades</h2>
          <p className="hand" style={{ fontSize: 22 }}>what a cool way to say i fall down rabbit holes.</p>
          <div className="shelf">
            {objects.map(o => <div className="obj" key={o.label}>{o.svg}<span className="hand">{o.label}</span></div>)}
          </div>
        </section>

        <section className="pad" style={{ paddingTop: '12vh' }}>
          <h2>but few things <em>have my heart.</em></h2>
          {hearts.map(x => (
            <div className="heart" key={x.title}>{x.svg}<div><h3>{x.title}</h3><p>{x.text}</p></div></div>
          ))}
          <div className="loop">
            <div className="serif">most things i got curious about, i ended up building.<br />most things i built, i ended up fixing.</div>
            <ol>{['notice it', 'understand it', 'build it', 'hand it over', 'repeat'].map(s => <li key={s}>{s}</li>)}</ol>
            <p className="hand" style={{ fontSize: 24 }}>enough autobiography.</p>
          </div>
        </section>

        <section className="pad" id="work">
          <h2>let's look at what <em>came out of it.</em></h2>
          <div className="chips" role="group" aria-label="filter projects">
            {FILTERS.map(f => <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
          </div>
          <div className="grid">
            {shown.map(p => (
              <a className="card" href={p.href} key={p.title}>
                <div className="thumb">{p.svg}</div>
                <div className="b"><small>{p.kind}</small><h3>{p.title}</h3><p>{p.text}</p><div className="stack">{p.stack}</div></div>
              </a>
            ))}
          </div>
        </section>

        <section className="end" id="talk">
          <h2>oh, hi.<br />i'm <em>vishesh.</em></h2>
          <div className="sub">still curious.<br />still building.<br />still opening tabs.</div>
          <div className="big">let's build something<br />the internet <em>hasn't seen yet.</em></div>
          <a className="btn fill" style={{ marginLeft: 0 }} href={`mailto:${LINKS.email}`}>{LINKS.email}</a><br />
          <a className="btn" style={{ marginLeft: 0 }} href={LINKS.linkedin}>linkedin</a>
          <a className="btn" href={LINKS.github}>github</a><a className="btn" href={LINKS.x}>x</a>
          <div className="hand" style={{ position: 'absolute', left: '46%', bottom: 200 }}>fun fact:<br />i'm building a portfolio<br />before my photo exists.</div>
          {/* Replace this div's contents with <img src="/me.png" alt="Vishesh" /> when you have your photo */}
          <div className="me" ref={me}><span className="hand">your photo<br />goes here,<br />holding the thread</span></div>
          <footer>© 2026 vishesh · <a href="#top">back to top ↑</a></footer>
        </section>
      </main>
    </>
  )
}
