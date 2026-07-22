# Initial Web Implementation MVP

Initial setup of a personal yearly budget-and-spending tracker app.

## Goal

Implementation of a NextJS app for a personal yearly budget-and-spending tracker using NextJS and Typescript. At the end of the MVP implementation, the user must be able to register, login, verify email, logout and use all the other features.

## Specifications

## Pages

- `/auth/signin` - Centralized container with Email and password inputs, a "forgot password" link and a signup redirect button
- `/auth/signup` - Centralized container with Email, password and confirm password inputs and a signin redirect button
- `/auth/verify-email?token=` - Centralized container with confirmation or error of the email validation
- `/auth/verify-email-pending` - Post-signup page telling the user to check their inbox for the verification link
- `/auth/forgot-password` - Centralized container with an email input that requests a password reset link
- `/auth/reset-password?token=` - Centralized container with new-password + confirm inputs that consume the reset token
- `/auth/signout` - Centralized container with signout loading message
- `/` - Home page of the app, only with a welcome title, nothing more
- `/profile` - View/update the current user's profile (name, password) and delete the account
- `/transactions` - Transactions table with ability to add, edit, delete, filter, sort, search and paginate transactions
- `/categories` - Categories table with ability to add, edit, delete, filter, sort, search and paginate categories. Rendered as a flat table (not a tree) with a "Parent category" column; the create/edit form exposes an optional parent picker (select) sourced from the user's existing categories
- `/loans` - Loans table with ability to add, edit, delete, filter, sort, search and paginate loans. Each row also exposes a dedicated "Register payment" action (separate from edit) that records a payment amount against the loan; the backend recomputes `amountReceived`, `openBalance` and `isPaid`. The plain edit form only updates loan metadata (person, description, date, amountLent), not payment fields

### Bulk create & delete

Create and delete are **bulk-first**, matching the backend contract (`POST /<resource>` takes an array → `{ created, failed }`; `DELETE /<resource>` takes `{ ids }` → `{ deleted, failed }`):

- **Create** forms use a react-hook-form **field array** so the user can add several rows in one submit. Partial failures from `failed[]` are surfaced per row / via toast.
- **Delete** is driven from the list: rows carry checkboxes, and the delete action collects the selected ids into the `{ ids }` body.

Shared helpers for the paginated-list and bulk response shapes live in `src/shared/infra/http/list.ts` and `src/shared/infra/http/bulk.ts`.

## Styles

Create a single and global `global.css` file to create design tokens and color using css variables. Only use TailwindCSS for styling the components. Other `css` files must not be created.

### Color tokens

- Primary: #04DF81
- Secondary: #AACBC4
- Tertiary: #DE391D
- Text: #040F0F
- Background: #F2F8F6

> Other shades of these pallete must used for other details

### Design tokens

- Always use `rem`
- Always use multiples of `4px` (or `0.25rem`)

### Font

- Use `Questrial` as the default font family
- Use `PT Mono` to display all monetary values

### Components

Use ShadcnUI components as the foundation of the app. Ensure that every component used follow the same visual language of the design tokens defined above. The ShadcnUI already uses their own design tokens defined inside `global.css`, modify then, if needed, to use the design tokens defined above.

### Responsivity

The app must be fully responsive, meaning it should look good on all screen sizes, from small mobile devices to large desktop monitors.

### Accessibility

- Use semantic HTML
- Use ARIA roles and attributes where needed
- Use proper focus management
- Ensure proper color contrast
- Don't create a dark mode variant of pages and components

### Locale

