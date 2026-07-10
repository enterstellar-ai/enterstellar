# @enterstellar/cli

> Interactive project scaffolding, component generation, migration pipeline, and annotation review — the developer's entry point to Enterstellar OS.

The CLI provides four commands: `enterstellar init` / `ens init` scaffolds a complete Enterstellar project with registry, design tokens, 5 example components, intent-based tests, and framework-specific configuration — including **existing React project detection**, automatic `.enterstellarignore` generation, and a **contract pack selector**. `enterstellar add component <Name>` generates a 4-file component scaffold (contract, render, test, fixture) inside an existing project. `enterstellar migrate <path>` runs the 3-phase migration pipeline (extraction, enrichment, assembly) to convert existing components into `.contract.ts` files. `enterstellar review` scans generated contracts for `@enterstellar-review` and `@enterstellar-warn` annotation debt. All commands feature interactive prompts, automatic package manager detection, and styled terminal output.

## Quick Start

```bash
# Create a new Enterstellar project
npx create-enterstellar-app my-app

# Or use the enterstellar CLI directly
enterstellar init
enterstellar init my-app

# Add a new component to an existing project
enterstellar add component PatientVitals

# Migrate existing components to Enterstellar contracts
enterstellar migrate src/components/
enterstellar migrate src/ --enrich --provider openai --api-key sk-xxx
enterstellar migrate src/ --format json --strict

# Review migration annotation debt
enterstellar review
enterstellar review src/components/ --json
```

### Programmatic Usage

```ts
import {
  initCommand,
  addComponentCommand,
  migrateCommand,
  reviewCommand,
  detectPackageManager,
  CLI_VERSION,
} from '@enterstellar/cli';

// Scaffold a project programmatically
await initCommand('my-app');

// Add a component programmatically
await addComponentCommand('PatientVitals');

// Run the migration pipeline programmatically
await migrateCommand(['src/components/'], ['src/components/', '--enrich', '--provider', 'openai']);

// Scan for annotation debt programmatically
await reviewCommand(['src/'], ['src/', '--json']);

// Detect package manager from lockfiles
const pm = detectPackageManager(process.cwd()); // 'pnpm' | 'npm' | 'yarn' | 'bun' | null

// Access CLI version (T14 pattern)
console.log(CLI_VERSION); // '0.0.0'
```

## API Reference

### Commands

| Function                            | Description                                                                                                      |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `initCommand(directoryArg?)`        | Interactive project scaffolding. Prompts for name, template, PM. Writes all files per Bible §4.17.               |
| `addComponentCommand(name)`         | Generates 4-file component scaffold. Validates PascalCase. Detects Enterstellar project root.                    |
| `migrateCommand(pathArgs, rawArgs)` | 3-phase migration pipeline: extract → enrich → assemble. Writes `.contract.ts` + `.test.ts` files. 12 flags.     |
| `reviewCommand(pathArgs, rawArgs)`  | Scans `.contract.ts` files for `@enterstellar-review` and `@enterstellar-warn` annotations. Text or JSON output. |

### Utilities

| Function                      | Returns                  | Description                                                               |
| :---------------------------- | :----------------------- | :------------------------------------------------------------------------ |
| `detectPackageManager(dir)`   | `PackageManager \| null` | Auto-detects PM from lockfiles (CLI3). Priority: pnpm > bun > yarn > npm. |
| `getInstallCommand(pm)`       | `string`                 | Maps PM to install command (e.g., `'pnpm install'`).                      |
| `validateProjectName(name)`   | `boolean`                | Validates kebab-case project names.                                       |
| `validateComponentName(name)` | `boolean`                | Validates PascalCase component names (min 2 chars).                       |

### Migration Utilities

| Function                              | Returns           | Description                                                                                                            |
| :------------------------------------ | :---------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `parseMigrateFlags(args)`             | `MigrateFlags`    | Manual flag parser for all 12 `enterstellar migrate` flags. Validates mutual exclusion and env var fallback.           |
| `parseAnnotations(content, filePath)` | `FileAnnotations` | Parses `@enterstellar-review` and `@enterstellar-warn` annotations from file content. Dual-format, multi-line support. |
| `parseReviewFlags(args)`              | `ReviewFlags`     | Flag parser for `enterstellar review` (`--json`, `--fix`).                                                             |

### Types

