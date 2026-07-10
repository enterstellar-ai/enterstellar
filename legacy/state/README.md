# `@enterstellar-ai/state` (deprecated)

> **Renamed:** use [`@enterstellar/state`](https://www.npmjs.com/package/@enterstellar/state) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/state` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/state
```

```diff
- import { ... } from '@enterstellar-ai/state';
+ import { ... } from '@enterstellar/state';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
