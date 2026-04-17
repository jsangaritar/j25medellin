# CLAUDE.md — J+ Medellin Project

## Project Overview

Web app for "J+" (J+25 Medellin), a faith-based young adult community in Medellin, Colombia. Central hub for events, discipleship courses, and media content (videos, audios, documents). Includes a public-facing site and a protected admin dashboard for content management.

For full technical details (stack, structure, data models, routes, hooks, UI patterns), see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Branding

- The group is called **J+25** but all user-facing copy must say **"J+"**
- Exception: site meta description can reference "J+25"
- Logo: `j25-logo.svg` (white SVG) — used in Header, Footer, favicon
- Language: **Spanish only** (no i18n)
- Theme: **Dark mode only**

## Commands

```bash
pnpm dev              # Start dev server (Vite + API middleware)
pnpm build            # Build for production (tsc + Vite)
pnpm test             # Run tests (Vitest, single pass)
pnpm test:watch       # Run tests in watch mode
pnpm check            # Run Biome lint + format check
pnpm check:fix        # Auto-fix Biome issues
```

## Before Committing

Always run `pnpm check` before committing. If there are fixable issues, run `pnpm check:fix` first.

## Key Quick-Reference

- **5 API endpoints** in `api/` (replicated in `src/vite-api-plugin.ts` for local dev)
- **Firebase Spark (free) plan** — no Cloud Functions, all server logic in Vercel Serverless Functions
- **Admin-only auth** via Firebase Auth — public site is fully open
- **Google Calendar** is the source of truth for event dates
- **Course registration** is transactional (atomic capacity check + enrolled increment + topic duplicate detection)
- **File conventions**: PascalCase components, `use` prefix hooks, types in `src/types/index.ts`, Biome formatting (single quotes, 2-space indent, 80-char lines, always semicolons)
