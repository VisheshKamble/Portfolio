// The "rabbit hole" tornado, drawn on a canvas: shockwave -> stickers burst out -> an ink-brush black hole opens
// -> stickers get caught in an elliptical tornado orbit and are swallowed -> the hole floods the screen.
// Pure functions (no DOM / assets) so they can be tested headlessly.
const TAU = Math.PI * 2
const clamp01 = v => Math.max(0, Math.min(1, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeOut = t => 1 - (1 - t) ** 3
const easeIn = t => t * t * t
const easeInOut = t => (t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const backOut = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2 }

export const TIMES = { mid: 3.0, down: 2.5, fell: 3.35, fade: 4.35, end: 5.1 } // seconds
const SIZE = { astronaut: 250, rhead: 240, laptopDraw: 300, laptop: 220, keys: 250, cricket: 150, head: 190 }
const POS = [[-.3, -.16], [.3, -.27], [.37, .17], [-.27, .27], [.04, .36], [-.06, -.31], [.17, .02]]

export function makeScene({ vw, vh, x, y, to, items }) {
  let s = 98765; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
  const K = Math.min(1.3, Math.max(.6, vw / 1440)), R = Math.hypot(vw, vh), unit = Math.min(vw, vh), dark = to === 'dark'
  const stk = items.map((k, i) => ({
    k, sx: vw / 2 + POS[i % POS.length][0] * vw, sy: vh / 2 + POS[i % POS.length][1] * vh, size: (SIZE[k] || 200) * K,
    rot0: (rnd() - .5) * .6, wob: rnd() * TAU, d: i * .035, tc: 1.0 + i * .14, dur: 1.15 + rnd() * .3, spin: (rnd() < .5 ? -1 : 1) * (1.5 + rnd() * 2),
  }))
  const arms = Array.from({ length: 38 }, () => ({ a0: rnd() * TAU, turns: .5 + rnd() * 1.1, r0: .3 + rnd() * .5, r1: 1 + rnd() * 1.5, w: 2 + rnd() ** 2 * 13, al: .14 + rnd() * .38, dash: [30 + rnd() * 90, 8 + rnd() * 50], ph: rnd(), j: Array.from({ length: 30 }, () => rnd() - .5) }))
  const parts = Array.from({ length: 300 }, () => ({ r0: unit * (.25 + rnd() * 1.1), a0: rnd() * TAU, delay: .85 + rnd() * 1.3, dur: 1.1 + rnd() * .9, size: .8 + rnd() * 3, turn: 3 + rnd() * 3 }))
  const lines = Array.from({ length: 70 }, () => ({ a: rnd() * TAU, ph: rnd(), len: 50 + rnd() * 160, w: .6 + rnd() * 1.6 }))
  return { vw, vh, x, y, to, R, unit, K, stk, arms, parts, lines, ink: dark ? [24, 24, 28] : [240, 238, 230], core: dark ? '#050507' : '#f7f6f2', coreT: dark ? 'rgba(5,5,7,0)' : 'rgba(247,246,242,0)', veil: dark ? '#07070a' : '#f7f6f2' }
}

const holeAt = (S, t) => { const m = easeInOut(clamp01((t - .5) / 2)); return [S.x + (S.vw / 2 - S.x) * m * .6, S.y + (S.vh / 2 - S.y) * m * .6] }
const coreR = (S, t) => { const g = clamp01((t - .55) / 1.55); return g <= 0 ? 0 : 8 + easeInOut(g) * S.unit * .2 }

function place(S, i, t) {
  const it = S.stk[i]
  const float = tt => {
    const b = backOut(clamp01((tt - it.d) / .8)), k = Math.min(1, b)
    return { x: lerp(S.x, it.sx, b) + Math.sin(tt * 3 + it.wob) * 9 * k, y: lerp(S.y, it.sy, b) + Math.cos(tt * 2.3 + it.wob) * 11 * k, s: lerp(.12, 1, b), rot: it.rot0 * b + Math.sin(tt * 2 + it.wob) * .07, a: clamp01(b * 4), ang: 0, tau: 0 }
  }
  if (t < it.tc) return float(t)
  const f = float(it.tc), [hx0, hy0] = holeAt(S, it.tc), r0 = Math.hypot(f.x - hx0, f.y - hy0), a0 = Math.atan2(f.y - hy0, f.x - hx0)
  const tau = clamp01((t - it.tc) / it.dur), [hx, hy] = holeAt(S, t)
  const r = r0 * (1 - tau) ** 1.7, ang = a0 + 2.4 * TAU * tau ** 1.7, flat = 1 - .4 * easeOut(tau)
  return { x: hx + Math.cos(ang) * r, y: hy + Math.sin(ang) * r * flat, s: f.s * (1 - tau) ** .85 * (1 + .22 * (Math.sin(ang) - Math.sin(a0)) * tau), rot: f.rot + it.spin * tau * 2.2 + (ang - a0) * .3, a: 1 - clamp01((tau - .88) / .12), ang, tau }
}

function sprite(ctx, img, it, p, mul = 1) {
  if (!img || !img.naturalWidth || p.a <= 0 || p.s <= .02) return
  const w = it.size * p.s, h = w * img.naturalHeight / img.naturalWidth
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a * mul
  ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 26 * p.s; ctx.shadowOffsetY = 16 * p.s
  ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore()
}

export function draw(ctx, t, S, imgs) {
  const { vw, vh } = S, [ir, ig, ib] = S.ink, rgba = a => `rgba(${ir},${ig},${ib},${a})`
  ctx.clearRect(0, 0, vw, vh)
  const [hx, hy] = holeAt(S, t), cr = coreR(S, t), sw = cr * 3.3 + 30
  const tf = clamp01((t - 2.0) / .8), fade = 1 - clamp01((t - 2.2) / .5)

  for (const dly of [0, .14]) { // shockwave rings from the click
    const q = clamp01((t - dly) / .85)
    if (q > 0 && q < 1) { ctx.beginPath(); ctx.arc(S.x, S.y, easeOut(q) * S.unit * .55, 0, TAU); ctx.strokeStyle = rgba(.45 * (1 - q)); ctx.lineWidth = 1 + 6 * (1 - q); ctx.stroke() }
  }
  const wl = clamp01((t - 1.3) / .5) * fade // hyperspace streaks falling into the hole
  if (wl > 0) for (const L of S.lines) {
    const q = (t * 1.6 + L.ph) % 1, r = (1 - q) ** 1.4 * S.R * .6 + cr * 1.1, r2 = r + L.len * q
    ctx.beginPath(); ctx.moveTo(hx + Math.cos(L.a) * r, hy + Math.sin(L.a) * r * .8); ctx.lineTo(hx + Math.cos(L.a) * r2, hy + Math.sin(L.a) * r2 * .8)
    ctx.strokeStyle = rgba(.28 * wl * q); ctx.lineWidth = L.w; ctx.stroke()
  }
  if (cr > 0) { // ink-brush accretion swirl (inner arms rotate faster)
    const phi = 3.4 * Math.max(0, t - .5) ** 1.35
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const A of S.arms) {
      ctx.beginPath(); const n = A.j.length
      for (let k = 0; k < n; k++) {
        const s = k / (n - 1), rr = lerp(A.r0, A.r1, s), r = rr * sw, th = A.a0 + phi * (1.5 / (.5 + rr)) - A.turns * TAU * s + A.j[k] * .05
        const px = hx + Math.cos(th) * r, py = hy + Math.sin(th) * r * .86
        if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py)
      }
      ctx.setLineDash(A.dash); ctx.lineDashOffset = -t * 60 * (A.ph + .5)
      ctx.strokeStyle = rgba(A.al * Math.min(1, cr / 40) * fade); ctx.lineWidth = A.w * (.5 + .5 * Math.min(1, cr / 120)); ctx.stroke()
    }
    ctx.setLineDash([])
  }
  const order = S.stk.map((it, i) => ({ it, i, p: place(S, i, t) })).sort((a, b) => Math.sin(a.p.ang) - Math.sin(b.p.ang))
  for (const { it, i, p } of order) { // tornado: far side first, motion-blur ghosts while spiralling
    if (p.tau > 0 && p.tau < 1) for (const [dt, am] of [[.09, .12], [.06, .2], [.03, .3]]) sprite(ctx, imgs[it.k], it, place(S, i, t - dt), am)
    sprite(ctx, imgs[it.k], it, p)
  }
  if (cr > 0) { // the core: soft halo, wobbly black disc, iridescent event-horizon rim
    const g = ctx.createRadialGradient(hx, hy, cr * .6, hx, hy, cr * 1.55); g.addColorStop(0, S.core); g.addColorStop(1, S.coreT)
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, cr * 1.55, 0, TAU); ctx.fill()
    ctx.beginPath()
    for (let k = 0; k <= 40; k++) { const a = k / 40 * TAU, w = 1 + .05 * Math.sin(a * 3 + t * 4) + .03 * Math.sin(a * 7 - t * 6), px = hx + Math.cos(a) * cr * w, py = hy + Math.sin(a) * cr * w; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py) }
    ctx.fillStyle = S.core; ctx.fill()
    for (const [col, dx] of [['rgba(255,110,160,.32)', -2.5], ['rgba(110,200,255,.3)', 2.5], ['rgba(255,190,90,.24)', 0]]) { ctx.beginPath(); ctx.arc(hx + dx, hy, cr * 1.03, 0, TAU); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.stroke() }
  }
  for (const P of S.parts) { // ink flecks spiralling in
    const tau = clamp01((t - P.delay) / P.dur); if (tau <= 0 || tau >= 1) continue
    const pos = q => { const r = P.r0 * (1 - q) ** 1.5 + cr * .5, a = P.a0 + P.turn * q ** 1.4; return [hx + Math.cos(a) * r, hy + Math.sin(a) * r * .75] }
    const [x1, y1] = pos(tau), [x0, y0] = pos(Math.max(0, tau - .05))
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = rgba(.55 * Math.sin(Math.PI * tau) * fade); ctx.lineWidth = P.size; ctx.stroke()
  }
  if (t > 2.85) { ctx.globalAlpha = 1; ctx.fillStyle = S.veil; ctx.fillRect(0, 0, vw, vh) }
  else if (tf > 0) { ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(hx, hy, Math.max(cr, easeIn(tf) * S.R * 1.4), 0, TAU); ctx.fillStyle = S.veil; ctx.fill() }
}
