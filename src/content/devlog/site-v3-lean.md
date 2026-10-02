---
date: 2026-08-31
project: site
version: "v3"
title: "The lean rebuild — 16 pages down to 3"
excerpt: "Home, Games and About. Every page lazy-loaded, Firebase and thirteen unused pages removed."
order: 11
---
Sixteen routes were carrying a single JavaScript bundle. The rebuild kept three pages that were actually used and code-split them, so the browser only downloads the page you open.

Same URL, same QR code, a fraction of the weight.
