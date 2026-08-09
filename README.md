# Groundwork Capital — landing page

Marketing site for Groundwork Capital, an operator-led firm backing the solo economy.

Built as a static site: no framework, no build step, no runtime dependencies. Open
`index.html` and it runs.

## Structure

```
index.html              Full page markup
assets/css/styles.css   Design tokens, layout, responsive rules
assets/js/main.js       Hero orbit, WebGL orb, levers, reveals, newsletter
assets/img/             Team portraits (WebP with JPEG fallback) and social card
favicon.svg             Brand mark
vercel.json             Clean URLs, asset caching, security headers
```

## Local preview

Any static server works, for example:

```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

Opening the file directly also works, though the absolute `/assets/...` paths
expect a server root, so a local server is the better option.

## Design notes

Ported from the Claude Design source (`Groundwork Landing.dc.html`). That file
targets a React-based preview runtime loaded from a CDN; this repo reimplements
the same page in vanilla HTML, CSS, and JavaScript so the deployed site carries
no third-party runtime.

Palette and type scale are unchanged from the source:

| Token | Value | Use |
| --- | --- | --- |
| Bone | `#F6F3EC` | Page ground |
| Ink | `#1A1712` | Text, dark bands |
| Orange | `#E2591F` | Accent, CTA |
| Card | `#FFFDF8` | Raised surfaces |

Type: Archivo (display), Instrument Sans (body), JetBrains Mono (labels).

Two things were added beyond the source, which was a fixed 1000px-wide desktop
composition: responsive breakpoints at 1180px, 960px, and 620px, and a
`prefers-reduced-motion` path that stops the orbit drift, the orb shader loop,
and the scroll reveals.

### Interactive pieces

- **Hero orbit.** Six business functions circle a WebGL orb rendered from the
  source fragment shader. Clicking a node rotates it to the top and opens a
  detail card; Escape or a click outside closes it. Falls back to a CSS gradient
  when WebGL is unavailable.
- **Levers.** Six rows drive a detail panel, navigable with arrow keys.
- **Field notes.** Inline form plus a prompt that appears past 560px of scroll
  and stays dismissed via `localStorage`.

The newsletter forms currently confirm in the UI without posting anywhere. Point
them at a real list provider before launch.

## Images

Source portraits were 1254x1254 PNGs totalling 6.7 MB. They ship here as 900x900
WebP with JPEG fallbacks, about 149 KB for all three.

## Deployment

Deployed on Vercel as a static site with no build command. Pushes to the
connected branch deploy automatically.
