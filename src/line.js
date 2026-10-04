// Generates the one continuous line: a smooth wandering curve with real loop-the-loops.
const cr = (a, b, c, d, t) => [0, 1].map(k => .5 * (2 * b[k] + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t ** 3))

export function genLine(B) {
  const P = [[B / 2 + 60, 602], [B / 2 + 40, 690], [B / 2 + 300, 690], [B - 200, 540], [B + 60, 410], [B + 285, 305], [B + 560, 470], [B + 800, 650], [B + 1400, 640], [B + 1800, 540], [B + 2000, 340], [B + 2250, 680], [B + 2600, 580], [B + 2925, 590], [B + 3150, 745], [B + 3500, 790], [B + 3775, 250], [B + 4100, 430], [B + 4435, 650], [B + 4700, 780], [B + 5100, 640], [B + 5400, 555], [B + 7500, 555], [B + 8000, 555], [B + 8350, 555], [B + 8480, 600]]
  const n = P.length, raw = []
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < 40; j++) raw.push(cr(P[Math.max(i - 1, 0)], P[i], P[i + 1], P[Math.min(i + 2, n - 1)], j / 40))
  raw.push(P[n - 1])
  const cum = [0]; for (let i = 1; i < raw.length; i++) cum.push(cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]))
  const L = cum[cum.length - 1], N = Math.floor(L / 5), base = []
  for (let m = 0, k = 0; m <= N; m++) {
    const s = m * L / N; while (k < raw.length - 2 && cum[k + 1] < s) k++
    const f = (s - cum[k]) / ((cum[k + 1] - cum[k]) || 1), a = raw[k], b = raw[k + 1], tl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    base.push({ s, x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, tx: (b[0] - a[0]) / tl, ty: (b[1] - a[1]) / tl })
  }
  const at = rx => base.find(p => p.x >= B + rx) || base[base.length - 1]
  // [x offset from B, radius, arc width, side (+1 below / -1 above)]
  const loops = [[-60, 120, 340, -1], [1100, 100, 300, 1], [4100, 120, 340, 1], [5150, 100, 300, 1], [8000, 150, 380, 1]].map(([rx, R, w, dir]) => ({ s0: at(rx).s, R, w, dir, ref: at(rx) }))
  const xs = [], ys = [], tag = [], tu = []
  base.forEach(p => {
    let ox = 0, oy = 0, t = -1, uu = 1
    loops.forEach((lp, li) => {
      const u = (p.s - lp.s0) / lp.w; if (Math.abs(u) >= .5) return
      const au = Math.abs(u), e = au < .3 ? 1 : Math.cos(Math.PI / 2 * (au - .3) / .2) ** 2, ph = 2 * Math.PI * u, tt = -lp.R * e * Math.sin(ph), nn = lp.R * e * (1 - Math.cos(ph)) * lp.dir
      ox += p.tx * tt + (-p.ty) * nn; oy += p.ty * tt + p.tx * nn; t = li; uu = u
    })
    xs.push(+(p.x + ox).toFixed(1)); ys.push(+(p.y + oy).toFixed(1)); tag.push(t); tu.push(uu)
  })
  const cl = [0], run = [xs[0]]
  for (let i = 1; i < xs.length; i++) { cl.push(cl[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1])); run.push(Math.max(run[i - 1], xs[i])) }
  // ring (last loop): centre + three dots on the actual curve
  const rl = loops[loops.length - 1], c = [rl.ref.x - rl.ref.ty * rl.R * rl.dir, rl.ref.y + rl.ref.tx * rl.R * rl.dir]
  const dots = [[-90, 'notice it.', 'm'], [28, 'understand it.', 's'], [152, 'build it.', 'e']].map(([a, label, anchor]) => {
    const v = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)]; let bi = 0, bd = -1e9
    xs.forEach((x, i) => { if (tag[i] === loops.length - 1 && Math.abs(tu[i]) < .3) { const d = (x - c[0]) * v[0] + (ys[i] - c[1]) * v[1]; if (d > bd) { bd = d; bi = i } } })
    return { x: xs[bi], y: ys[bi], label, a }
  })
  return { d: 'M' + xs.map((x, i) => x + ' ' + ys[i]).join('L'), xs, ys, cl, run, total: cl[cl.length - 1], dots, ring: c }
}
