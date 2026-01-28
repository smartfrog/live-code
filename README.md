# Live Code

Monorepo React + Express + TypeScript, deployed on Railway.

## Structure

```
apps/
  backend/    Express API (serves frontend)
  frontend/   React SPA
```

## Dev

```bash
# Backend
cd apps/backend && npm install && npm run dev

# Frontend (separate terminal)
cd apps/frontend && npm install && npm run dev
```

## Docker

```bash
docker-compose up --build
# http://localhost:3001
```

## Deploy

Push to `main` triggers automatic deployment to Railway.

## GitHub Secrets

| Secret | Description |
|--------|-------------|
| `RAILWAY_TOKEN` | Railway CLI token |
| `OPENCODE_API_KEY` | OpenRouter API key |
