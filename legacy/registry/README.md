# `@enterstellar-ai/registry` (deprecated)

> **Renamed:** use [`@enterstellar/registry`](https://www.npmjs.com/package/@enterstellar/registry) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/registry` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/registry
```

```diff
- import { ... } from '@enterstellar-ai/registry';
+ import { ... } from '@enterstellar/registry';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
