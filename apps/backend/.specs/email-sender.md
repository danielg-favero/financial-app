# Email Sender

Implement email sender service

## Goal

Implement a email sender service to send emails to the user with a custom HTML template

## Specifications

The email sender service should send emails to the user on:

- After `/auth/signup`: Registration confirmation with email verification link
- After `/auth/verify-email`: Email verification confirmation
- After `/auth/forgot-password`: Password reset email with a reset link
- After `/auth/reset-password`: Password reset confirmation

All templates share a common `base-layout.ts` wrapper for consistent HTML/branding. Delivery goes through the `IEmailSender` provider (SMTP via Nodemailer), configured from `SMTP_*` env vars.

### Tech Stack

- Node v24.16.0 (native TypeScript support; `>=24` enforced in `package.json`)
- Fastify 5
- TypeScript 5.9 (path alias `@/*` -> `src/*`)
- `tsx` (dev/watch + test runner loader), `tsup` (build)
- Node's native test runner (`node --test`)
- Nodemailer (SMTP)

## Tasks

[x] Setup nodemailer
[x] Create a EmailSender service
[x] Create templates folder (with a shared `base-layout` wrapper)
[x] Create a RegisterConfirmationEmail template
[x] Create a EmailVerificationConfirmationEmail template
[x] Create a PasswordResetEmail template
[x] Create a PasswordResetConfirmationEmail template
[x] Update auth module to use email sender

## Constitution

### Restrictions

- Don't update `any` or `unkown`
- Don't use `let` or `var`
- Don't mofify `INITIAL.md` and `schema.drawio`
- Do create a interface with `I` prefix (e.g. `ICreateUserDTO`)
- Do validate all query params with a schema on request
- Don't make assumptions, always ask for clarification
- Do use context7 for documentation search
