# `@enterstellar-ai/migration` (deprecated)

> **Renamed:** use [`@enterstellar/migration`](https://www.npmjs.com/package/@enterstellar/migration) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/migration` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/migration
```

```diff
- import { ... } from '@enterstellar-ai/migration';
+ import { ... } from '@enterstellar/migration';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