- The whole UI (labels, buttons, validation and error messages) is in Portuguese (pt-BR). This matches the domain data, which already uses Portuguese enum values (`RECEITA`, `INVESTIMENTO`, `DESPESA`, `FIXA`, `VARIAVEL`) — translate these enums to their pt-BR display labels at the presentation layer only, never in stored/sent data
- All monetary values (rendered in the `PT Mono` font) are formatted as Brazilian Real using `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Dates are formatted as `dd/MM/yyyy`

## Api Layer

Use `axios` as the underlying api client. Create an `HttpClient` class (in `src/shared/infra/http/client.ts`) that wraps an axios instance, implements all the http methods (`get`, `post`, `put`, `patch`, `delete`), and configures `withCredentials: true` plus the response interceptor. Also export an `IHttpClient` interface describing those methods — services depend on the interface, not the concrete class.

Do **not** export a shared singleton instance. Each container (or shared component that needs data) instantiates its own client at module scope, outside the component, and injects it into the services it builds:

```ts
export interface IHttpClient {
  get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse>;
  // post, put, patch, delete ...
}

export class HttpClient implements IHttpClient {
  /* axios instance + response interceptor */
}
```

## Backend

For development, the api is called from `localhost:3333` and the server definitions are available on `../backend` folder

### Auth

All the protected endpoints are guarded by a JWT access token, stored in a secure httpOnly cookie. **This is implemented** — `POST /auth/signin` and `POST /auth/refresh` issue `accessToken` + `refreshToken` httpOnly cookies via `Set-Cookie`, and `POST /auth/signout` clears them. Requirements this depends on (all in place):

- Backend CORS configured with a specific allowed origin (`APP_URL`) and `credentials: true` (no wildcard origin, since cookies require it)
- The web `HttpClient` configured with `withCredentials: true` so the cookies are sent on every cross-origin request
- Cookie flags: `HttpOnly`, `Secure` (in production, via `COOKIE_SECURE`), `SameSite=Lax`

Given the cookies are httpOnly, the web app never reads or attaches the tokens manually — the browser sends them automatically.

### Route protection

Route protection is handled entirely by the `HttpClient` response interceptor (`src/shared/infra/http/client.ts`), not a Next.js middleware:

- On a `401`, the interceptor transparently calls `POST /auth/refresh` **once** (de-duplicated via a shared in-flight promise) to rotate the token pair, then retries the original request. Requests to the auth endpoints themselves are exempt.
- If the refresh fails, or on a `403`, it redirects to `/auth/signin` (unless already on an `/auth` route).

There is no server-side `middleware.ts`; a short flash of a protected shell is acceptable since data fetches immediately trigger the redirect. (The interceptor only runs in the browser — `typeof window` guarded.)

### API Calls

Use `tanstack-query` as the lib for data fetching and mutation. Every query and mutation should be defined and used following the tanstack-query best practices and patterns. Every query and mutation should be isolated to it's own module, as much as possible. Every query and mutation must be defined using `queryOptions` and `mutationOptions` method.

Each query/mutation file exports both the `queryOptions`/`mutationOptions` factory and a thin hook wrapping it. Both take a single object param carrying the injected service instance plus `params` (queries) or `meta` (mutations), and the `queryFn`/`mutationFn` delegates to `service.execute()` — see [Services](#services) for the full dependency-injection flow.

Folder structure for queries inside modules:

```
queries/
├── queryKeys.ts
├── useGetTransactions.ts
├── useGetTransaction.ts
mutations/
├── mutationKeys.ts
├── useDeleteTransaction.ts
├── useCreateTransaction.ts
```

Set the default options for the `QueryClient` as following:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutation: {
      onError: () => {
        // show a toast notification with the error
      },
      onSuccess: () => {
        // show a success notification with the success message
      },
    },
  },
});
```

### Services

Every service is a class that receives an `IHttpClient` in the constructor and exposes a single `execute()` method. Services depend on the `IHttpClient` interface, never the concrete `HttpClient`.

```ts
export class CreateCategoryService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dto: ICreateCategoryDTO): Promise<ICategory> {
    const response = await this.httpClient.post<ICategoryResponse, ICreateCategoryDTO>(
      "/categories",
      dto,
    );
    return response.category;
  }
}
```

**Dependency injection flow.** The container instantiates the `HttpClient` and the service(s) at module scope (outside the component), then passes the service **instances** into the model hook. The model forwards each service to the query/mutation hook it drives, and the hook calls `service.execute()` as its `queryFn`/`mutationFn`. A service instance therefore flows `container → model → hook → execute()`.

