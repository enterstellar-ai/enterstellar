# `@enterstellar-ai/react` (deprecated)

> **Renamed:** use [`@enterstellar/react`](https://www.npmjs.com/package/@enterstellar/react) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/react` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/react
```

```diff
- import { ... } from '@enterstellar-ai/react';
+ import { ... } from '@enterstellar/react';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
