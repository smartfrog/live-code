# AGENTS.md - Coding Agent Guidelines for Live Code

## Project Overview

Monorepo with React frontend + Express backend, deployed on Railway via Docker.
Single app architecture: Backend serves both API endpoints and frontend static files.

## Repository Structure

```
live-code/
├── apps/
│   ├── backend/          # Express API (serves frontend static files)
│   │   ├── src/
│   │   │   ├── index.ts       # Main server entry point
│   │   │   └── *.test.ts      # Test files (colocated)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── eslint.config.js
│   └── frontend/         # React SPA (Vite)
│       ├── src/
│       │   ├── main.tsx       # React entry point
│       │   ├── App.tsx        # Main component
│       │   └── App.css        # Styles
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── eslint.config.js
├── .github/workflows/    # CI/CD
├── Dockerfile            # Multi-stage build (frontend + backend)
└── railway.json          # Railway deployment config
```

---

## Build / Lint / Test Commands

### Root (Full App)

```bash
# Install all dependencies (backend + frontend)
npm install

# Development (backend + frontend in parallel)
npm run dev

# Build all
npm run build

# Lint all
npm run lint

# Typecheck all
npm run typecheck

# Run tests (backend only)
npm run test
```

### Backend (`apps/backend/`)

```bash
cd apps/backend

# Install dependencies
npm install

# Development (hot reload)
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Run all tests
npm run test

# Run a single test file
npx vitest run src/index.test.ts

# Run tests matching a pattern
npx vitest run -t "should pass"

# Watch mode
npx vitest
```

### Frontend (`apps/frontend/`)

```bash
cd apps/frontend

# Install dependencies
npm install

# Development server (with API proxy to backend)
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Preview production build
npm run preview
```

---

## Code Style Guidelines

### Language & General

- **Language**: All code, comments, and commit messages in English
- **Module system**: ES Modules (`"type": "module"` in package.json)
- **Target**: ES2022 for backend, ES2020 for frontend
- **Strict mode**: TypeScript strict mode enabled

### Imports

Order imports as follows (separated by blank lines):
1. Node.js built-in modules
2. External dependencies
3. Internal modules
4. Types (if separate)

```typescript
// Good
import path from "path";
import { fileURLToPath } from "url";

import express, { Request, Response } from "express";

import { myUtil } from "./utils.js";
```

### TypeScript

- **Strict typing**: Avoid `any`, use proper types
- **Interfaces over types**: Prefer `interface` for object shapes
- **Explicit return types**: Optional but recommended for public functions
- **Unused variables**: Prefix with underscore `_req` to ignore

```typescript
// Good - unused parameter prefixed with _
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `user-service.ts` |
| Variables/Functions | camelCase | `getUserById` |
| Classes/Interfaces | PascalCase | `ApiResponse` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Test files | `*.test.ts` | `index.test.ts` |

### React (Frontend)

- **Functional components**: No class components
- **Hooks**: Follow rules of hooks (enforced by ESLint)
- **State**: Use `useState` for local state
- **Effects**: Use `useEffect` with proper dependencies

```typescript
// Good
function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return <div>{data?.message}</div>;
}
```

### Error Handling

- **Backend**: Return appropriate HTTP status codes
- **Frontend**: Catch errors and display user-friendly messages
- **Never swallow errors**: Always log or handle appropriately

```typescript
// Backend - explicit error responses
app.get("/api/resource", async (req, res) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Frontend - catch and display
fetch("/api/data")
  .then(res => res.json())
  .catch(err => setError(err.message));
```

---

## Testing Guidelines

### Test Framework

- **Backend**: Vitest
- **Test location**: Colocate tests with source files (`src/index.test.ts`)

### Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("FeatureName", () => {
  it("should do something specific", () => {
    expect(result).toBe(expected);
  });
});
```

### Running Specific Tests

```bash
# Single file
npx vitest run src/index.test.ts

# By test name pattern
npx vitest run -t "should return ok"

# Watch mode for TDD
npx vitest
```

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

On push/PR to `main`:
1. **Backend**: `npm install` → `typecheck` → `lint` → `test`
2. **Frontend**: `npm install` → `typecheck` → `lint`

### Deployment

- **Platform**: Railway (auto-deploy on push to `main`)
- **Build**: Docker multi-stage (see `Dockerfile`)
- **No manual deploy workflow**: Railway handles deployment automatically

---

## Important Notes for Agents

1. **Single app architecture**: Backend serves frontend static files. No separate deployments.

2. **API routes**: All API endpoints under `/api/*`. Frontend uses relative URLs (`/api/health`).

3. **Port handling**: Use `process.env.PORT` (Railway injects this). Default to `3001` for local dev.

4. **Frontend path**: In production, frontend is served from `../../frontend/dist` relative to backend `dist/`.

5. **No package-lock.json**: Using `npm install` (not `npm ci`). Don't commit lock files.

6. **Vitest for testing**: Not Jest. Use `vitest` imports.

7. **ESLint flat config**: Using new `eslint.config.js` format, not `.eslintrc`.
