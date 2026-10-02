---
date: 2026-09-14
project: vault
version: "v1.0"
title: "Developer Vault — the credential control plane"
excerpt: "One secure backend holding every project secret, so no API key ever has to live in a browser bundle."
order: 7
---
The problem it solves is architectural, not cosmetic. GitHub Pages is static hosting, so anything secret that reaches the browser is already public. The Vault keeps keys encrypted at rest and decrypts them only inside the worker, for approved operations only.

The console UI got visual toggles, project tabs, and self-explanatory credential entries in a later pass.
