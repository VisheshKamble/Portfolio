import { useEffect, useRef } from 'react'
import { S } from './stickers.jsx'

// "more rabbit holes" -> a full tornado: stickers burst out of the button, an ink-brush vortex opens and
// grows, everything is spun in on accelerating spirals (with ink trails + debris), then the screen goes to ink.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const outCubic = t => 1 - (1 - t) ** 3
const outBack = t => { const c = 1.7; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2 }
const mul = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }

// [sticker, home x, home y (fractions of the viewport), size, tilt, depth]
const CAST = [
  ['laptop3', .70, .15, 2.15, -8, 1.15], ['astronaut', .10, .18, 1.75, -12, 1.1], ['rhead', .09, .68, 1.55, 10, 1.05],
  ['brain', .44, .09, 1.15, 6, .9], ['gameboy', .91, .46, 1.05, 12, .95], ['head', .60, .80, 1.25, -9, 1],
  ['keys', .30, .47, 1.15, -14, .85], ['cricket', .22, .86, 1.2, 18, .9], ['folder', .41, .64, 1, -6, .8],
  ['polaroid', .83, .84, 1, 9, .85], ['art', .71, .62, 1.35, -7, .95], ['laptop', .52, .28, .95, 7, .75], ['globe', .06, .43, .85, -10, .7],
]
const T = { hole: 650, mid: 3300, end: 4300 } // ms

