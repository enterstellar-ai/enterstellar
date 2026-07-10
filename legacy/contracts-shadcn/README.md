# `@enterstellar-ai/contracts-shadcn` (deprecated)

> **Renamed:** use [`@enterstellar/contracts-shadcn`](https://www.npmjs.com/package/@enterstellar/contracts-shadcn) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/contracts-shadcn` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/contracts-shadcn
```

```diff
- import { ... } from '@enterstellar-ai/contracts-shadcn';
+ import { ... } from '@enterstellar/contracts-shadcn';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
