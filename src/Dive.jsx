import { useEffect } from 'react'
import { S } from './stickers.jsx'
const KS = ['astronaut', 'rhead', 'laptop', 'keys', 'cricket']
const BIG = { astronaut: 1.45, rhead: 1.35 } // the two stars of the show
const POS = [[-.3, -.14, -10], [.3, -.24, 8], [.36, .2, 10], [-.26, .28, -8], [.02, .34, 14]]

// Click on "more rabbit holes": stickers scatter, then spiral into a vortex that swallows the page.
export default function Dive({ d, onMid, onEnd }) {
  useEffect(() => { const a = setTimeout(onMid, 1900), b = setTimeout(onEnd, 2700); return () => { clearTimeout(a); clearTimeout(b) } }, [])
  const vw = innerWidth, vh = innerHeight
  return (
    <div className={'dive ' + d.to}>
      <div className="dim" />
      <div className="vx"><i /><i /></div>
      <div className="core" />
      <div className="swirl">
        {KS.map((k, i) => (
          <div key={k} className="dsk" style={{ '--bx': d.x - vw / 2 + 'px', '--by': d.y - vh / 2 + 'px', '--px': POS[i][0] * vw + 'px', '--py': POS[i][1] * vh + 'px', '--r': POS[i][2] + 'deg', '--s': BIG[k] || 1, animationDelay: i * 30 + 'ms' }}>{S[k]}</div>
        ))}
      </div>
    </div>
  )
}
