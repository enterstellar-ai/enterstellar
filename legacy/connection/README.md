# `@enterstellar-ai/connection` (deprecated)

> **Renamed:** use [`@enterstellar/connection`](https://www.npmjs.com/package/@enterstellar/connection) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/connection` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/connection
```

```diff
- import { ... } from '@enterstellar-ai/connection';
+ import { ... } from '@enterstellar/connection';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
