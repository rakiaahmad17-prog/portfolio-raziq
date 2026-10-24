# Ahmad Raziq — Portfolio

Personal portfolio for **Ahmad Raziq Abiyuqail Umarella**, freelance web designer based in Makassar, Indonesia.

A single-page, hand-built site — no framework, no build step, no dependencies. Open `index.html` in a browser and it works.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The main page — hero, 4 case studies, services, process, about, contact |
| `artikel.html` | Writing index — list, tag filter, search |
| `article.html` | Article reader — renders one Markdown file |
| `tulis.html` | The editor. Write, preview, publish to the live site |
| `styles.css` | Design tokens + every style. All values live in `:root` at the top |
| `main.js` | Menu, grid overlay, scroll reveal, live clock, copy-to-clipboard, WhatsApp form |
| `js/config.js` | Repo owner/name/branch — the only place to change them |
| `js/md.js` | Dependency-free Markdown renderer + frontmatter parser |
| `js/articles.js` | Reads articles from GitHub, and writes them back on publish |
| `articles/` | The articles themselves, one `.md` file each |
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

## Writing your own articles

The site has a blog that you run yourself. There is no database and no admin login — the articles are Markdown files in the `articles/` folder of this repository, and `tulis.html` is a browser editor that writes them for you.

### One-time setup (about 60 seconds)

1. Open <https://github.com/settings/personal-access-tokens/new>.
2. **Fine-grained token**, repository access **Only select repositories → portfolio-raziq**.
3. Permission: **Contents → Read and write**. Nothing else.
4. Generate it, copy it, then open **`/tulis`** on the live site and paste it in.

The token lives in your browser's local storage and is only ever sent to `api.github.com`. Clear it any time with the *Forget token* button.

### Publishing

Open `/tulis`, fill in the title, write the body in Markdown, and press **Publish to the live site**.

- The slug becomes the filename: `articles/<slug>.md`.
- Every publish is a commit, so <https://github.com/rakiaahmad17-prog/portfolio-raziq/commits/main/articles> is your version history. Rolling back is a revert.
- The article appears on `/artikel` within a few seconds — no build step, no redeploy.
- **Load an existing article** pulls a file back into the editor so you can revise it.

### Frontmatter

```markdown
---
title: "Why this site has no price list"
date: 2026-10-24
tags: [pricing, process]
excerpt: "One sentence, shown in the list."
---

Body text in Markdown.
```

`title`, `date` and `tags` drive the list. `excerpt` is optional — without it the first 160 characters of the body are used.

### What the Markdown supports

Headings `##`–`####`, paragraphs, hard line breaks, `**bold**`, `*italic*`, `~~strike~~`, `` `inline code` ``, fenced code blocks with a language, `-` and `1.` lists, `>` quotes, `---` rules, `![alt](src "title")` images, and `[text](url "title")` links. External links open in a new tab; `javascript:` and `data:` URLs are refused and shown as plain text. Raw HTML is escaped, not executed.

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
node tools/wtest.cjs    # list, reader, markdown engine, editor, publish payload
node tools/wshots.cjs   # screenshots at 1440 and 390 + geometry + overflow
node tools/shots.cjs    # the original homepage checks
```

Run them against a local server on `http://127.0.0.1:5599`.

## Repository

<https://github.com/rakiaahmad17-prog/portfolio-raziq> — public. Articles are published by committing to `articles/` on `main`.
