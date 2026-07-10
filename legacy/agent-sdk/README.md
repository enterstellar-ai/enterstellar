# `@enterstellar-ai/agent-sdk` (deprecated)

> **Renamed:** use [`@enterstellar/agent-sdk`](https://www.npmjs.com/package/@enterstellar/agent-sdk) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/agent-sdk` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/agent-sdk
```

```diff
- import { ... } from '@enterstellar-ai/agent-sdk';
+ import { ... } from '@enterstellar/agent-sdk';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
