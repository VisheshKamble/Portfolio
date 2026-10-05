// Soft, glossy "3D" objects for each timeline chapter. Pure SVG (gradients + isometric maths), so they stay crisp at any size.
// Every object is drawn in a 140x140 box; <Defs3D/> is rendered once inside the world <svg>.

export const Defs3D = () => (
  <defs>
    <filter id="c3-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.6" /></filter>
    <linearGradient id="c3-ink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#505050" /><stop offset=".55" stopColor="#1c1c1c" /><stop offset="1" stopColor="#050505" /></linearGradient>
    <linearGradient id="c3-yel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffeb99" /><stop offset=".6" stopColor="#ffc83d" /><stop offset="1" stopColor="#f0a300" /></linearGradient>
    <linearGradient id="c3-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8ccaff" /><stop offset=".6" stopColor="#2b93ff" /><stop offset="1" stopColor="#0a63d8" /></linearGradient>
    <linearGradient id="c3-clay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d9d5c8" /></linearGradient>
    <linearGradient id="c3-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbe6d4" /><stop offset="1" stopColor="#e2b896" /></linearGradient>
    <linearGradient id="c3-gloss" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity=".34" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
    <radialGradient id="c3-sink" cx=".34" cy=".3" r=".8"><stop offset="0" stopColor="#7a7a7a" /><stop offset=".45" stopColor="#222" /><stop offset="1" stopColor="#000" /></radialGradient>
    <radialGradient id="c3-syel" cx=".34" cy=".3" r=".8"><stop offset="0" stopColor="#fff6c4" /><stop offset=".45" stopColor="#ffc83d" /><stop offset="1" stopColor="#d58f00" /></radialGradient>
    <radialGradient id="c3-sblue" cx=".34" cy=".3" r=".8"><stop offset="0" stopColor="#c7e5ff" /><stop offset=".45" stopColor="#3b9bff" /><stop offset="1" stopColor="#0b57c4" /></radialGradient>
  </defs>
)

const Shadow = ({ cx = 70, cy = 124, rx = 46, ry = 7 }) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity=".2" filter="url(#c3-blur)" />

// isometric box: (cx,cy) = screen position of the base's back corner. x runs right-down, y runs left-down.
const iso = (cx, cy) => (x, y, z) => [cx + (x - y) * .866, cy + (x + y) * .5 - z]
const pts = a => a.map(p => p.map(v => +v.toFixed(1)).join(',')).join(' ')
const Box = ({ cx, cy, w, d, h, top, left, right }) => {
  const P = iso(cx, cy)
  return (
    <g strokeLinejoin="round" strokeWidth="1" >
      <polygon points={pts([P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)])} fill={left} stroke={left} />
      <polygon points={pts([P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)])} fill={right} stroke={right} />
      <polygon points={pts([P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)])} fill={top} stroke={top} />
    </g>
  )
}

// a rounded "screen" lying flat in iso view, with a darker slab underneath for thickness
const Layer = ({ y, fill, side, children }) => (
  <g transform={`translate(70 ${y})`}>
    <g transform="translate(0 8) matrix(.75 .375 -.75 .375 0 0)"><rect x="-40" y="-40" width="80" height="80" rx="13" fill={side} /></g>
    <g transform="matrix(.75 .375 -.75 .375 0 0)"><rect x="-40" y="-40" width="80" height="80" rx="13" fill={fill} />{children}</g>
  </g>
)

