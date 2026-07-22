# Financial App

A personal yearly budget-and-spending tracker, split into a Fastify API and a Next.js frontend, managed as a pnpm/Turborepo monorepo.

## What's inside?

### Apps

- [`apps/backend`](apps/backend) — Fastify API (Node 24, Prisma/PostgreSQL, JWT auth). See [apps/backend/README.md](apps/backend/README.md).
- [`apps/web`](apps/web) — Next.js frontend (React 19, TanStack Query, Zustand, Tailwind v4). See [apps/web/README.md](apps/web/README.md).

### Packages

- [`@repo/ui`](packages/ui) — shared React component library.
- [`@repo/eslint-config`](packages/eslint-config) — shared eslint configs.
- [`@repo/typescript-config`](packages/typescript-config) — shared `tsconfig.json`s.

Everything is TypeScript.

## Requirements

- Node.js >= 24
- pnpm 9 (`packageManager` is pinned in `package.json`)
- Docker (for the local Postgres instance used by the backend)

## Getting started

```sh
pnpm install                # installs all workspaces, generates the Prisma client
pnpm docker:infra:up        # starts postgres for the backend
pnpm docker:infra:db-migrate

pnpm dev:all                # runs backend (http://localhost:3333) and web (http://localhost:3000) together
```

Backend environment variables live in `apps/backend/.env` (see `apps/backend/.env.example`). The web app reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3333`).

## Scripts

Run from the repo root; each forwards to Turborepo with a filter where relevant.

| Script | Description |
| --- | --- |
| `pnpm dev` / `pnpm dev:all` | Run all apps in dev mode (`dev:all` runs them in parallel) |
| `pnpm dev:backend` / `pnpm dev:web` | Run a single app in dev mode |
| `pnpm build` | Build all apps and packages |
| `pnpm build:backend` / `pnpm build:web` | Build a single app |
| `pnpm test:backend` | Run backend unit tests |
| `pnpm test:e2e:backend` | Run backend e2e tests (requires `pnpm docker:infra:up`) |
| `pnpm lint` / `pnpm lint:backend` / `pnpm lint:web` | Lint all or one workspace |
| `pnpm check-types` | Type-check all workspaces |
| `pnpm format` | Format the repo with Prettier |
| `pnpm docker:infra:up` / `down` / `cleanup` | Manage the backend's local Postgres container |
| `pnpm docker:infra:db-generate` / `db-migrate` | Prisma client generation / migrations |

## Useful links

- [Turborepo docs](https://turborepo.dev/docs)
- [Backend README](apps/backend/README.md) — architecture, auth flow, module layout
- [Web README](apps/web/README.md) — frontend stack and structure
