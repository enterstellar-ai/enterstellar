# `@enterstellar-ai/cli` (deprecated)

> **Renamed:** use [`@enterstellar/cli`](https://www.npmjs.com/package/@enterstellar/cli) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/cli` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/cli
```

```diff
- import { ... } from '@enterstellar-ai/cli';
+ import { ... } from '@enterstellar/cli';
```

## CLI binaries

The `enterstellar`, `ens`, and `create-enterstellar-app` commands still work via this shim.
For new projects, install [`@enterstellar/cli`](https://www.npmjs.com/package/@enterstellar/cli) directly:

```bash
npm install -g @enterstellar/cli
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
