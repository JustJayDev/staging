---
date: 2026-09-30
project: vault
version: "v1.4"
title: "Authenticated password-rotate route added to the Vault"
excerpt: "The Vault can now rotate its own admin password through an authenticated route instead of a redeploy."
order: 1
---
Rotating the password previously meant editing configuration and redeploying. The rotate route requires a valid admin session, re-hashes with a fresh salt, and invalidates outstanding sessions on success.

Also in this pass: softened the console aurora, and added reduced-motion and focus-visible handling across the Vault UI.
