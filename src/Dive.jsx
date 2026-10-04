import { useEffect } from 'react'
import { S } from './stickers.jsx'
const KS = ['astro', 'head', 'laptop', 'gameboy', 'folder', 'globe', 'keys', 'cricket']
const POS = [[-.36, -.2, -14], [-.17, -.36, 10], [.3, -.28, 8], [.4, .06, -10], [.22, .34, 12], [-.3, .26, -6], [.02, -.1, 18], [-.1, .38, -16]]

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
          <div key={k} className="dsk" style={{ '--bx': d.x - vw / 2 + 'px', '--by': d.y - vh / 2 + 'px', '--px': POS[i][0] * vw + 'px', '--py': POS[i][1] * vh + 'px', '--r': POS[i][2] + 'deg', animationDelay: i * 25 + 'ms' }}>{S[k]}</div>
        ))}
      </div>
    </div>
  )
}
