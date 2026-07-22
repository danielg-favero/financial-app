# `@repo/eslint-config`

Shared internal eslint configurations for the monorepo, built on top of `@eslint/js`, `typescript-eslint`, and `eslint-config-prettier`.

## Exports

| Export | File | Use in |
| --- | --- | --- |
| `@repo/eslint-config/base` | `base.js` | Plain TypeScript packages (e.g. the backend) |
| `@repo/eslint-config/next-js` | `next.js` | Next.js apps (adds `@next/eslint-plugin-next`) |
| `@repo/eslint-config/react-internal` | `react-internal.js` | Shared React component libraries (e.g. `@repo/ui`) |

## Usage

Add as a workspace dependency and import the relevant config in the consumer's `eslint.config.js`:

```js
import { nextJsConfig } from "@repo/eslint-config/next-js";

export default nextJsConfig;
```
