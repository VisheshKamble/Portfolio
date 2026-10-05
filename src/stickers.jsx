// SVG stand-ins for image stickers. Swap any <svg> for <img src="/stickers/x.png"> later.
import laptopImg from './assets/laptop.png'
import keysImg from './assets/keys.png'
import headImg from './assets/headphones.png'
import cricketImg from './assets/cricket.png'
import astronautImg from './assets/astronaut.webp'
import rheadImg from './assets/headphones-rh.webp'
import brainImg from './assets/brain.webp'
import leetcodeImg from './assets/leetcode.webp'
import laptop3Img from './assets/laptop3d.webp'
const img = (src, alt, w, h) => <img src={src} alt={alt} width={w} height={h} draggable={false} />
const sh = <ellipse className="sh" cx="70" cy="108" rx="46" ry="6" />
export const S = {
  laptop3: img(laptop3Img, 'a laptop with ink motion marks', 700, 636),
  laptop: img(laptopImg, 'a laptop with a smiley and a cat sticker', 265, 193),
  keys: img(keysImg, 'four black keycaps: airplane, code, cloud and a blue cricket one', 386, 306),
  polaroid: <svg viewBox="0 0 140 120">{sh}<rect className="f" x="62" y="8" width="64" height="76" rx="3" transform="rotate(7 94 46)"/><path className="o" d="M72 66l16-18 12 12 8-8 14 14" transform="rotate(7 94 46)"/><rect className="y" x="10" y="42" width="74" height="54" rx="12"/><circle className="f" cx="47" cy="69" r="19"/><circle className="o" cx="47" cy="69" r="8"/><circle className="f" cx="72" cy="52" r="4"/></svg>,
  phones: <svg viewBox="0 0 120 130">{sh}<rect className="f" x="32" y="6" width="56" height="108" rx="13"/><path className="o" d="M52 15h16"/><path className="y" d="M60 36l15 14-15 40-15-40z"/><path className="o" d="M14 50q-8 18 0 36M106 50q8 18 0 36"/></svg>,
  phones2: <svg viewBox="0 0 120 130">{sh}<path className="f" d="M30 104V58q0-8 8-8t8 8V40q0-8 8-8t8 8v-4q0-8 8-8t8 8v10q0-6 8-6t8 6v42q0 20-20 20H52q-22 0-22-20z" transform="translate(0 -4)"/><path className="y" d="M26 20l4 8 8-4-4 8 8 4-8 4 4 8-8-4-4 8-4-8-8 4 4-8-8-4 8-4-4-8 8 4z" transform="scale(.6) translate(-6 0)"/></svg>,
  phones3: <svg viewBox="0 0 130 130">{sh}<path className="f" d="M65 14c-24-10-48 6-44 30-10 8-6 26 6 30 0 14 14 24 28 20 14 4 28-6 28-20 12-4 16-22 6-30 4-24-20-40-24-30z" transform="translate(0 4)"/><path className="o" d="M65 22v78M44 48q10 6 21 0M86 60q-10 6-21 0M42 76q12 4 23 0"/><circle className="y" cx="104" cy="28" r="9"/></svg>,
  head: img(headImg, 'beige over-ear headphones', 449, 556),
  astronaut: img(astronautImg, 'a cartoon astronaut floating in space', 382, 438),
  rhead: img(rheadImg, 'black over-ear headphones', 720, 672),
  leetcode: img(leetcodeImg, 'the LeetCode logo', 317, 367),
  brain: img(brainImg, 'a glossy iridescent brain', 760, 623),
  cricket: img(cricketImg, 'a cricket bat and a red ball', 347, 566),
  globe: <svg viewBox="0 0 130 120">{sh}<circle className="f" cx="65" cy="58" r="30"/><path className="o" d="M36 54q29 14 58 0M44 80q21-10 42 0"/><ellipse className="o" cx="65" cy="58" rx="56" ry="17" transform="rotate(-24 65 58)"/><circle className="y" cx="112" cy="36" r="7"/></svg>,
  astro: <svg viewBox="0 0 160 180"><rect className="f" x="46" y="70" width="68" height="64" rx="22"/><rect className="f" x="36" y="78" width="14" height="38" rx="7" transform="rotate(14 43 97)"/><rect className="f" x="110" y="76" width="14" height="38" rx="7" transform="rotate(-24 117 95)"/><rect className="f" x="52" y="128" width="22" height="34" rx="10"/><rect className="f" x="86" y="128" width="22" height="34" rx="10"/><circle className="f" cx="80" cy="50" r="38"/><ellipse cx="80" cy="52" rx="27" ry="23" fill="var(--ink)"/><path className="y" d="M70 44l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" transform="scale(.7) translate(40 8)"/><rect className="y" x="68" y="92" width="24" height="14" rx="4"/></svg>,
  gameboy: <svg viewBox="0 0 110 140">{sh}<rect className="f" x="22" y="6" width="68" height="110" rx="10"/><rect className="o" x="30" y="16" width="52" height="38" rx="4"/><path className="y" d="M42 28l8 6-8 6z"/><path className="o" d="M38 76h18M47 67v18"/><circle className="y" cx="72" cy="72" r="6"/><circle className="f" cx="64" cy="86" r="6"/><path className="o" d="M40 102h14M60 102h14"/></svg>,
  folder: <svg viewBox="0 0 140 110">{sh}<path className="f" d="M14 24h38l10 12h64v62H14z"/><path className="y" d="M26 44h86v8H26z" transform="rotate(-2 70 48)"/><path className="f" d="M14 46h112v52H14z"/><path className="o" d="M30 66h40M30 80h60"/></svg>,
}
