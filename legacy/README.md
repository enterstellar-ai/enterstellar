# Legacy NPM scope proxies (`@enterstellar-ai/*`)

Thin compatibility packages published under the **old** npm scope after the canonical
packages moved to `@enterstellar/*`.

## Why this is NOT in `prebuild` / `postbuild`

This is a **one-time migration bridge**, not part of normal development or release:

| Step                                 | Frequency                  | Belongs in every build? |
| ------------------------------------ | -------------------------- | ----------------------- |
| Publish `@enterstellar/*`            | Every release (Changesets) | No — release CI only    |
| Build + publish legacy proxies       | Once (migration)           | **No**                  |
| Deprecate `@enterstellar-ai/*@0.1.0` | Once                       | **No**                  |

Hooking legacy build/publish into `turbo build` or `changeset:publish` would slow every
CI run and risk re-publishing shim packages indefinitely. Use the explicit scripts below.

## Migration publish sequence (run once)

```bash
# All four steps (requires NODE_AUTH_TOKEN or npm login):
NODE_AUTH_TOKEN=<token> pnpm migration:publish

# Or step-by-step:
NODE_AUTH_TOKEN=<token> pnpm changeset:publish   # 1. @enterstellar/*
pnpm legacy:publish                               # 2–3. @enterstellar-ai/* proxies
pnpm legacy:deprecate -- --exec                   # 4. deprecate @enterstellar-ai/*@0.1.0
```

## Scripts

| Script                         | Purpose                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| `pnpm legacy:generate`         | Regenerate `legacy/*` from `scripts/generate-legacy-proxies.mjs` |
| `pnpm legacy:build`            | Build all proxy packages                                         |
| `pnpm legacy:publish`          | Build + publish all proxies to npm (migration only)              |
| `pnpm legacy:deprecate`        | Print `npm deprecate` commands for v0.1.0                        |
| `pnpm legacy:deprecate --exec` | Run deprecate against npm                                        |

## Regenerate proxies

```bash
pnpm legacy:generate
```

Do not hand-edit generated library/cli proxies — update the generator instead.
