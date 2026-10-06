# Vishesh — portfolio v3 (Vite + React)

    npm install && npm run dev      # build: npm run build

Flow: light horizontal world (scroll vertically) -> works -> "more rabbit holes" dive -> dark page with detailed project drawers -> "climb back out".

- `src/line.js`     — generates the ONE continuous line: wandering curve + 5 real loop-the-loops (the last is the notice/understand/build ring). Edit the `P` waypoints and `loops` array to reshape it.
- `src/World.jsx`   — the horizontal world. Scribble is centred in the first screen; the line grows out of its tail. Positions are in units (900 = viewport height), relative to `B` (first-screen width). Timeline copy is `TL`.
- `src/stickers.jsx`— SVG stand-ins for image stickers. Swap any `S.xxx` for an `<img>` later.
- `src/Work.jsx`    — works rows, the "more rabbit holes" pill, contact.
- `src/Dive.jsx`    — the click transition: stickers scatter, spiral into a vortex, page goes black.
- `src/Dark.jsx`    — space page, project grid, and the detail drawer (Esc closes).
- `src/details.jsx` — all project text (blurb, about, bullet points, stack). Edit/extend here.
- `src/Cursor.jsx`  — blue chat bubble; add `data-b="text"` to anything.

TODO: real links (Work.jsx Contact, Dark.jsx drawer buttons), timeline years, photo (`.me`).

## v4 notes
- Image stickers live in `src/assets/` (laptop, keys, headphones, cricket) and are wired in `src/stickers.jsx`. Replace the PNGs (same filenames) with higher-res ones any time; transparent bg expected.
- `src/Sticker.jsx` — hover/focus/tap shows a blue chat bubble that types its text. Change the `tip` prop in `World.jsx`.
- Responsive: the world scales with `min(height/900, width/1000)`; on narrow screens the hero re-flows. Touch devices: tap a sticker to open its bubble.

