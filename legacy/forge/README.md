# `@enterstellar-ai/forge` (deprecated)

> **Renamed:** use [`@enterstellar/forge`](https://www.npmjs.com/package/@enterstellar/forge) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/forge` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/forge
```

```diff
- import { ... } from '@enterstellar-ai/forge';
+ import { ... } from '@enterstellar/forge';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
