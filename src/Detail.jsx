import { useEffect } from 'react'
import { Visual } from './Devices.jsx'

export default function Detail({ p, onClose }) {
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  const apps = p.group === 'apps'
  return (
    <div className="dt-back" onClick={onClose}>
      <article className="dt" role="dialog" aria-modal="true" aria-label={p.title} onClick={e => e.stopPropagation()}>
        <button className="x" autoFocus onClick={onClose}>close ✕</button>
        <div className={'dt-scene' + (apps ? ' phone' : '')}><Visual p={p} /></div>
        <small>{p.kind} · {p.status}</small>
        <h3>{p.title}</h3>
        {p.badge && <span className="badge">{p.badge}</span>}
        <p className="lead">{p.blurb}</p>
        {p.about && <p>{p.about}</p>}
        {p.points.length > 0 && <><h4>what's inside</h4><ul>{p.points.map(x => <li key={x}>{x}</li>)}</ul></>}
        {p.stack.length > 0 && <div className="stackc">{p.stack.map(x => <span key={x}>{x}</span>)}</div>}
        {apps ? <><a className="btn" href="#">view code ↗</a><a className="btn fill" href="#">see demo ↗</a></>
          : <><a className="btn" href="#">view code ↗</a><a className="btn fill" href={p.site || '#'} target={p.site ? '_blank' : undefined} rel="noreferrer">visit website ↗</a></>}
      </article>
    </div>
  )
}
