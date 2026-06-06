# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing website for **YANAGAWA BANKSY**, a MIX BAR in Yanagawa, Fukuoka, Japan. It is a GitHub Pages site served from the repo root at `https://banksy-s2.github.io/`. There is **no build step, framework, package manager, or test suite** — plain hand-written HTML, CSS, and vanilla JS. Pushing to the default branch (`main`) publishes the live site, so treat `main` as production.

Content is Japanese-first; commit messages in this repo are written in Japanese with a type prefix (`Fix:`, `Add:`, `Refine:`, `URL migration:`).

## Local preview

No tooling required. Serve the directory and open a page:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000/
```

Useful URL params for development (handled in `script.js`):
- `?nl` — skips the opening loader animation (intended for screenshots).
- `?live=1` / `?live=0` — force the TikTok LIVE banner on/off regardless of schedule.

## Page structure

The site is a set of standalone HTML files; there are no shared partials, so each page carries its own `<head>` (analytics, meta, hreflang, JSON-LD) inline.

- `index.html` — primary Japanese page and the only one that loads `script.js`. By far the largest/richest page (full sections + many JSON-LD blocks).
- `index-en.html`, `index-zh.html` (zh-CN), `index-tw.html` (zh-TW), `index-ko.html` — translated variants of the homepage. They share `styles.css` but are mostly-static (no `script.js`).
- `guide.html`, `champagne.html`, `ladies.html` — Japanese long-form SEO article pages.
- `googlece4125260df2cde1.html` — Google Search Console site-verification file. Do not rename or delete.

All pages share `styles.css` (one large file, divided into sections by `/* ==== */` banner comments) and load **GA4 `G-PSTJRFPBBK`** + **Microsoft Clarity `x25u7n0b42`**. Keep those IDs consistent when adding pages.

## script.js (index.html only)

A single `DOMContentLoaded` block implementing the "luxury" interactions: opening loader, custom cursor, magnetic buttons, parallax, split-text animation, count-up, scroll reveal, and the mobile menu. Two things are config-edited directly in the source:
- **`LIVE_SCHEDULE`** array near the top — defines weekly TikTok LIVE time windows (`day` 0=Sun..6=Sat, `start`/`end` as `"HH:MM"`); overnight windows must be split across two entries. This drives the LIVE banner.
- **Cast photos** use `.cast-photo[data-img]`; the script verifies the image loads and otherwise falls back to an initials placeholder, so a missing `images/cast/*.jpg` degrades gracefully.

## SEO is a primary concern, and facts are duplicated

This site is heavily optimized for search and AI answer engines, so the same business facts live in **many places at once**. When you change any business fact — prices, opening hours, closed day, address, cast roster, SNS handles, anniversary date — update **all** of these so they don't drift:

1. Visible HTML copy on the affected page(s).
2. The page's JSON-LD `<script type="application/ld+json">` blocks. `index.html` alone contains `LocalBusiness`/`NightClub`, `WebSite`, `BreadcrumbList`, `Menu` (with per-item `Offer` prices), `Event`, `ItemList`, `Person`, `HowTo`, and `FAQPage`.
3. `<meta name="description">` and the `og:`/Twitter card tags in the `<head>`.
4. `llms.txt` — a structured Q&A/fact sheet written for AI crawlers (mirrors prices, hours, cast, recruiting info). Update it whenever the canonical facts change.
5. Every **language variant** of the homepage, not just `index.html`.

Other SEO infrastructure to keep in sync: `sitemap.xml` (list every public page), `robots.txt` (intentionally allows AI crawlers — GPTBot, ClaudeBot, PerplexityBot, CCBot, etc.), the `hreflang` alternate cluster + `rel=canonical` in each homepage variant, `og-image.jpg` (1200×630), and `favicon.svg`.

When validating structured-data changes, parse every JSON-LD block (e.g. extract `application/ld+json` script contents and `json.loads` each) — a syntax error silently disables that block in search.

## Canonical facts (current)

Source of truth is `llms.txt`; summarized here for quick reference. Verify against `llms.txt` before relying on these.

- Address: 福岡県柳川市三橋町24-3 1階 (〒832-0814), 20 sec walk from Yanagawa Station.
- Hours: 21:00–LAST, **closed Wednesdays**. Opened Aug 2024 (2nd anniversary Aug 2026).
- Set 60 min (drinks included): men ¥2,900 / women ¥2,000. Extension 30 min ¥1,500, nomination ¥1,000, +¥1,000 beer/highball all-you-can-drink, karaoke ¥200/song. TAX 10% extra. Cash + card (no fee).
- SNS: Instagram `@banksy.s2`, TikTok `@yanagawa.banksy`, BASE shop `banksybanksy.base.shop`.

## Images

`images/` is grouped by purpose: `cast/`, `store/`, `logo/`, `art/`, `video/` (contains `recruit.mp4`). Cast photos are referenced via `data-img` (see script.js note above).
