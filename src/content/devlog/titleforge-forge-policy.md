---
date: 2026-09-26
project: titleforge
version: "v1.2"
title: "TitleForge forge proxy + title:forge policy live in the Vault"
excerpt: "The AI key now decrypts inside the Vault under a scoped policy. It has never been in the repo or the browser bundle."
order: 3
---
The architecture is deliberately one-directional: the browser sends video metadata to the Vault, the Vault calls the AI provider, and the key decrypts and dies inside the worker. Nothing sensitive is ever returned to the client.

The policy is least-privilege — TitleForge can be granted title_forge and nothing else. Tokens are scoped, expire in an hour, and live only in JavaScript memory.

The OAuth flow also got fixed: a pending authorisation now resumes correctly when the admin is already signed in, instead of dropping the user into a 401.