## v5 notes
- Work (light): NexusPay + VANI in an iPhone 17 simulator, Scrybe + AdaptiveRAG as websites. Rabbit hole (dark): NexusPay, VANI, Aurix | Scrybe, AdaptiveRAG, Agent Researcher, then "still more on github".
- Real screenshots: drop them in `src/assets/shots/` named `nexuspay.png`, `vani.png`, `aurix.png` (phone) and `scrybe.png`, `adaptiverag.png`, `agent-researcher.png` (website). Multiple: `vani-1.png`, `vani-2.png` ... they crossfade. No code changes needed.
- All project text/links: `src/details.jsx` (NexusPay's description + stack are TODO; set `site` for each website).
- v5.1: the iPhone screen is a swipeable carousel (touch swipe, mouse drag, trackpad, ← → keys, clickable dots). With no screenshots it shows 3 placeholder screens so you can feel the interaction; real files `vani-1.png, vani-2.png, ...` replace them automatically (single `vani.png` = no dots).
- v5.2: rabbit-hole art — `astronaut.webp` + `headphones-rh.webp` fly in the dive animation and float on the dark page; `brain.webp` marks the "and now, agents." (AI) beat. Swap files in `src/assets/` (keep names, transparent bg).
- v5.3: Aurix now has its real screens (`src/assets/shots/aurix-1..3.webp`: dashboard, nutrition, progress) in the swipeable iPhone. Exported at the phone-screen aspect (0.444) so nothing is cropped; re-export new ones the same way, or just drop `aurix-N.png` files and delete the .webp ones.
- v5.4: NexusPay (UPI detection system) now has its real screens (`nexuspay-1..3.webp`: onboarding, home / fraud intelligence center, payment risk warning). Android status/nav bars were cropped so only the iPhone chrome shows. Screen 3 is low-res (239px wide): re-capture it larger for a crisper result. NexusPay's tech stack is still empty in `src/details.jsx`.
- v5.5: VANI has its real screens (`vani-1..3.webp`: home, live recognition, emergency alert centre). All three apps (NexusPay, VANI, Aurix) now show real swipeable screenshots.

## v6.1 notes
- Scribble: seven hand-drawn "thoughts" (`DD` / `DOODLE` in `World.jsx`) draw themselves around the knot, wobble on hover and carry cursor-bubble text; the faint second pass slowly sways.
- Jack of all trades: new trade = art (`art.webp`, "doodles, mostly"). The line is threaded THROUGH its head: it passes in front of both ears and behind the face (second SVG layer + `clipPath#weave` in `World.jsx`, geometry in `ART` in `line.js`). "all trades" gets a hand-drawn underline.
- LeetCode sticker uses the new 3D logo (`leetcode.webp`).
- Timeline: the line itself rises and falls through five chapters (`TLN` in `line.js`). Each node pops a ring burst when the pen arrives, with a small doodle (phone, YOLO box, two towers, agent graph, grad cap) opposite its card; the last node is a star.
- Closing scene (`Contact` in `Work.jsx`): the line leaves "oh, hi." and swoops behind your head (path measured from the live layout), sparks pop above you, cricket bat + "fun fact: i wanted to be a cricketer. even played for mumbai u16." Replace the placeholder email/links (TODO).
- `me.webp` is low-res (156px wide, upscaled 2x): drop in a higher-res cut-out with the same name for a crisper result.
- Polish: scroll cue, paper grain, nicer buttons, mobile layout for the closing scene.

## v8 notes
- Opening scribble is a dense tangle (`scrib()` in `World.jsx`; change the seed/count to reshape it). The pen ends inside it and the one continuous line starts there (`P[0]` in `line.js`), so scrolling pulls the line out of the scribble. The frame's words appear after it finishes.
- Jack of all trades is tightened (`S`, `ART` in `line.js`).
- Timeline: six chapters (`TL`), text only. Hovering/focusing/tapping a chapter shows a blue link bubble. Set your real GitHub URLs in `GH` / `LINKS` at the top of `World.jsx` (they currently open github.com; LeetCode is already set).

## v6.3 notes (closing scene)
- The swoop now stops just ABOVE the head (gap + crest are computed in `Contact`, `Work.jsx`) instead of tucking behind it; the sparks moved up-right of the head.
- New notes: "did you peek at the rabbit holes yet? go on. i'll wait." (clickable, triggers the same dive as the "more rabbit holes" pill via `onDive`) and "that's all about me." above **signing off**, written with one pen line (`src/signoff.js`, a single-stroke script path drawn with the same dash-offset trick as the main line, starts after the swoop finishes).
- `me.webp` re-cut: 2x Lanczos upscale, pale matte halo removed, sharpened. It now stands on a soft contact shadow (`.me::before`) instead of a big floating drop-shadow, is a bit smaller, and is no longer faded on mobile. A higher-res original photo cut-out (same filename) will still look best.
- v6.3: the "flutter came first." sticker is now a 3D phone with gears + code tag (`src/assets/flutter-phone.webp`, wired as `S.phones` in `stickers.jsx`; size/position in `World.jsx`).
- v6.4: timeline — the last node (coep, cse) is now a glossy 3D star (`src/assets/star3d.webp`, rendered as an inflated gold heightfield with baked shadow). Link bubbles on the lower (`.dn`) chapters now sit above their card, right of the dotted tick, so they never fall off the bottom of the screen (`.tl.dn .tlb` in `index.css`).


---
## v9 — the rabbit hole rebuild

**Flow:** vortex → "down we go." → "you fell in." → space hero (Earth photo, astronaut, line, note) → filter chips → apps in iPhones → agentic cards → full-screen project view → "still more on github" / "climb back out".

| Want to… | Edit |
|---|---|
| change any link (GitHub, LinkedIn, X, email, repos) | `src/links.js` — one place, updates everywhere |
| edit project copy / stack | `src/details.jsx` |
| add a live website for an agentic project | set `site: 'https://…'` in `src/details.jsx` → a "visit website" button appears |
| replace the generated cover art with a real screenshot | drop `adaptiverag.png` / `agent-researcher.png` into `src/assets/shots/` |
| change the cover diagrams | `src/Covers.jsx` |
| change intro timing | `useIntro` in `src/Dark.jsx` (2300ms / 4300ms) |

Project view keys: ← → switch project, Esc closes. Any scroll/click/key skips the intro.

**Credit:** `src/assets/earth.webp` is derived from a stock photo carrying a Freepik mark. Confirm the licence or swap in a NASA / licensed image. A credit line is in the footer (`dk-credit` in `Dark.jsx`).

## v6.5 notes
- The "interested? there's more." CTA is the focal point of Work: handwritten notes with arrows ("i bet you'll love this." / "go on, click it."), a hand-drawn ring that draws itself when the button scrolls into view, and a twinkling spark. Markup in `Work.jsx` (`.more` > `.spot`), styles at the end of `index.css` (`.spot*`). The class is `.spot` because `.cta` is already used by the hero line.
- Also: `World.jsx` now ignores a scroll/fonts callback that fires after the world has unmounted (the dive switches views), which could throw a harmless "getBoundingClientRect of null" console error right after clicking "more rabbit holes".
