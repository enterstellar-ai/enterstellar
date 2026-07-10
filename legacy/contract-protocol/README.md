# `@enterstellar-ai/contract-protocol` (deprecated)

> **Renamed:** use [`@enterstellar/contract-protocol`](https://www.npmjs.com/package/@enterstellar/contract-protocol) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/contract-protocol` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/contract-protocol
```

```diff
- import { ... } from '@enterstellar-ai/contract-protocol';
+ import { ... } from '@enterstellar/contract-protocol';
```

## Schemas & validation CLI

JSON schemas, conformance fixtures, and the `enterstellar-protocol-validate` binary are
bundled from [`@enterstellar/contract-protocol`](https://www.npmjs.com/package/@enterstellar/contract-protocol). New projects should
depend on that package directly.

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
