# `@enterstellar-ai/adapters` (deprecated)

> **Renamed:** use [`@enterstellar/adapters`](https://www.npmjs.com/package/@enterstellar/adapters) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/adapters` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/adapters
```

```diff
- import { ... } from '@enterstellar-ai/adapters';
+ import { ... } from '@enterstellar/adapters';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
