# GrowEasy AI CSV Importer

Production-ready monorepo for a premium AI-assisted CSV importer.

## Stack

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui-style components
- Express
- Gemini API
- PapaParse
- TanStack Table

## Apps

- `apps/web` - Next.js dashboard, upload, preview, progress, and results UI.
- `apps/api` - Express API for preview, confirmation, validation, and Gemini CRM mapping.
- `packages/types` - Shared TypeScript contracts.

## Scripts

```bash
npm run dev
npm run dev:web
npm run dev:api
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Environment

Create `.env` from `.env.example`.

```bash
cp .env.example .env
```

Important variables:

- `NEXT_PUBLIC_API_URL`
- `API_CORS_ORIGIN`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

## Local Production With Docker

```bash
docker compose up --build
```

Web: `http://localhost:3000`

API: `http://localhost:4000`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Docker, Vercel, Render, and GitHub Actions instructions.

## CI

GitHub Actions runs typecheck, lint, formatting, and production builds for web and API.
