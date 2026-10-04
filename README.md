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
