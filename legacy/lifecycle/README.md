# `@enterstellar-ai/lifecycle` (deprecated)

> **Renamed:** use [`@enterstellar/lifecycle`](https://www.npmjs.com/package/@enterstellar/lifecycle) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/lifecycle` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/lifecycle
```

```diff
- import { ... } from '@enterstellar-ai/lifecycle';
+ import { ... } from '@enterstellar/lifecycle';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
