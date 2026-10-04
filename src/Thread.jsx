import { useEffect, useRef } from 'react'

// One continuous line: it starts at the end of the hero scribble
// and is drawn further down the page as you scroll, ending at the photo frame.
export default function Thread({ mainRef, scribbleRef, meRef }) {
  const svg = useRef(), path = useRef()

  useEffect(() => {
    const main = mainRef.current, p = path.current
    let L = 0

    const update = () => {
      const prog = Math.min(1, (scrollY + innerHeight * 0.35) / (main.scrollHeight - innerHeight * 0.15))
      p.style.strokeDashoffset = L * (1 - prog)
    }

    const layout = () => {
      const sp = scribbleRef.current, me = meRef.current
      if (!sp || !me) return
      const w = main.clientWidth, h = main.scrollHeight
      const mr = main.getBoundingClientRect()
      // scribble tail end -> page coordinates
      const end = sp.getPointAtLength(sp.getTotalLength())
      const pt = new DOMPoint(end.x, end.y).matrixTransform(sp.getScreenCTM())
      const sx = pt.x - mr.left, sy = pt.y - mr.top
      const b = me.getBoundingClientRect()
      const ex = b.left - mr.left + b.width / 2, ey = b.top - mr.top + 12
      const way = [[.84, .27], [.1, .40], [.9, .53], [.1, .66], [.88, .79]]
      let d = `M${sx} ${sy}`
      way.forEach(([fx, fy]) => { d += ` S${w * fx + (fx > 0.5 ? -110 : 110)} ${h * fy - 90} ${w * fx} ${h * fy}` })
      d += ` S${ex - 140} ${ey + 200} ${ex} ${ey}`
      svg.current.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.current.style.height = h + 'px'
      p.setAttribute('d', d)
      L = p.getTotalLength()
      p.style.strokeDasharray = L
      update()
    }

    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(main)
    document.fonts?.ready.then(layout)
    addEventListener('load', layout)
    addEventListener('scroll', update, { passive: true })
    return () => { ro.disconnect(); removeEventListener('load', layout); removeEventListener('scroll', update) }
  }, [mainRef, scribbleRef, meRef])

  return <svg id="thread" ref={svg} preserveAspectRatio="none" aria-hidden="true"><path ref={path} /></svg>
}
