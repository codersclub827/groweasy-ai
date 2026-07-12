# Deployment Guide

## Production Checks

Run these before every deployment:

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` locally and configure hosting provider variables in production.

Required for AI mapping:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Frontend:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_API_URL`

Backend:

- `API_PORT` or platform `PORT`
- `API_CORS_ORIGIN`

## Docker

Build and run both services:

```bash
docker compose up --build
```

Web: `http://localhost:3000`

API: `http://localhost:4000`

Build individual images:

```bash
docker build --target web -t groweasy-web .
docker build --target api -t groweasy-api .
```

## Vercel

Use Vercel for the Next.js frontend.

1. Import the repository.
2. Keep the root directory as the repository root.
3. Vercel will use `vercel.json`.
4. Add `NEXT_PUBLIC_API_URL` pointing to the deployed API URL.
5. Deploy.

## Render

Use `render.yaml` to create two Docker web services:

- `groweasy-api`
- `groweasy-web`

Set these Render environment variables:

- API service: `API_CORS_ORIGIN`, `GEMINI_API_KEY`, `GEMINI_MODEL`
- Web service: `NEXT_PUBLIC_API_URL`

Render provides `PORT`; the API also supports `API_PORT`.

## GitHub Actions

The CI workflow runs:

- Install
- Typecheck
- Lint
- Format check
- Web build
- API build

Workflow file: `.github/workflows/ci.yml`