export const O3 = {
  // chapter 1: screens stacked up like layers of an app
  app: <>
    <Shadow cy={122} rx={54} />
    <Layer y={88} fill="url(#c3-clay)" side="#b9b4a6"><rect x="-22" y="-4" width="44" height="7" rx="3.5" fill="#00000018" /><rect x="-22" y="10" width="28" height="7" rx="3.5" fill="#00000018" /></Layer>
    <Layer y={62} fill="url(#c3-blue)" side="#0a4fae"><circle cx="-18" cy="-14" r="7" fill="#ffffff66" /><rect x="-4" y="-17" width="30" height="7" rx="3.5" fill="#ffffff66" /><rect x="-22" y="6" width="44" height="7" rx="3.5" fill="#ffffff40" /></Layer>
    <Layer y={36} fill="url(#c3-ink)" side="#000"><path d="M-3 -26 -17 3h11l-5 23L17 -6H6z" fill="url(#c3-yel)" /></Layer>
  </>,

  // chapter 2: a shield that catches scams
  shield: <>
    <Shadow rx={42} />
    <path d="M70 14 120 31V66C120 98 98 118 70 130 42 118 20 98 20 66V31z" fill="#000" />
    <path d="M70 8 116 24V60C116 92 95 111 70 123 45 111 24 92 24 60V24z" fill="url(#c3-ink)" />
    <path d="M70 8 116 24V60C116 92 95 111 70 123 45 111 24 92 24 60V24z" fill="none" stroke="#ffffff22" strokeWidth="1.4" />
    <path d="M70 8 24 24V60C24 92 45 111 70 123z" fill="url(#c3-gloss)" />
    <circle cx="70" cy="62" r="25" fill="url(#c3-syel)" />
    <path d="m57 62 9.5 10L84 52" fill="none" stroke="#111" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="112" cy="26" r="8" fill="url(#c3-sblue)" /><circle cx="109.5" cy="23.5" r="2.4" fill="#fff" opacity=".8" />
  </>,

  // chapter 3: a hand, held in a detection box (VANI)
  hand: <>
    <Shadow cy={126} rx={38} />
    <g stroke="#c79d7c" strokeWidth="1" strokeLinejoin="round">
      <rect x="35" y="78" width="12" height="32" rx="6" transform="rotate(-38 41 90)" fill="url(#c3-skin)" />
      <rect x="48" y="40" width="11.5" height="46" rx="5.75" fill="url(#c3-skin)" />
      <rect x="60.5" y="30" width="11.5" height="56" rx="5.75" fill="url(#c3-skin)" />
      <rect x="73" y="37" width="11.5" height="50" rx="5.75" fill="url(#c3-skin)" />
      <rect x="85.5" y="50" width="11" height="38" rx="5.5" fill="url(#c3-skin)" />
      <rect x="46" y="68" width="52" height="42" rx="19" fill="url(#c3-skin)" />
    </g>
    <path d="M24 38V20a6 6 0 0 1 6-6h18M92 14h18a6 6 0 0 1 6 6v18M116 94v18a6 6 0 0 1-6 6H92M48 118H30a6 6 0 0 1-6-6V94" fill="none" stroke="#1a80ff" strokeWidth="4.6" strokeLinecap="round" />
    <rect x="48" y="104" width="44" height="19" rx="9.5" fill="url(#c3-blue)" />
    <text x="70" y="117.6" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="11" fill="#fff" letterSpacing=".5">ISL</text>
  </>,

  // chapter 4: two towers, one retrieves, one ranks
  towers: <>
    <Shadow cy={118} rx={56} />
    <Box cx={40} cy={82} w={34} d={34} h={70} top="#5a5a5a" left="#262626" right="#0b0b0b" />
    <Box cx={102} cy={96} w={30} d={30} h={42} top="#ffffff" left="#e6e2d6" right="#bfbaab" />
    <path d="M40 22Q96-18 102 60" fill="none" stroke="#111" strokeWidth="2.2" strokeDasharray="1 6.5" strokeLinecap="round" />
    <circle cx="82" cy="12" r="10" fill="url(#c3-syel)" /><circle cx="78.5" cy="8.5" r="2.6" fill="#fff" opacity=".85" />
  </>,

  // chapter 5: an agent graph, nodes passing work around
  agents: <>
    <Shadow rx={50} />
    <g stroke="#161616" strokeWidth="7" strokeLinecap="round" fill="none"><path d="M70 36 32 94M70 36l38 58M32 94h76" /></g>
    <g stroke="#ffffff55" strokeWidth="1.6" strokeLinecap="round" fill="none"><path d="M68 34 30 92M68 34l38 58M34 92h72" /></g>
    <circle cx="70" cy="30" r="21" fill="url(#c3-syel)" />
    <circle cx="30" cy="96" r="17" fill="url(#c3-sink)" />
    <circle cx="110" cy="96" r="17" fill="url(#c3-sink)" />
    <circle cx="70" cy="96" r="10" fill="url(#c3-sblue)" />
    <g fill="#fff" opacity=".8"><circle cx="62" cy="22" r="4" /><circle cx="23" cy="89" r="3.2" /><circle cx="103" cy="89" r="3.2" /></g>
  </>,

  // chapter 6: the cap (COEP)
  cap: <>
    <Shadow cy={120} rx={52} />
    <path d="M36 62V88C36 104 104 104 104 88V62L70 78z" fill="#0a0a0a" />
    <path d="M16 48 70 72V82L16 58z" fill="#1a1a1a" /><path d="M70 72 124 48V58L70 82z" fill="#050505" />
    <path d="M70 24 124 48 70 72 16 48z" fill="url(#c3-ink)" />
    <path d="M70 24 124 48 70 72 16 48z" fill="none" stroke="#ffffff26" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M70 24 16 48 70 72z" fill="url(#c3-gloss)" />
    <path d="M70 48 114 56V86" fill="none" stroke="#ffc83d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="109" y="84" width="10" height="20" rx="4" fill="url(#c3-yel)" />
    <circle cx="70" cy="48" r="5.5" fill="url(#c3-syel)" />
  </>,
}
