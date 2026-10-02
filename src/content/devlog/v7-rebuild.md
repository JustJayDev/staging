---
date: 2026-10-04
project: site
version: "v7"
title: "v7 — the site rebuilt from scratch"
excerpt: "A ground-up rebuild on a new architecture and visual identity. New token system, a real content layer, and type-checking that actually blocks the build."
order: 0
---
The old site had accreted four visual generations on top of each other, each one added as a CSS layer that loaded after the last. This rebuild starts from an empty repository.

Three structural changes matter more than the visuals. First, every string and every dataset now lives in a single content layer that is validated at build time, so copy changes no longer require touching components. Second, the design tokens live in exactly one file with no versioned override layers, which is what caused the previous sprawl. Third, the build now runs the type-checker before bundling — the old pipeline had four type errors sitting in main for months because nothing gated on them.

Motion was cut back hard on purpose. One ambient element on screen at rest, everything else in response to actual input.
