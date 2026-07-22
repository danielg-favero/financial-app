# Initial Server Implementation MVP

Initial setup of a personal yearly budget-and-spending tracker api.

## Goal

Implementation of a Fastify api for a personal yearly budget-and-spending tracker using Node and Typescript. At the end of the MVP implementation, the user must be able to register, login, verify email, logout and use all the other features.

## Specifications

### Endpoints

Auth — public: `POST /auth/signup`, `POST /auth/signin`, `POST /auth/refresh`, `POST /auth/verify-email`, `POST /auth/forgot-password`, `POST /auth/reset-password`. The rest require authentication.

- `POST /auth/signup` -> Register the user (returns the created user and the `verificationToken`; also emails a verification link — see `.specs/email-sender.md`)
- `POST /auth/signin` -> Login from email + password. On success, sets `accessToken` and `refreshToken` `httpOnly` cookies (rejected with `EmailNotVerifiedError` until the email is verified)
- `POST /auth/refresh` -> Rotate the access/refresh token pair from the `refreshToken` cookie
- `POST /auth/verify-email` -> Verify the user email using the token issued at signup
- `POST /auth/forgot-password` -> Issue a password reset token and email a reset link (always responds `204`, whether or not the email exists)
- `POST /auth/reset-password` -> Reset the password using the reset token
- `POST /auth/signout` -> Logout: revokes the current access token's `jti` (denylist) and the refresh token, and clears the auth cookies
- `GET /auth/me` -> Get the authenticated user profile
- `PATCH /auth/me` -> Update the authenticated user profile (name / password)
- `DELETE /auth/me` -> Delete the authenticated user account

Transactions, Categories and Loans (all require authentication and are scoped to the authenticated user). Each resource exposes the same CRUD shape, where **create and delete are bulk-first** (see `.specs/list-filters.md` for the list contract and the bulk conventions below):

- `GET /<resource>` -> List with pagination, search, sort and a structured `filters` query param
- `GET /<resource>/:id` -> Get a single record
- `POST /<resource>` -> **Bulk create** from a JSON array body; returns `{ created, failed }` (best-effort per item)
- `PATCH /<resource>/:id` -> Update a single record
- `DELETE /<resource>` -> **Bulk delete** from a `{ "ids": [...] }` body; returns `{ deleted, failed }` (best-effort per item)

`<resource>` is `transactions`, `categories` or `loans`. Registering a loan payment reuses `PATCH /loans/:id` with an `amountReceived` field — the service recomputes `openBalance` and `isPaid`.

Any unmatched route is handled by a custom not-found handler returning `{ "error": "Route <METHOD> <URL> not found" }` with status `404`.

#### Bulk create / delete contract

Bulk operations are best-effort: each element is processed independently so a single invalid item never fails the whole batch.

- **Create** takes a JSON **array** body and returns `{ "created": [...], "failed": [{ "index", "error" }] }`.
- **Delete** takes a `{ "ids": [...] }` body and returns `{ "deleted": [...ids], "failed": [{ "id", "error" }] }`.
- `failed[].error` carries the same error identifier the single-item `{ error }` contract uses, so a client can translate it to a user-facing message.

The shared result shapes live in `src/shared/http/bulk-result.ts` (`IBulkCreateResult`, `IBulkDeleteResult`).

### Auth

Authentication is **cookie-based** with a Bearer fallback. Protected endpoints are guarded by the `AuthMiddleware` (`onRequest` hook) registered on the protected route scopes; it reads the `accessToken` cookie, or an `Authorization: Bearer` header if the cookie is absent.

- Users register with `email`, `password`, `firstName` and `lastName`. Passwords are hashed with Node's `scrypt` (`ScryptPasswordHasher`) and validated against a `PasswordPolicy` provider.
- Sign up returns a one-time `verificationToken` (random 32-byte hex). The user must call `POST /auth/verify-email` with that token before the account is considered verified. Sign in is rejected with `EmailNotVerifiedError` until the email is verified.
- Sign in issues a short-lived **access token** JWT (`jsonwebtoken`, payload carries `userId` + a unique `jti`) and a long-lived **refresh token**, both set as `httpOnly` cookies (`src/modules/auth/http/auth-cookie.ts`). Refresh tokens are persisted **hashed** (`RefreshToken` model + `IRefreshTokenRepository`).
- `POST /auth/refresh` rotates the pair: the presented refresh token is verified against its stored hash, revoked, and a fresh access/refresh pair is issued.
- Sign out adds the access token `jti` to a denylist (`ITokenDenylist`, in-memory implementation) until its natural expiration and revokes the refresh token, so both are rejected afterwards.
- Password reset: `POST /auth/forgot-password` stores a hashed `passwordResetToken` (+ `passwordResetTokenExpiresAt`) and emails a reset link; `POST /auth/reset-password` consumes it. To avoid account enumeration, `forgot-password` responds identically whether or not the email exists.
- The middleware decorates the request with `userId`, `tokenJti` and `tokenExpiresAt`, which downstream controllers/use-cases use to scope data and revoke tokens.