export default function Dive({ d, onMid, onEnd }) {
  const cv = useRef(), lens = useRef(), els = useRef([])
  const dark = d.to === 'dark'
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const a = setTimeout(onMid, reduce ? 250 : T.mid), b = setTimeout(onEnd, reduce ? 800 : T.end)
    if (reduce) return () => { clearTimeout(a); clearTimeout(b) }

    const vw = innerWidth, vh = innerHeight, small = vw < 700, dpr = Math.min(devicePixelRatio || 1, 1.75)
    const c = cv.current, ctx = c.getContext('2d'); c.width = vw * dpr; c.height = vh * dpr
    const R0 = mul(11), diag = Math.hypot(vw, vh), Rmax = diag * 2.05
    const ink = dark ? '8,8,12' : '247,246,242', armInk = dark ? '10,10,14' : '250,249,245'
    const base = clamp(vw * .085, 84, 150)

    // brush strokes of the vortex: every stroke is a bundle of bristles, trimmed unevenly for a dry-brush look
    const strokes = Array.from({ length: small ? 58 : 100 }, () => {
      const nb = 6 + (R0() * 5 | 0)
      return { phi: R0() * 6.283, u0: R0() * 1.1, len: .14 + R0() * .26, a: .35 + R0() * .6, wd: 14 + R0() * 38, k: .8 + R0() * .5, sp: .6 + R0() * .7,
        br: Array.from({ length: nb }, () => ({ off: R0() * 2 - 1, w: 2 + R0() * 5, al: .3 + R0() * .7, t0: R0() * .35, t1: .6 + R0() * .4 })) }
    })
    const debris = Array.from({ length: small ? 90 : 190 }, () => ({ ang: R0() * 6.283, rad: diag * (.18 + R0() * .75), t0: 850 + R0() * 1500, dur: 1000 + R0() * 900, turns: 1.6 + R0() * 1.6, w: .8 + R0() * 2.2, len: .004 + R0() * .007 }))
    const order = [...CAST.keys()].sort(() => R0() - .5)
    const sticks = CAST.map(([, hx, hy, size, tilt, z], i) => ({
      hx: hx * vw, hy: hy * vh, size, tilt, z, dir: i % 2 ? 1 : -1, pop: 30 + i * 48,
      ts: 1000 + order[i] * 80 + R0() * 60, dur: 980 + R0() * 170, spin: 520 + R0() * 520, turns: 2.2 + R0() * 1.4, trail: [], ph: R0() * 6, w: 0, h: 0,
    }))
    // sticker pixel sizes (needed to centre them)
    els.current.forEach((el, i) => { if (!el) return; const w = base * sticks[i].size * sticks[i].z; el.style.width = w + 'px' })

    let raf; const t0 = performance.now()
    const frame = now => {
      const t = now - t0
      const hp = clamp((t - T.hole) / 2400), R = hp > 0 ? 26 + Rmax * hp ** 2.5 : 0
      const dr = hp ** .85 * .5, hx = d.x + (vw / 2 - d.x) * dr, hy = d.y + (vh / 2 - d.y) * dr

      // ---- stickers: burst out of the button, float, then get spun into the hole
      sticks.forEach((s, i) => {
        const el = els.current[i]; if (!el) return
        const qp = clamp((t - s.pop) / 700), qs = clamp((t - s.ts) / s.dur)
        let x = d.x + (s.hx - d.x) * outBack(qp), y = d.y + (s.hy - d.y) * outBack(qp)
        let sc = outBack(qp) * 1, rot = s.tilt * outCubic(qp) + Math.sin(t / 620 + s.ph) * 3, op = clamp(qp * 3), blur = (1.15 - s.z) * 2
        y += Math.sin(t / 480 + s.ph) * 7 * qp * (1 - qs)
        if (qs > 0) {
          const e = qs ** 2.1, rx = s.hx - hx, ry = s.hy - hy, r = Math.hypot(rx, ry) * (1 - e) ** 1.2, an = Math.atan2(ry, rx) + s.dir * e * s.turns * Math.PI * 2 * .5
          x = hx + Math.cos(an) * r; y = hy + Math.sin(an) * r * .86
          sc *= (1 - e * .96) ** 1.3; rot += s.dir * e * s.spin; blur += e * 5; op = qs > .86 ? 1 - (qs - .86) / .14 : 1
          s.trail.push([x, y, sc]); if (s.trail.length > 16) s.trail.shift()
        }
        s.x = x; s.y = y; s.sc = sc; s.rot = rot; s.op = op; s.blur = blur
        el.style.opacity = op; el.style.filter = blur > .1 ? `blur(${blur.toFixed(1)}px)` : ''
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%) rotate(${rot.toFixed(1)}deg) scale(${Math.max(sc, .001).toFixed(3)})`
      })

      // ---- canvas: ripples, sticker trails, debris, the vortex
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, vw, vh); ctx.lineCap = 'round'
      for (let k = 0; k < 3; k++) { // ink-drop ripples from the click
        const q = clamp((t - 560 - k * 170) / 760); if (q <= 0 || q >= 1) continue
        ctx.strokeStyle = `rgba(${ink},${(1 - q) * .3})`; ctx.lineWidth = 2.2 - q * 1.6; ctx.beginPath(); ctx.arc(d.x, d.y, outCubic(q) * (230 + k * 70), 0, 6.283); ctx.stroke()
      }
      sticks.forEach(s => {
        const n = s.trail.length; if (n < 2) return
        for (let k = 1; k < n; k++) {
          const f = k / n; ctx.strokeStyle = `rgba(${armInk},${f * .42})`; ctx.lineWidth = 1 + f * 5 * Math.min(1, s.trail[k][2] + .3)
          ctx.beginPath(); ctx.moveTo(s.trail[k - 1][0], s.trail[k - 1][1]); ctx.lineTo(s.trail[k][0], s.trail[k][1]); ctx.stroke()
        }
      })
      const pos = (p, q) => { const e = q * q, r = p.rad * (1 - e), an = p.ang + e * p.turns * 6.283; return [hx + Math.cos(an) * r, hy + Math.sin(an) * r * .86] }
      debris.forEach(p => {
        const q = clamp((t - p.t0) / p.dur); if (q <= 0 || q >= 1) return
        const A = pos(p, q), B = pos(p, Math.max(0, q - p.len))
        ctx.strokeStyle = `rgba(${armInk},${Math.sin(q * Math.PI) ** .5 * .55})`; ctx.lineWidth = p.w + .6; ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(A[0], A[1]); ctx.stroke()
      })
      if (R > 0) {
        const th = (t - T.hole) / 1000, W = clamp(R / 520, .3, 1.8), grow = clamp(hp * 7)
        ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.5); ctx.scale(1, .8)
        strokes.forEach(st => {
          const span = 1.05, s0 = .17 + ((((st.u0 - th * st.sp * .2) % span) + span) % span), fade = Math.sin(Math.PI * clamp((s0 - .17) / span)) ** .55
          const al = st.a * fade * grow; if (al < .02) return
          st.br.forEach(b => {
            ctx.strokeStyle = `rgba(${armInk},${(al * b.al).toFixed(3)})`; ctx.lineWidth = b.w * W; ctx.beginPath()
            for (let j = 0; j <= 22; j++) {
              const u = s0 + (b.t0 + (b.t1 - b.t0) * j / 22) * st.len, r = u * R
              const an = st.phi + th * 2.7 * st.k * (1 + .55 / (u + .25)) - 2.5 * Math.log(u / .35) + b.off * st.wd * W / Math.max(r, 40)
              j ? ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r) : ctx.moveTo(Math.cos(an) * r, Math.sin(an) * r)
            }
            ctx.stroke()
          })
        })
        const rc = R * .36 // the ink core: overlapping feathered blobs so the edge stays alive
        for (let k = 0; k < 6; k++) {
          const an = k * 1.05 + t * .0016 * (k % 2 ? 1 : -1), ox = Math.cos(an) * rc * .12, oy = Math.sin(an) * rc * .12, rr = rc * (.92 + .1 * Math.sin(t * .004 + k * 2))
          const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr); g.addColorStop(0, `rgba(${ink},1)`); g.addColorStop(.68, `rgba(${ink},.96)`); g.addColorStop(1, `rgba(${ink},0)`)
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, oy, rr, 0, 6.283); ctx.fill()
        }
        ctx.restore()
      }
      if (lens.current) lens.current.style.transform = `translate3d(${hx}px,${hy}px,0) translate(-50%,-50%) scale(${(Math.min(R, Rmax) * 2.4 / 100).toFixed(2)})`
      if (t < T.mid + 150) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); clearTimeout(a); clearTimeout(b) }
  }, [])

  return (
    <div className={'dive ' + d.to}>
      <div className="dim" />
      <div className="lens" ref={lens} />
      <canvas ref={cv} className="dcv" style={{ width: '100%', height: '100%' }} />
      <div className="swirl">
        {CAST.map(([k], i) => <div key={k} className="dsk" ref={el => (els.current[i] = el)}>{S[k]}</div>)}
      </div>
      <div className="fin" />
    </div>
  )
}