**Every function takes a single object param — never sequential params.** Model hooks, query/mutation hooks, and their `queryOptions`/`mutationOptions` factories each receive one object whose keys are the **descriptive service instance names** (matching the container's variable names). Mutation `meta` is nested under a `meta` key.

```tsx
// container — instantiates the client + services once, at module scope
const httpClient = new HttpClient();
const createCategoryService = new CreateCategoryService(httpClient);
const listCategoriesForSelectService = new ListCategoriesForSelectService(httpClient);

function CreateCategoryDialog() {
  const model = useCreateCategoryModel({
    createCategoryService,
    listCategoriesForSelectService,
  });

  return <CreateCategoryView {...model} />;
}
```

```ts
// query hook + options factory — one object param keyed by the service instance name
export function getCategoriesOptions({ listCategoriesService, params }: IGetCategoriesArgs) {
  return queryOptions({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => listCategoriesService.execute(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetCategories({ listCategoriesService, params }: IGetCategoriesArgs) {
  return useQuery(getCategoriesOptions({ listCategoriesService, params }));
}

// mutation hook — meta nested under `meta`
export function useCreateCategory({ createCategoryService, meta }: ICreateCategoryArgs) {
  return useMutation(createCategoryMutationOptions({ createCategoryService, meta }));
}
```

**Cross-module services.** When a feature needs data owned by another module (e.g. transactions needs the categories "for-select" list), that module exposes the service **class** through its public `index.ts` barrel. The consuming container imports the class from the barrel, instantiates it with its own `httpClient`, and injects it — it never reaches into the other module's internal `api/`. Example: `categories/index.ts` exports `ListCategoriesForSelectService`, and the transactions container does `new ListCategoriesForSelectService(httpClient)` then `useGetCategoriesForSelect({ listCategoriesForSelectService })`.

### Error handling

- Every mutation's `onError` (set globally on the `QueryClient`, per the defaults above) shows a toast notification. The toast message is resolved through a centralized error-code map (e.g. `src/shared/infra/http/error-messages.ts`) that translates known backend error codes (invalid credentials, duplicate email, unverified email, category has children, loan already paid, etc.) into specific pt-BR user-facing messages, falling back to a generic "Algo deu errado" message for unmapped/network errors
- Field-level validation errors (from zod + react-hook-form) are shown inline on the offending form field, not as toasts
- Every mutation's `onSuccess` shows a success toast with a message defined in that feature's `messages.ts` file

## Base UI

- All protected routes page must have a sidebar containing a link to transactions, categories and loans.
- All protected routes page must have a header containing the page name and a user menu displaying the user name and email, and a button to signout.

## State Management

For local and simple state managements inside components use `useState`, for shared state management across components use `zustand` and create stores inside `src/modules/<feature>/store.ts` files.

A common use for shared stores is filters and pagination

## Form and schema validation

Always use zod and react hook form to get user input and validate date sent and retrieved to backend.

## Project architecture

The project follows a layered, dependency-injected, module-oriented architecture. Each **module** (e.g. `transactions`, `categories`, `loans`) is self-contained under `src/modules/<module>/` and exposes its own **features** (e.g. `list`, `create`, `edit`, `delete`) under `src/modules/<module>/features/<feature>/`. Each feature exports its own `<feature-name>.container.ts` file responsible for assembling all its dependencies, including dependencies from other modules.

Each module should be responsible for it's own internal management. This includes hooks, hocs, components, api services, global state management, etc. A module only exposes what's meant for cross-module use through a public `index.ts` barrel at its root (e.g. `src/modules/categories/index.ts` exporting `useGetCategoriesForSelect` and its `ListCategoriesForSelectService` class so a consumer can inject it — see [Services › Cross-module services](#services)). If a feature inside a module needs something from another module, its container must import it from that module's `index.ts` only — never reach directly into another module's internal `api/`, `hooks/`, `components/`, etc. This keeps modules genuinely self-contained.

#### Module folder structure

```
src/
├── modules/
│ ├── transactions/
│ │ ├── index.ts                    # public barrel — the only file other modules may import from
│ │ ├── store.ts                     # zustand: filters, pagination, and cross-feature UI state (open dialog, selected row)
│ │ ├── hooks/
│ │ ├── components/
│ │ ├── hocs/
│ │ ├── types/
│ │ ├── api/
│ │ │ ├── queries/
│ │ │ │ ├── queryKeys.ts
│ │ │ │ ├── useGetTransactions.ts    # exports getTransactionsOptions() (queryOptions) and useGetTransactions()
│ │ │ │ ├── useGetTransaction.ts
│ │ │ ├── mutations/
│ │ │ │ ├── mutationKeys.ts
│ │ │ │ ├── useDeleteTransaction.ts
│ │ │ │ ├── useCreateTransaction.ts
│ │ │ ├── services/
│ │ │ │ ├── get-transactions.service.ts
│ │ │ │ ├── get-transaction.service.ts
│ │ │ │ ├── delete-transaction.service.ts
│ │ │ │ ├── create-transaction.service.ts
│ │ ├── features/
│ │ │ ├── list/
│ │ │ │ ├── transactions-list.view.ts
│ │ │ │ ├── transactions-list.model.ts
│ │ │ │ ├── transactions-list.container.ts
│ │ │ │ ├── transactions-list.messages.ts
│ │ │ ├── create/
│ │ │ ├── edit/
│ │ │ ├── delete/
```

Each feature must be brokedown into different files, each respecting the single responsability principle

- `view`: Only present the data, no logic at all
- `model`: Define the structure of the data and calls the query / mutation hooks. This file must export a hook
- `container`: Handle the dependency injection and the data flow (this shoulbe be imported inside the page)
- `messages`: Define the messages used inside the feature

Two files live at the module root, outside any single feature, because they're shared across the module's features:

- `index.ts`: the module's public barrel. Only what's exported here may be imported by other modules (via their containers) — internal `api/`, `hooks/`, `components/`, etc. are never reached into directly from outside the module
- `store.ts`: a zustand store holding state shared across the module's features — filters and pagination (consumed by `list`), plus cross-feature UI coordination such as which dialog is open or which row is selected for edit/delete (so `create`/`edit`/`delete` can be triggered from `list` without the page itself holding that state)

Query/mutation files export both the raw `queryOptions`/`mutationOptions` factory and a thin hook wrapping it (e.g. `useGetTransactions.ts` exports `getTransactionsOptions({ listTransactionsService, params })` and `useGetTransactions({ listTransactionsService, params })`), so other code (prefetching, `invalidateQueries`) can use the options object directly without invoking the hook. Both take the single object param described in [Services](#services).

The module should be `page-agnostic` wich means the folder structure is created based on feature, not page. When importing the container to the page, the page should be build to display the feature.

#### Project's folder structure

```
src/
├── app/                        # routing only — pages, layouts, route handlers
│ ├── global.css
│ ├── layout.tsx
│ ├── (auth-pages)/
│ │ ├── layout.tsx
│ │ ├── auth/
│ │ │ ├── signin/  signup/  signout/
│ │ │ ├── verify-email/  verify-email-pending/
│ │ │ ├── forgot-password/  reset-password/
│ ├── (protected-pages)/
│ │ ├── layout.tsx              # sidebar + header shell
│ │ ├── page.tsx                # home (welcome)
│ │ ├── transactions/  categories/  loans/  profile/
├── shared/                     # non-routing code shared across modules — sibling of app/, not nested inside it
│ ├── config/                   # env.ts (Zod-validated environment)
│ ├── components/
│ │ ├── ui/                     # ShadcnUI base components
│ │ ├── # shared across the app (AppSidebar, AppHeader, AppPagination, SearchInput, SortableColumnButton, providers)
│ ├── infra/
│ │ ├── http/                   # client.ts, error-messages.ts, list.ts, bulk.ts
│ │ ├── query/                  # query-client.ts
│ ├── lib/                      # formatters (BRL, dates), utils
├── modules/                    # business logic — sibling of app/, not nested inside it (see Module folder structure above)
│ ├── auth/                     # signin/signup/signout/verify-email(+pending)/forgot+reset-password/profile/delete-account
│ ├── transactions/
│ ├── categories/
│ ├── loans/                    # + register-payment feature
```

There is no `src/middleware.ts` — route protection is client-side via the `HttpClient` interceptor (see [Route protection](#route-protection)). Current-user state is served by the `auth` module's `useGetMe` query rather than a dedicated app-wide store. `auth` is a full module (its own `features/`, `api/`, `types/`), not just a set of pages.

## Tasks

- [x] **Backend prerequisite** — `apps/backend` signin/refresh/signout issue/clear the JWT via `Set-Cookie` (httpOnly, secure, SameSite=Lax); CORS configured with `credentials: true` and the web app's origin
- [x] Scaffold Next.js app under `apps/web` with TypeScript, Tailwind, ShadcnUI, path alias `@/*`
- [x] Create `global.css` with the design tokens (colors, spacing) and register `Questrial` / `PT Mono` Google Fonts
- [x] Build `src/shared/config/env.ts` (Zod-validated env: API base URL, etc.)
- [x] Build `src/shared/infra/http/client.ts` — `HttpClient` class with axios, `withCredentials: true`, response interceptor (401 → refresh + retry, else redirect to signin) — and `src/shared/infra/http/error-messages.ts` for the centralized error-code message map, plus `list.ts` / `bulk.ts` response helpers
- [x] Set up `QueryClient` with the specified default options and provider
- [x] For each module (`transactions`, `categories`, `loans`): create `index.ts` public barrel and `store.ts` (filters/pagination + cross-feature UI state)
- [x] Build shared UI: `AppSidebar`, `AppHeader` (page name + user menu + signout), `AppPagination`, `SearchInput`, `SortableColumnButton`
- [x] Auth module: `/auth/signin`, `/auth/signup`, `/auth/verify-email` (+ `verify-email-pending`), `/auth/forgot-password`, `/auth/reset-password`, `/auth/signout` pages + forms (zod + react-hook-form)
- [x] Profile: `/profile` page to view/update the user and delete the account
- [x] `/` home page (static welcome title only)
- [x] Categories module: list (table, filter, sort, search, paginate), bulk-create/edit form with parent picker, bulk-delete
- [x] Transactions module: list (table, filter, sort, search, paginate), bulk-create/edit form (category select), bulk-delete
- [x] Loans module: list (table, filter, sort, search, paginate), bulk-create/edit form, bulk-delete, "Register payment" action
- [x] Zustand stores for filters/pagination per module (`src/modules/<module>/store.ts`)
- [x] Accessibility pass (semantic HTML, ARIA, focus management, contrast) across all pages
- [x] Responsive pass across breakpoints for sidebar/header/tables

> Note: server-side route protection via `src/app/middleware.ts` was dropped in favor of the client-side interceptor + token-refresh flow described under [Route protection](#route-protection).

## Restrictions

- Don't use `any` or `unkown`
- Don't use `let` or `var`
- Don't manage logic inside the `view`
- Dont't use react's context api
- Avoid using `useEffect`
- Don't manage states or manage visuals inside `model`
- Do create a interface with `I` prefix (e.g. `ICreateUserDTO`)
- All components must created using `export function ComponentName() {}`
- All functions inside components must created using `const` named function
- Use context7 for libs documentation
- Don't make assumptions, ask questions if something is not clear

## Tech Stack

- Node v24.16.0 (native TypeScript support; `>=24` enforced in `package.json`)
- TypeScript 5.9 (path alias `@/*` -> `src/*`)
- Zod 4 (request + env validation)
- `jsonwebtoken` (JWT auth)
- `react-hook-form`
- tailwind
- ShadcnUI
- Zustand
- Google fonts

## Docs

- [Backend](../../backend/)
