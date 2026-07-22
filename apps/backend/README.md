# backend

Fastify API for a personal yearly budget-and-spending tracker. Implements the spec in [.specs/initial-server-implementation-mvp.md](.specs/initial-server-implementation-mvp.md) (see also [.specs/list-filters.md](.specs/list-filters.md) and [.specs/email-sender.md](.specs/email-sender.md)).

## Stack

- Node.js v24 (native TypeScript type stripping — `.ts` files run directly, no transpiler in dev/test)
- Fastify 5, `@fastify/cookie`, `@fastify/cors`, Prisma ORM 6, PostgreSQL, Zod 4, JWT (`jsonwebtoken`)
- Native `node:test` runner

## Getting started

```sh
pnpm install                      # generates the Prisma client via postinstall
pnpm docker:infra:up              # starts postgres via docker compose
pnpm docker:infra:db-migrate      # applies migrations
pnpm dev                          # starts the API with --watch on http://localhost:3333
```

Environment variables live in `.env` (see `.env.example`), including `APP_URL` (used for the CORS origin) and `COOKIE_SECURE`.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the server in watch mode |
| `pnpm build` | Generate Prisma client and compile to `dist/` |
| `pnpm start` | Run the compiled server |
| `pnpm test` | Unit tests (in-memory repositories, no database needed) |
| `pnpm test:e2e` | End-to-end user journey against postgres (`e2e` schema) — requires `pnpm docker:infra:up` |
| `pnpm check-types` | Type-check without emitting |
| `pnpm docker:infra:up` / `down` / `cleanup` | Manage the local Postgres container |
| `pnpm docker:infra:db-generate` / `db-migrate` | Prisma client generation / migrations |

## Architecture

Layered architecture with constructor-based dependency injection. Each module wires its own dependency graph in a `container.ts` (e.g. [src/modules/auth/container.ts](src/modules/auth/container.ts)), and [src/app.ts](src/app.ts) composes the module containers and registers their routes on the Fastify instance:

```
http/routes → http/controllers → http/use-cases   ← cross-service orchestration happens here
        │
services → repositories (interfaces) → prisma implementations
        │
domain (entities, errors)
```

- Modules: `auth`, `categories`, `transactions`, `loans`.
- Every service error implements the `IAppError` interface from `src/shared/errors`; the single `error.middleware` maps them to `{ "error": "message" }` responses.
- CORS is configured from `APP_URL` with an explicit `methods` list (`GET, HEAD, POST, PUT, PATCH, DELETE`) — `@fastify/cors` otherwise defaults preflight responses to `GET,HEAD,POST` regardless of the route, which silently breaks `PATCH`/`DELETE` calls from the browser.
- All endpoints except `POST /auth/signup`, `POST /auth/signin`, `POST /auth/verify-email`, `POST /auth/refresh`, `POST /auth/forgot-password` and `POST /auth/reset-password` require authentication.

## Auth flow (MVP notes)

Authentication is cookie-based: `POST /auth/signin` (and `/auth/refresh`) set two `httpOnly` cookies — `accessToken` and `refreshToken` (see [src/modules/auth/http/auth-cookie.ts](src/modules/auth/http/auth-cookie.ts)). The auth middleware also accepts a `Bearer` token in the `Authorization` header as a fallback.

1. `POST /auth/signup` → returns the created user **and the email verification token in the response body** (a real email provider is configured via `SMTP_*` env vars; see `.specs/email-sender.md`).
2. `POST /auth/verify-email` with `{ "token": "..." }`.
3. `POST /auth/signin` → sets the auth cookies (fails with 403 until the email is verified).
4. `POST /auth/refresh` → rotates the access/refresh token pair using the refresh token cookie.
5. `POST /auth/signout` revokes the access token's `jti` in an **in-memory denylist** (`InMemoryTokenDenylist`) — revocations reset on server restart; swap in a persistent store to harden.
6. `POST /auth/forgot-password` / `POST /auth/reset-password` for the password reset flow.
7. `GET|PATCH|DELETE /auth/me` for reading/updating/deleting the current user.
