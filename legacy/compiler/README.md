# `@enterstellar-ai/compiler` (deprecated)

> **Renamed:** use [`@enterstellar/compiler`](https://www.npmjs.com/package/@enterstellar/compiler) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/compiler` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/compiler
```

```diff
- import { ... } from '@enterstellar-ai/compiler';
+ import { ... } from '@enterstellar/compiler';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
