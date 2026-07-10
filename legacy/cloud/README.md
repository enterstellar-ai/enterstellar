# `@enterstellar-ai/cloud` (deprecated)

> **Renamed:** use [`@enterstellar/cloud`](https://www.npmjs.com/package/@enterstellar/cloud) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/cloud` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/cloud
```

```diff
- import { ... } from '@enterstellar-ai/cloud';
+ import { ... } from '@enterstellar/cloud';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
