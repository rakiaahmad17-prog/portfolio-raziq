---
title: "Design at 390px first, and mean it"
date: 2026-10-14
tags: [responsive, process]
excerpt: "Most visitors will never see the layout you fell in love with on a 27-inch screen. So the phone version is not a shrunken desktop — it is the original."
---

Every clinic site I have built in Makassar has had the same traffic shape. Most of it comes from a phone, on mobile data, often outdoors, often in a hurry, often with one hand. The desktop layout is the minority case. It is also the one that gets designed first, because it is the comfortable one to look at.

So I build the phone version first and then grow it. Not as a slogan — as an order of operations.

## What designing at 390px actually changes

**The measure comes first.** On a desktop you have room to be vague. At 390 pixels a line of body text is roughly thirty-eight characters, which means every sentence has to earn its place or the paragraph turns into a ladder. I write the copy against that constraint, and the desktop version gets easier because the sentences are already short.

**The tap targets decide the layout.** A 44-pixel minimum is not a nicety at this size; it is the difference between a booking form that gets used and one that gets abandoned on the second field. Rows that are comfortable on desktop become stacked cards, because side-by-side at 390 means side-by-side at 44 pixels each.

**Performance becomes a design decision, not a checklist.** A page that loads on a Makassar 4G connection before it loads on my laptop is the requirement. That means the hero image is sized for a phone and served larger only when the viewport asks for it, and it means the fonts are two families, not five.

## The trap

The trap is designing the desktop version, shrinking it, and calling the result mobile. It always produces the same artefact: a navigation that needs a hamburger but was designed as a row, a table that needs horizontal scrolling, a form that needs a keyboard that covers the submit button.

Designing at 390px first produces something else. It produces a desktop layout that has more room than it needs, which is a much better problem to have.

## Try it

Resize this window slowly from wide to narrow and watch the case-study rows flip, the services stack, and the grid overlay drop from twelve columns to four. Nothing is hidden to make it fit. Everything just re-measured.
