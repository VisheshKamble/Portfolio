// Every external link on the site lives here. Change one place, it updates everywhere.
const GH = 'https://github.com/VisheshKamble'

export const LINKS = {
  email: 'visheshy2k17@gmail.com',
  mailto: 'mailto:visheshy2k17@gmail.com',
  github: GH,
  linkedin: 'https://www.linkedin.com/in/vishesh-kamble-143505375/',
  x: 'https://x.com/visheshkamble_',
  leetcode: 'https://leetcode.com/u/visheshlovessports/',
}

// project slug -> repository
export const REPOS = {
  nexuspay: `${GH}/NexusPay`,
  vani: `${GH}/Vani`,
  aurix: `${GH}/Aurix`,
  scrybe: `${GH}/Scrybe`,
  adaptiverag: `${GH}/Adaptive-RAG`,
  'agent-researcher': `${GH}/agent-researcher`,
}

// external links open in a new tab, mailto: does not
export const ext = href => (href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})
