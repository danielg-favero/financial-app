# List Filters

Apply filters to all list endpoints

## Goal

Implement filters to every list endpoint

## Specifications

All list endpoints must support the following query parameters:

- `page` - Page number (default: 1)
- `perPage` - Items per page (default: 20)
- `search` - Search term (optional, case-insensitive contains)
- `orderBy` - Field to order by (optional; validated against a **per-endpoint whitelist** of sortable fields, e.g. `categoryOrderByFields`)
- `sort` - Order direction (`asc` or `desc`, default: `asc`)
- `filters` - **Structured, resource-specific filters**, passed as a **JSON-encoded string** (e.g. `?filters={"categoryId":"..."}`). Each endpoint that needs them defines its own filters schema — categories → `{ parentId }`, transactions → `{ categoryId, referenceMonth, referenceYear, categoryType, expenseKind }` (loans currently expose no structured filters). Decoded and validated by `jsonQueryParamSchema` in `src/shared/http/schemas/filters.schemas.ts`

`page`/`perPage`/`search`/`orderBy`/`sort` are built by the shared `createFiltersQuerySchema(orderByFields)` helper; endpoints that need structured filters extend it with an optional `filters` object.

The paginated results must be returned in the following format:

```json
{
    "data": [...],
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
}
```

The shared `listFilters()` utility (`src/shared/filters/list-filters.ts`) applies search, whitelisted sort and pagination in-memory and is used by the in-memory repositories in tests; the Prisma repositories push the equivalent down to the query.

## Tasks

[x] Create a shared Filter interface
[x] Create a shared FilterParams interface
[x] Create a shared FilteredResult interface
[x] Create a Filters validation schema with zod
[x] Create a shared ListFilters utility function
[x] Update all list endpoints to support filters

## Constitution

### Restrictions

- Don't update `any` or `unkown`
- Don't use `let` or `var`
- Don't mofify `INITIAL.md` and `schema.drawio`
- Do create a interface with `I` prefix (e.g. `ICreateUserDTO`)
- Do validate all query params with a schema on request
- Don't make assumptions, always ask for clarification
- Do use context7 for documentation search
