# `@enterstellar-ai/test` (deprecated)

> **Renamed:** use [`@enterstellar/test`](https://www.npmjs.com/package/@enterstellar/test) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/test` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/test
```

```diff
- import { ... } from '@enterstellar-ai/test';
+ import { ... } from '@enterstellar/test';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
