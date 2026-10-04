import { useEffect, useRef, useState } from 'react'
// iMessage-style bubble that trails the cursor; text comes from the nearest [data-b] element.
export default function Cursor() {
  const el = useRef(), [t, setT] = useState('')
  useEffect(() => {
    if (matchMedia('(pointer:coarse)').matches) return
    let x = -99, y = -99, cx = x, cy = y, raf
    const mv = e => { x = e.clientX; y = e.clientY; const b = e.target.closest?.('[data-b]'); setT(b ? b.dataset.b : '') }
    const loop = () => { cx += (x - cx) * .16; cy += (y - cy) * .16; if (el.current) el.current.style.transform = `translate(${cx + 18}px,${cy + 20}px)`; raf = requestAnimationFrame(loop) }
    addEventListener('pointermove', mv); loop()
    return () => { removeEventListener('pointermove', mv); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={el} className={'bub' + (t ? ' show' : '')} aria-hidden="true">{t}</div>
}
