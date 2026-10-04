import { useEffect, useState } from 'react'
// Every image in src/assets/shots/ is picked up automatically by file name (see README.txt there).
const files = import.meta.glob('./assets/shots/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })
export const shotsFor = slug =>
  Object.entries(files).filter(([p]) => new RegExp(`/${slug}(-\\d+)?\\.[a-z]+$`).test(p)).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([, v]) => v)

export function useShots(slug) {
  const shots = shotsFor(slug), [i, setI] = useState(0)
  useEffect(() => {
    if (shots.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI(x => (x + 1) % shots.length), 3400); return () => clearInterval(t)
  }, [shots.length])
  return [shots, i]
}