| Type               | Description                                                                                                                                                                                              |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProjectTemplate`  | `'minimal' \| 'full' \| 'nextjs' \| 'vite-react'` — template variants for `enterstellar init` / `ens init`.                                                                                              |
| `PackageManager`   | `'npm' \| 'pnpm' \| 'yarn' \| 'bun'` — supported package managers.                                                                                                                                       |
| `ContractPack`     | `'shadcn' \| 'radix' \| 'mui' \| 'headless' \| 'chakra' \| 'ant-design' \| 'react-aria' \| 'empty'` — contract pack for `enterstellar init` / `ens init`. Only `shadcn` and `empty` currently available. |
| `StarterKit`       | `'skip' \| 'minimal' \| 'dashboard' \| 'e-commerce' \| 'healthcare'` — starter kit selection for domain scaffolding.                                                                                     |
| `MigrateFlags`     | Typed object for all 12 parsed CLI flags of `enterstellar migrate` (Correction 5).                                                                                                                       |
| `MigrateFormat`    | `'text' \| 'json'` — output format for migration results.                                                                                                                                                |
| `ParsedAnnotation` | A single `@enterstellar-review` or `@enterstellar-warn` annotation with type, line, field, reason, and optional rule.                                                                                    |
| `FileAnnotations`  | Result of parsing a single file: `{ filePath, annotations }`.                                                                                                                                            |
| `ReviewFlags`      | Typed object for `enterstellar review` flags: `{ json, fix }`.                                                                                                                                           |
| `ReviewJsonOutput` | JSON output shape: `{ totalAnnotations, totalFiles, files }`.                                                                                                                                            |

### Version

| Constant      | Type     | Description                                                                              |
| :------------ | :------- | :--------------------------------------------------------------------------------------- |
| `CLI_VERSION` | `string` | Semantic version constant. Matches `package.json`. Updated via Changesets. (T14 pattern) |

### Binaries

| Binary                    | Usage                               | Description                                                                              |
| :------------------------ | :---------------------------------- | :--------------------------------------------------------------------------------------- |
| `enterstellar`            | `enterstellar <command> [options]`  | Main CLI. Routes to `init`, `add component`, `migrate`, `review`, `--version`, `--help`. |
| `create-enterstellar-app` | `npx create-enterstellar-app [dir]` | Thin alias for `enterstellar init` / `ens init`. Standard `npx create-*` convention.     |

### Error Codes

| Code       | Scenario                                                             | Recoverable |
| :--------- | :------------------------------------------------------------------- | :---------- |
| `ENS-9001` | Invalid project name (not kebab-case)                                | ❌ No       |
| `ENS-9002` | Invalid component name (not PascalCase)                              | ❌ No       |
| `ENS-9003` | Directory exists and is non-empty                                    | ❌ No       |
| `ENS-9004` | No Enterstellar project found (`@enterstellar/registry` not in deps) | ❌ No       |
| `ENS-9005` | Package manager install failed                                       | ✅ Yes      |
| `ENS-9006` | File write failed (permissions, disk space)                          | ✅ Yes      |

## Configuration

### `enterstellar init` / `ens init` Templates

| Template     | Description                                 | Key Dependencies                                                                                       |
| :----------- | :------------------------------------------ | :----------------------------------------------------------------------------------------------------- |
| `minimal`    | Registry + React integration (zero-config)  | `@enterstellar/react`, `@enterstellar/registry`, `zod`                                                 |
| `full`       | Full Enterstellar + DevTools + Test harness | Minimal + `@enterstellar/types`, `@enterstellar/cache`, `@enterstellar/devtools`, `@enterstellar/test` |
| `nextjs`     | Full Enterstellar + Next.js App Router      | Full + `next`, `react`, `react-dom`                                                                    |
| `vite-react` | Full Enterstellar + Vite dev server         | Full + `vite`, `@vitejs/plugin-react`                                                                  |

> Engine packages (`@enterstellar/compiler`, `@enterstellar/state`, `@enterstellar/telemetry`, `@enterstellar/connection`, `@enterstellar/lifecycle`, `@enterstellar/adapters`) are transitive dependencies of `@enterstellar/react` — consumers do not install them directly.

### `enterstellar add component` Output

Each component generates 4 files in `src/enterstellar/components/`:

| File                  | Content                                                |
| :-------------------- | :----------------------------------------------------- |
| `<Name>.contract.ts`  | Zod schema + `defineComponent()` contract              |
| `<Name>.tsx`          | Typed React render function stub                       |
| `<Name>.test.ts`      | Intent test with `createTestHarness()` + mock response |
| `<Name>.fixture.json` | Example props matching the Zod schema                  |

### Scaffolded Project Structure (Bible §4.17)

```
my-enterstellar-app/
├── src/
│   ├── globals.css               # CSS custom properties from design tokens
│   ├── enterstellar/
│   │   ├── registry.ts          # Pre-populated with 5 example components
│   │   ├── tokens.ts            # Design tokens (colors, spacing, typography, radii, shadows)
│   │   └── components/
│   │       ├── ExampleCard.tsx
│   │       ├── ExampleList.tsx
│   │       ├── ExampleChart.tsx
│   │       ├── ExampleForm.tsx
│   │       └── ExampleDetail.tsx
│   ├── app/
│   │   └── page.tsx             # Provider + Zone example (Next.js)
│   └── tests/
│       └── enterstellar.test.ts         # 3 intent-based tests
├── package.json                 # @enterstellar/react + @enterstellar/registry + zod
├── tsconfig.json                # 15 strict TS flags
└── README.md                    # Getting started guide
```

### Build Configuration

| File               | Purpose                                                                                    |
| :----------------- | :----------------------------------------------------------------------------------------- |
| `tsconfig.json`    | Extends `tsconfig.base.json` — strict mode. `composite: false`, `incremental: false`.      |
| `tsup.config.ts`   | Builds ESM + CJS + DTS. 3 entrypoints: `bin.ts`, `create-enterstellar-app.ts`, `index.ts`. |
| `vitest.config.ts` | Test runner with globals enabled.                                                          |

**Dependencies:** `@enterstellar/migration`, `@clack/prompts` (interactive prompts), `picocolors` (styled output), `fast-glob` (file discovery)
**Peer dependencies:** `@enterstellar/types`, `zod`
**Dev dependencies:** `@enterstellar/types`, `@types/node`

## Design Choices Applied

| Decision                  | Summary                                                                                                                                                                                                                                                                   |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CLI1**                  | Interactive `enterstellar init` / `ens init` flow with 4 template choices. Prompts via `@clack/prompts`.                                                                                                                                                                  |
| **CLI2**                  | `enterstellar add component` generates 4 files: contract, render, test, fixture.                                                                                                                                                                                          |
| **CLI3**                  | Auto-detect PM from lockfile. Priority: pnpm > bun > yarn > npm. If none found, prompt.                                                                                                                                                                                   |
| **L15**                   | No framework imports in the CLI engine. Generated code imports React, but CLI itself is pure Node.js.                                                                                                                                                                     |
| **Bible §4.17**           | Scaffolded project structure matches the Implementation Bible exactly.                                                                                                                                                                                                    |
| **Correction 1**          | `enterstellar review` companion command — scans `@enterstellar-review` and `@enterstellar-warn` annotations.                                                                                                                                                              |
| **Correction 5 L187-213** | Existing React project detection in `enterstellar init` / `ens init`: syntax-only `ts-morph` scan via `scanComponentsLightweight()` (dynamically imported from `@enterstellar/migration`), 3-tier summary display, migration confirmation prompt (Yes / Yes+Enrich / No). |
| **Correction 5**          | `enterstellar migrate` — 12 flags, manual arg parsing, 4-level outcome model.                                                                                                                                                                                             |
| **Correction 6 L457-473** | `.enterstellarignore` auto-generation in `enterstellar init` / `ens init`: canonical 26-pattern file via `generateEnterstellarIgnore()`. Never overwrites existing file.                                                                                                  |
| **Correction 8**          | Contract pack selector + starter kit selector in `enterstellar init` / `ens init`. 8 pack options (only `shadcn` available), 5 starter kits. Pack selection injects `@enterstellar/contracts-*` into generated `package.json`.                                            |
| **Audit E1**              | Dual-format annotation parser — separate regex for `@enterstellar-review` (with `rule=`) and `@enterstellar-warn` (without).                                                                                                                                              |
| **Audit E2**              | `reviewCommand` export signature locked to match `migrateCommand` async pattern.                                                                                                                                                                                          |
| **Audit E3**              | No `--filter` flag on `enterstellar review` — not in bible spec (Zero Improvisation).                                                                                                                                                                                     |
| **Audit M1**              | `enterstellar init` / `ens init` skips `validateDirectory()` when existing React project detected (non-empty dir is intentional).                                                                                                                                         |
| **Audit M2**              | `enterstellar review` uses own `fast-glob` call (`**/*.contract.ts`), not `resolveSourceFiles()`.                                                                                                                                                                         |

## See Also

- [Implementation Bible §4.17](../../agent/03-enterstellar-implementation-bible.md) — CLI module specification.
- [Design Choices — CLI1–CLI3](../../agent/04-enterstellar-design-choices.md) — locked decisions.
- [Coding Rules](../../agent/05-enterstellar-coding-rules.md) — naming conventions, strictness requirements.
- [Migration Pipeline](../../archive/ADOPTION/migration/migration-01-pipeline.md) — Corrections 1 & 2: outcome model, binary source model.
- [Migration CLI](../../archive/ADOPTION/migration/migration-03-cli.md) — Correction 5: CLI interface, flag reference.
- [Contract Packs](../../archive/ADOPTION/migration/migration-05-contract-packs.md) — Correction 7: contract pack architecture.