### Project architecture

The project follows a layered, dependency-injected, module-oriented architecture. Each feature is a self-contained **module** under `src/modules/` that wires its own dependencies through a `container.ts` and exposes a Fastify plugin (`routes`).

Request flow per module:

```
route  ->  controller  ->  use-case  ->  service  ->  repository
```

- **Routes** register the HTTP verbs/paths and attach the auth hook where needed.
- **Controllers** parse/validate input with Zod schemas, invoke the use-case, and serialize output through a **presenter**.
- **Use-cases** orchestrate one or more **services** (including services from other modules) to fulfill an application operation.
- **Services** hold the domain logic and depend only on repository/provider interfaces.
- **Repositories** are interfaces with a Prisma implementation (`Prisma*Repository`) and an in-memory implementation used in tests.

Dependency injection:

- Each module exposes a `Container` class that instantiates its providers, services, use-cases and controller from injected dependencies.
- `buildApp()` (in `src/app.ts`) receives the repositories + auth config, constructs every container, wires cross-module dependencies, registers the error handler and the module route plugins, and returns the `FastifyInstance`.
- Cross-module communication happens at the use-case level. Example: creating/updating a transaction uses the categories module's `GetCategoryService`; deleting a category checks the transactions module's `ListTransactionsService`. The categories <-> transactions construction cycle is broken by passing `listTransactionsService` lazily as a factory.
- `src/server.ts` is the composition root for production: it builds the `DBConnection`, creates the Prisma repositories, calls `buildApp()`, and handles startup/graceful shutdown (SIGINT/SIGTERM).

### Folder structure

Actual structure produced for the MVP. Every module follows the same internal layout.

```
src/
├── modules/
│ ├── auth/
│ │ ├── container.ts
│ │ ├── domain/
│ │ │ ├── entities/            # User, RefreshToken
│ │ │ └── errors/              # EmailAlreadyInUse, EmailNotVerified, InvalidCredentials, InvalidToken, InvalidVerificationToken, InvalidResetToken, InvalidPassword, PasswordsDontMatch, UserNotFound
│ │ ├── dtos/                  # CreateUser, SignIn, AuthToken, VerifyEmail, refresh/reset/update-profile ...
│ │ ├── http/
│ │ │ ├── auth-cookie.ts       # set/clear the accessToken + refreshToken httpOnly cookies
│ │ │ ├── controllers/         # auth.controller.ts
│ │ │ ├── presenters/          # user.presenter.ts
│ │ │ ├── routes/              # auth.routes.ts (public scope + protected scope)
│ │ │ ├── schemas/             # auth.schemas.ts (Zod)
│ │ │ └── use-cases/           # register/login/logout/refresh/verify-email/forgot+reset-password/get+update+delete profile
│ │ ├── middlewares/           # auth.middleware.ts (cookie/bearer guard)
│ │ ├── providers/             # password-hasher, password-policy, token, refresh-token, token-denylist
│ │ ├── repositories/          # user + refresh-token (interfaces) + prisma implementations
│ │ └── services/              # one per auth operation
│ ├── transactions/            # same layout (+ list-transactions-filter dto)
│ ├── categories/              # same layout
│ └── loans/                   # same layout
├── shared/
│ ├── config/                  # env.ts (Zod-validated environment)
│ ├── database/                # db-connection.ts, prisma-repositories.ts
│ ├── email/                   # email-sender.provider.ts + templates/ (see .specs/email-sender.md)
│ ├── errors/                  # app-error.ts + BadRequest, Conflict, Forbidden, NotFound, Unauthorized
│ ├── filters/                 # filter/filter-params/filtered-result + listFilters() (see .specs/list-filters.md)
│ └── http/
│   ├── bulk-result.ts         # IBulkCreateResult / IBulkDeleteResult
│   ├── middlewares/           # error.middleware.ts
│   └── schemas/               # common.schemas.ts (idParams, idsBody), filters.schemas.ts
├── generated/prisma/          # Prisma client generated as TS/ESM (committed)
├── app.ts                     # buildApp(): DI wiring + Fastify instance
└── server.ts                  # production composition root + lifecycle

prisma/
├── schema.prisma
└── migrations/

test/
├── unit/                      # per-module unit tests using in-memory repositories
├── e2e/                       # user-journey.test.ts against a real Postgres schema
└── helpers/                   # build-test-app.ts, in-memory-repositories.ts
```

