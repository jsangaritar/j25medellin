# J+ Medellin

Web application for the J+ (25+) community in Medellin, Colombia. A central hub for events, discipleship courses, and media content.

## Tech Stack

- **Frontend:** React 19 + Vite 7 + TypeScript + Tailwind CSS v4
- **Backend:** Strapi 5 (headless CMS)
- **Data fetching:** TanStack Query v5
- **Routing:** React Router v7
- **Linting/Formatting:** Biome
- **Testing:** Vitest + React Testing Library

## Prerequisites

- Node.js >= 20
- pnpm >= 9

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit .env files with your values

# Start both frontend and backend
pnpm dev:all

# Or run separately:
pnpm dev          # Frontend only (http://localhost:5173)
pnpm dev:backend  # Backend only (http://localhost:1337)
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start frontend dev server |
| `pnpm dev:backend` | Start Strapi backend |
| `pnpm dev:all` | Start both in parallel |
| `pnpm build` | Build frontend for production |
| `pnpm build:backend` | Build Strapi for production |
| `pnpm test` | Run frontend tests |
| `pnpm check` | Run Biome linting |
| `pnpm check:fix` | Auto-fix lint issues |

## Project Structure

```
j25medellin/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── api/       # API client & endpoint functions
│   │   ├── components/
│   │   │   ├── ui/        # Design system primitives
│   │   │   ├── layout/    # Header, Footer, PageBanner
│   │   │   └── features/  # Feature-specific components
│   │   ├── hooks/     # TanStack Query hooks
│   │   ├── pages/     # Route-level page components
│   │   ├── types/     # TypeScript types
│   │   └── utils/     # Utility functions
│   └── vercel.json    # Vercel deployment config
├── backend/           # Strapi 5 CMS
│   └── src/api/       # Content types & custom routes
└── biome.json         # Shared Biome config
```

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Strapi API base URL (default: `http://localhost:1337`) |
| `VITE_SITE_URL` | Public site URL for OG tags |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `HOST` | Server host (default: `0.0.0.0`) |
| `PORT` | Server port (default: `1337`) |
| `APP_KEYS` | Application security keys |
| `GOOGLE_CALENDAR_URL` | Public Google Calendar iCal feed |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `FRONTEND_URL` | Frontend URL for CORS config |

## Deployment

### Frontend (Vercel)

The frontend includes a `vercel.json` with SPA rewrites. Set `VITE_API_URL` to your production Strapi URL in Vercel environment variables.

### Backend (Railway)

Deploy Strapi to Railway with a PostgreSQL addon for production. Set all environment variables from `backend/.env.example`.
