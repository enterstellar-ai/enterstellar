# `@enterstellar-ai/telemetry` (deprecated)

> **Renamed:** use [`@enterstellar/telemetry`](https://www.npmjs.com/package/@enterstellar/telemetry) instead.

Enterstellar moved its npm scope from `@enterstellar-ai` to `@enterstellar`.
This package is a **compatibility shim** that re-exports `@enterstellar/telemetry` so existing
installs keep working during the transition.

## Migrate

```bash
npm install @enterstellar/telemetry
```

```diff
- import { ... } from '@enterstellar-ai/telemetry';
+ import { ... } from '@enterstellar/telemetry';
```

## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