Note: the originally proposed top-level `application/use-cases` and `transport/http` folders were replaced by per-module `http/use-cases` and per-module `http/` route/controller layers, keeping each feature self-contained.

### Data model (Prisma)

- **User**: `id` (uuid), `email` (unique), `passwordHash`, `emailVerified`, `firstName`, `lastName`, `verificationToken` (unique, nullable), `passwordResetToken` (unique, nullable) + `passwordResetTokenExpiresAt`, timestamps.
- **RefreshToken**: `id`, `userId`, `tokenHash` (unique), `expiresAt`, `revokedAt` (nullable), `createdAt`. Cascades with its `User`.
- **Category**: `id`, `userId`, optional `parentId` (self-relation `CategoryChildren`, `onDelete: SetNull`), `name`, `type` (`RECEITA | INVESTIMENTO | DESPESA`), optional `expenseKind` (`FIXA | VARIAVEL`), timestamps.
- **Transaction**: `id`, `userId`, `categoryId` (`onDelete: Restrict`), optional `description`, `amount` (`Decimal(12,2)`), `referenceMonth`/`referenceYear` (SmallInt), `transactionDate` (Date), timestamps.
- **Loan**: `id`, `userId`, `loanDate` (Date), `personName`, `description`, `amountLent`, `amountReceived` (default 0), `openBalance`, `isPaid` (default false), all money as `Decimal(12,2)`, timestamps.

All child records cascade-delete with their `User`. The Prisma client is generated to `src/generated/prisma` (`prisma-client` generator, ESM, `.ts` output) and committed.

### Error handling

All domain/application errors extend the shared `AppError` (`src/shared/errors/app-error.ts`), which carries a `message` and a `statusCode`. Common HTTP errors are provided as subclasses in `shared/errors`: `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409). Module-specific errors extend these (e.g. `EmailAlreadyInUseError`, `CategoryNotFoundError`).

A single `ErrorMiddleware` registered via `app.setErrorHandler` is the only failpoint and normalizes every error to:

```json
{
  "error": "message"
}
```

Resolution order:

1. `AppError` -> its `statusCode` + `message`.
2. `ZodError` -> `400` with the first issue formatted as `path: message`.
3. Any error carrying a 4xx `statusCode` -> that status + message.
4. Anything else -> logged and returned as `500 { "error": "Internal server error" }`.

## Tasks

- [x] Create a Fastify app with NodeJS, Typescript and add scripts to dev, build and test
- [x] Create a docker-compose.yaml file for the postgres database
- [x] Create a DBConnection class to instantiate the db connection
- [x] Create a shared folder with the error interface and common errors (404, 400, etc.)
- [x] Create a auth, transaction, category and loan modules
- [x] Create a prisma schema for the User, Transaction, Category and Loan entities
- [x] Create a repository for each entity (interface + Prisma + in-memory implementations)
- [x] Create a service for each use-case
- [x] Create a use-case + controller for each endpoint
- [x] Create a route for each endpoint
- [x] Create unit tests for each module (in-memory repositories)
- [x] Add a single error middleware wired through `setErrorHandler`
- [x] Create e2e test for the full user journey (real Postgres)

## Scripts

- `dev` -> `node --import tsx --watch src/server.ts` (loads `.env` if present)
- `build` -> `prisma generate && tsup` (+ copies the Prisma query engine into `dist/`)
- `start` -> run the built server from `dist/`
- `check-types` -> `tsc --noEmit`
- `test` -> Node native test runner over `test/unit/**/*.test.ts`
- `test:e2e` -> `prisma db push` to an `e2e` schema, then run `test/e2e/**/*.test.ts`
- `db:up` / `db:generate` / `db:migrate` -> docker compose up, `prisma generate`, `prisma migrate dev`

## Constitution

### Restrictions

- Don't use `any` or `unkown`
- Don't use `let` or `var`
- Don't mofify `INITIAL.md` and `schema.drawio`
- Do create a interface with `I` prefix (e.g. `ICreateUserDTO`)
- Do use classes to create Services, UseCases, Controllers, Repositories, etc.
- Don't make assumptions, always ask for clarification
- Do use context7 for documentation search

### Tech Stack

- Node v24.16.0 (native TypeScript support; `>=24` enforced in `package.json`)
- PrismaORM (`prisma` / `@prisma/client`, client generated to `src/generated/prisma`)
- Fastify 5
- TypeScript 5.9 (path alias `@/*` -> `src/*`)
- `tsx` (dev/watch + test runner loader), `tsup` (build)
- Node's native test runner (`node --test`)
- PostgreSQL 17
- Zod 4 (request + env validation)
- `jsonwebtoken` (JWT auth)
- Docker + Docker Compose

## Docs

- [How it's done today](../INITIAL.md)
- [Database Schema](../schema.drawio)
