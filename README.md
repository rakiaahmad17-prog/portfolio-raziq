# Ahmad Raziq — Portfolio

Personal portfolio for **Ahmad Raziq Abiyuqail Umarella**, freelance web designer based in Makassar, Indonesia.

A single-page, hand-built site — no framework, no build step, no dependencies. Open `index.html` in a browser and it works.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page — hero, 4 case studies, services, process, about, contact |
| `styles.css` | Design tokens + every style. All values live in `:root` at the top |
| `main.js` | Menu, grid overlay, scroll reveal, live clock, copy-to-clipboard, WhatsApp form |
| `assets/` | Full-page screenshots of the four projects (1440 × 900) |
| `shots/` | Rendered verification screenshots at 1440px and 390px |
| `tools/` | Playwright scripts used to take those screenshots and check for overflow |

## Run it

Any static server works:

```bash
python -m http.server 5599     # then open http://127.0.0.1:5599
```

Google Fonts (Newsreader, Plus Jakarta Sans, JetBrains Mono) load from a CDN, so the first load needs a connection. If you want it fully offline, download the `.woff2` files and point the `@font-face` rules at them.

## Art direction

The site is a **specimen sheet** — it treats web design as measurable craft rather than decoration.

- **Palette** — Bone `#F3EFE6` · Ink `#14120E` · Redline `#C4452A` · Sea `#1E4B45` · Rule `#D6CEBC`
- **Type** — Newsreader (display serif) · Plus Jakarta Sans (text) · JetBrains Mono (annotations and labels)
- **Type scale** — modular, ratio 1.250, capped at `--fs-76`
- **Spacing** — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 only
- **Radius** — 2px (controls) · 6px (media) · 12px (cards) — nothing else
- **Signature element** — press <kbd>G</kbd> (or the GRID button in the header) to overlay the real 12-column grid and 8pt baseline the page is built on. The hero's specimen plate is the static version of the same idea.

## What to edit before going live

1. **WhatsApp number** — appears in `index.html` (header, hero, menu, contact list, footer) and once in `main.js` as `const WHATSAPP = '6281958343836';`. Replace both. That is `0819 5834 3836` in local format.
2. **Pricing** — deliberately absent. Every service shows a timeline and *Price on request*; the quote comes after a written scope. If you want a rate card, edit the `service__meta` lines in the Services section.
3. **Availability** — the site says "available for new projects" with no end date. Only the "two slots per month" note implies scarcity; remove it if that stops being true.
4. **Projects** — swap the four `<img src="assets/…">` files and their case-study copy. The first one links out to the live site; the others are labelled *Portfolio build*.
5. **Email / phone** — only a phone number is shown. Add an email address if you want one.

## Accessibility & behaviour

- Skip link, visible focus rings, `aria-expanded` on the menu, `aria-pressed` on the grid toggle, `aria-live` on form status.
- `prefers-reduced-motion: reduce` disables the ticker, the reveal transitions and smooth scrolling.
- Layout is tested with no horizontal overflow at 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920.
- The contact form stores nothing. It composes a WhatsApp message and opens `wa.me` with the text pre-filled.

## Verification

```bash
node tools/shots.cjs    # screenshots at 1440 and 390, plus console-error and overflow checks
```

Run it against a local server on `http://127.0.0.1:5599`.
