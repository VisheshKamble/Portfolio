import { useMemo, useEffect } from 'react'

// Seeded scribble. The last stroke is a tail that falls out of the tangle:
// that tail's end is where the scroll thread begins (see Thread.jsx).
export default function Scribble({ pathRef }) {
  const d = useMemo(() => {
    let s = 7
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647
    const pts = []
    for (let i = 0; i < 46; i++) {
      const a = i * 2.4, rad = 40 + r() * 110
      pts.push([200 + Math.cos(a) * rad * 1.3 + (r() - 0.5) * 40, 150 + Math.sin(a * 1.3) * rad * 0.8 + (r() - 0.5) * 40])
    }
    let d = 'M' + pts[0]
    for (let i = 1; i < pts.length - 1; i++) {
      const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
      d += ` Q${pts[i]} ${m}`
    }
    return d + ' Q 330 270 250 360' // the tail
  }, [])

  useEffect(() => {
    const p = pathRef.current
    const L = p.getTotalLength()
    p.style.strokeDasharray = L
    p.style.strokeDashoffset = L
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const a = p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], {
      duration: reduce ? 1 : 3400, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards',
    })
    return () => a.cancel()
  }, [pathRef])

  return (
    <svg id="scrib" viewBox="0 0 400 300" role="img" aria-label="a scribble: a map of everything on my mind">
      <path ref={pathRef} d={d} />
    </svg>
  )
}
