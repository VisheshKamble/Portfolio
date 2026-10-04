# Vishesh — portfolio (Vite + React)

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # outputs dist/ (deploy to Vercel / Netlify / GitHub Pages)

- `src/art.jsx`   — all hand-drawn SVGs + project/heart text
- `src/App.jsx`   — page sections, links (edit LINKS at the top)
- `src/Scribble.jsx` — the brain scribble; its tail is the start of the thread
- `src/Thread.jsx`   — the scroll-drawn line from the scribble to your photo frame
- `src/index.css`    — theme tokens (light/dark) and layout

Photo: put `me.png` in `public/` and swap the contents of the `.me` div in App.jsx for an `<img>`.
