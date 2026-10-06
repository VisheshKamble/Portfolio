// Cover art for the agentic projects that don't have a website screenshot yet.
// Drop a real screenshot into src/assets/shots/ (e.g. adaptiverag.png) and it replaces the cover automatically.
// Each cover is a serif title over a flowing line (like the reference), plus a tiny diagram of what the project does.

// the ring an agent loops around: plan -> search -> reason -> report
const ring = (a, rx = 196, ry = 98) => [240 + rx * Math.cos(a * Math.PI / 180), 135 + ry * Math.sin(a * Math.PI / 180)]
const AGENT_NODES = [['question', 180], ['plan', 232], ['search', 270], ['reason', 308], ['report', 0]]

const MOTIF = {
  // an agent loop: nodes orbiting the title
  'agent-researcher': (
    <g>
      <ellipse className="cv-ring" cx="240" cy="135" rx="196" ry="98" />
      <ellipse className="cv-ring flow" cx="240" cy="135" rx="196" ry="98" />
      {AGENT_NODES.map(([l, a], i) => {
        const [x, y] = ring(a), up = y < 135, side = Math.abs(x - 240) > 150
        return (
          <g key={l}>
            <circle className="cv-node" cx={x} cy={y} r={i === AGENT_NODES.length - 1 ? 7 : 5.5} />
            <circle className="cv-dot" cx={x} cy={y} r="2" />
            <text className="cv-lab" x={side ? x : x} y={side ? y + 20 : up ? y - 12 : y + 20} textAnchor="middle">{l}</text>
          </g>
        )
      })}
      {[300, 240, 180].map((d, k) => <circle key={k} className="cv-src" cx={ring(90 + (k - 1) * 38)[0]} cy={ring(90 + (k - 1) * 38)[1]} r="2.6" />)}
    </g>
  ),
  // hybrid retrieval: a cloud of dense vectors and a column of sparse keyword hits, both merging into one answer
  adaptiverag: (
    <g>
      {[[44, 58], [66, 44], [84, 70], [52, 84], [100, 52], [30, 74], [76, 94]].map(([x, y], i) => <circle key={i} className="cv-vec" cx={x} cy={y} r={i % 3 ? 3 : 4.4} />)}
      {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} className="cv-tick" x={34 + i * 12} y={196 - (i % 3) * 8 - 6} width="4" height={22 + (i % 3) * 8} rx="2" />)}
      <path className="cv-merge" d="M112 70C230 20 330 70 412 132" />
      <path className="cv-merge" d="M112 214C230 250 330 200 412 138" />
      <path className="cv-merge flow" d="M112 70C230 20 330 70 412 132" />
      <path className="cv-merge flow" d="M112 214C230 250 330 200 412 138" />
      <circle className="cv-node" cx="418" cy="135" r="9" /><circle className="cv-dot" cx="418" cy="135" r="3.4" />
      <path className="cv-merge" d="M428 135H452" />
      <text className="cv-lab" x="76" y="30" textAnchor="middle">dense</text>
      <text className="cv-lab" x="76" y="250" textAnchor="middle">bm25</text>
      <text className="cv-lab" x="438" y="160" textAnchor="middle">answer</text>
    </g>
  ),
  // video: a filmstrip scrubber
  scrybe: (
    <g>
      {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} className="cv-frame" x={34 + i * 70} y="214" width="56" height="32" rx="4" />)}
      <path className="cv-merge" d="M34 202H446" /><circle className="cv-node" cx="246" cy="202" r="5.5" />
    </g>
  ),
}

export function Cover({ p }) {
  return (
    <div className="cv" style={{ '--ac': p.ac }} data-slug={p.slug}>
      <svg className="cv-bg" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path className="cv-wave" d="M-12 178C70 84 150 236 246 150S404 78 492 144" />
        <path className="cv-wave w2" d="M-12 190C74 108 150 244 250 164S410 96 492 158" />
        {MOTIF[p.slug]}
      </svg>
      <b className="cv-t">{p.title}</b>
    </div>
  )
}
