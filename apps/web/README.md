# web

Next.js frontend for the financial-app budget-and-spending tracker. Implements the spec in [.specs/initial-web-implementation-mvp.md](.specs/initial-web-implementation-mvp.md).

## Stack

- Next.js 16 (App Router), React 19
- TanStack Query for server state, Zustand for client state
- React Hook Form + Zod for forms/validation
- Radix UI primitives, Tailwind CSS v4, `class-variance-authority`
- Axios HTTP client with automatic access-token refresh (`src/shared/infra/http/client.ts`)

## Getting started

The API (`apps/backend`) must be running — see [its README](../backend/README.md). By default the app talks to `http://localhost:3333`; override with `NEXT_PUBLIC_API_URL` if needed.

```sh
pnpm install
pnpm dev        # starts on http://localhost:3000
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |
| `pnpm check-types` | Generate Next.js types and type-check without emitting |

## Structure

```
src/
  app/
    (auth-pages)/     sign in, sign up, verify email, etc.
    (protected-pages)/ categories, transactions, loans, profile
  modules/
    auth/ categories/ transactions/ loans/
      api/        query hooks and HTTP calls per module
      components/ module-specific UI
      features/   page-level feature components
      types/      module DTOs/schemas
  shared/
    components/   shared UI (shadcn/ui-based)
    infra/http/   axios client, auth refresh interceptor
    config/       env parsing (zod)
    lib/          general utilities
```

Locale/currency is pt-BR/BRL throughout the UI.
