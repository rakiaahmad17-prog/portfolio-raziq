---
title: "The grid you can press G for"
date: 2026-10-20
tags: [design, craft]
excerpt: "Every page on this site is built on a 12-column grid with an 8-point baseline. Press G and the scaffolding becomes the decoration."
---

There is a button in the header labelled GRID. Press it and the page you are reading gains a set of red vertical rules, a faint horizontal lattice, and a small red chip that tells you which system you are looking at. Press G again and it disappears.

This is not a toy. It is the same drawing the page was built from, finally visible.

## Why show the scaffolding at all

Most portfolios hide their structure and show you the finished room. That is reasonable if the finished room is the point. But for a web designer the structure *is* the point — a layout that lines up is a layout that was decided, not nudged until it looked acceptable.

The overlay is not a screenshot of a design file. It is the actual CSS the browser is using to lay out your page right now: twelve columns, twenty-four pixel gutters, eight pixel baseline. When the rules line up with the headline you are reading, that is the same measurement doing both jobs.

## What to look for when you press it

Watch three things:

- **The headline.** It starts on a column edge, not somewhere near it. The italic accent word is the only thing allowed to break the measure.
- **The specimen plate.** Its corner marks sit exactly on the grid, and its colour chips are laid out on the baseline rather than floated until they looked even.
- **The case-study rows.** The frame on one side and the text on the other share a gutter. When the layout flips on mobile, the gutter survives the flip.

If you shrink the window to phone width the overlay becomes four columns, because four is what the phone layout is actually built on. The rules change with the layout instead of lying about it.

## The honest version

There is one confession to make. The overlay is drawn with fixed-position elements, so it is precise on a desktop viewport and approximate once the page is scrolled a long way. It is a reading aid, not an instrument. But the grid underneath it is real, and it is the reason the page does not fall apart when you resize it.

Press G. Then look at where the lines land.
