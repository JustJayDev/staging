---
date: 2026-09-28
project: pixvault
version: "v2.1"
title: "PixVault admin rebuilt as a dashboard"
excerpt: "Upload management, health checks and orphaned-wallpaper recovery in one place instead of a raw admin form."
order: 2
---
The old admin was a form with a table. It is now a dashboard: pending uploads at the top, a health-check row that probes every wallpaper, and automatic recovery of files that were uploaded but never linked.

A health check runs on deploy, so a broken or orphaned wallpaper gets caught before a visitor sees it rather than after.
