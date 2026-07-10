# `@enterstellar-ai/devtools` (deprecated)

> **Renamed:** use [`@enterstellar/devtools`](https://www.npmjs.com/package/@enterstellar/devtools) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/devtools` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/devtools
```

```diff
- import { ... } from '@enterstellar-ai/devtools';
+ import { ... } from '@enterstellar/devtools';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
