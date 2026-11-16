# Portfolio site

Static HTML/CSS/JS, no build step. Serve this folder from any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

```
python3 -m http.server 8000   # from this directory, then open http://localhost:8000
```

- `index.html`: home (hero, featured work, index with cursor preview, approach)
- `about.html`: about (bio, principles, experience, writing, recognition)
- `work/animaze-onboarding.html`: a finished case study
- `work/_template.html`: an annotated case study template. Copy it to `work/<slug>.html`; the comment at the top lists every building block.
- `assets/css/main.css`: design tokens are at the top (colour, type, spacing)
- `assets/js/main.js`: all interactions. No dependencies, and the site respects `prefers-reduced-motion`.

The header and footer are repeated in each HTML file. Update every copy when you change them.
