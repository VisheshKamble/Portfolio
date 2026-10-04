import { useEffect, useState } from 'react'
import { S } from './stickers.jsx'

// A sticker that "types" a chat bubble above itself on hover / focus / tap.
export function Stk({ k, label, tip, x, y, w, r = 0 }) {
  const [on, setOn] = useState(false), [n, setN] = useState(0)
  useEffect(() => {
    if (!on) { setN(0); return }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(tip.length); return }
    let i = 0; const t = setInterval(() => { i++; setN(i); if (i >= tip.length) clearInterval(t) }, 38)
    return () => clearInterval(t)
  }, [on, tip])
  const mouse = v => e => e.pointerType !== 'touch' && setOn(v) // touch uses focus (tap)
  return (
    <div className={'at stk' + (on ? ' on' : '')} style={{ '--x': x, '--y': y, '--w': w, '--rot': r + 'deg' }}
      tabIndex={0} role="img" aria-label={label || tip}
      onPointerEnter={mouse(true)} onPointerLeave={mouse(false)} onFocus={() => setOn(true)} onBlur={() => setOn(false)}>
      {S[k]}
      {label && <span className="hand">{label}</span>}
      <div className="sbub" aria-hidden="true"><span className="gh">{tip}</span><span className="lv">{tip.slice(0, n)}<i className="caret" /></span></div>
    </div>
  )
}
