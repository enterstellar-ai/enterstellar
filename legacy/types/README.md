# `@enterstellar-ai/types` (deprecated)

> **Renamed:** use [`@enterstellar/types`](https://www.npmjs.com/package/@enterstellar/types) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/types` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/types
```

```diff
- import { ... } from '@enterstellar-ai/types';
+ import { ... } from '@enterstellar/types';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
