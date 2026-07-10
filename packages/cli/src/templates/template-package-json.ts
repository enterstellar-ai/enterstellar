/**
 * @module @enterstellar/cli/templates/template-package-json
 * @description Generates a `package.json` for the scaffolded Enterstellar project.
 *
 * Produces a valid JSON string with the correct dependencies based on
 * the chosen project template:
 *
 * | Template      | Enterstellar Deps                                    | Framework Deps             |
 * |:--------------|:---------------------------------------------|:---------------------------|
 * | `minimal`     | react, registry, zod                         | react, react-dom           |
 * | `full`        | react, registry, types, cache + devtools/test | react, react-dom           |
 * | `nextjs`      | react, registry, types, cache + devtools/test | next, react, react-dom     |
 * | `vite-react`  | react, registry, types, cache + devtools/test | vite, @vitejs/plugin-react |
 *
 * Engine packages (@enterstellar/compiler, @enterstellar/state, @enterstellar/telemetry, @enterstellar/connection,
 * @enterstellar/lifecycle, @enterstellar/adapters) are transitive dependencies of @enterstellar/react and
 * do NOT need to be listed in the consumer's package.json.
 *
 * @see Design Choice CLI1 — template variants
 * @see Implementation Bible §4.17 — scaffolded output spec
 * @see Correction 8, L25-41 — contract pack dependency injection
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Project template variants as defined by Design Choice CLI1. */
export type ProjectTemplate = 'minimal' | 'full' | 'nextjs' | 'vite-react';

// ---------------------------------------------------------------------------
// Dependency Sets
// ---------------------------------------------------------------------------

/**
 * Minimal Enterstellar dependencies — the smallest viable set for a working
 * Enterstellar project with registry, compilation, and React rendering.
 *
 * Engine packages (@enterstellar/compiler, @enterstellar/state, @enterstellar/telemetry,
 * @enterstellar/connection, @enterstellar/lifecycle, @enterstellar/adapters) are transitive
 * dependencies of @enterstellar/react — consumers do not install them.
 *
 * @see Design Choice RE19 — @enterstellar/react bundles all engine packages.
 */
const MINIMAL_Enterstellar_DEPS: Record<string, string> = {
  '@enterstellar/react': 'latest',
  '@enterstellar/registry': 'latest',
  zod: '^4.3.6',
};

/**
 * Full Enterstellar dependency set — extends minimal with type imports
 * (for power-user contract authoring), opt-in cache (for DevTools
 * Cache Dashboard), and advanced engine packages.
 *
 * @see Design Choice RE19 — @enterstellar/react bundles all engine packages.
 */
const FULL_Enterstellar_DEPS: Record<string, string> = {
  ...MINIMAL_Enterstellar_DEPS,
  '@enterstellar/types': 'latest',
  '@enterstellar/cache': 'latest',
};

/**
 * Enterstellar dev dependencies — DevTools and test harness.
 * Present in all templates except `minimal`.
 */
const Enterstellar_DEV_DEPS: Record<string, string> = {
  '@enterstellar/devtools': 'latest',
  '@enterstellar/test': 'latest',
  vitest: 'latest',
};

/** Shared React peer dependencies for all templates. */
const REACT_DEPS: Record<string, string> = {
  react: '^19.0.0',
  'react-dom': '^19.0.0',
};

/** TypeScript dev dependency for all templates. */
const TYPESCRIPT_DEV_DEP: Record<string, string> = {
  typescript: '^5.9.0',
};

/**
 * Maps contract pack identifiers to their npm package names.
 *
 * `'empty'` maps to `undefined` — no dependency is added.
 * Coming-soon packs have their package names defined for future use
 * but are not selectable in the current `enterstellar init` prompt.
 *
 * @see Correction 8, L25-41 — contract pack selector
 * @see Audit M7 — full Bible-specified pack list
 */
const CONTRACT_PACK_DEPS: Readonly<Record<string, string | undefined>> = {
  shadcn: '@enterstellar/contracts-shadcn',
  radix: '@enterstellar/contracts-radix',
  mui: '@enterstellar/contracts-mui',
  headless: '@enterstellar/contracts-headless',
  chakra: '@enterstellar/contracts-chakra',
  'ant-design': '@enterstellar/contracts-ant-design',
  'react-aria': '@enterstellar/contracts-react-aria',
  empty: undefined,
};

// ---------------------------------------------------------------------------
// Template Generator
// ---------------------------------------------------------------------------

/**
 * Generates a `package.json` string for a scaffolded Enterstellar project.
 *
 * The generated manifest includes:
 * - Project name, version `0.1.0`, `type: "module"`.
 * - Template-appropriate dependencies and devDependencies.
 * - Standard scripts: `dev`, `build`, `test`, `typecheck`, `lint`.
 * - Framework-specific scripts for Next.js and Vite templates.
 *
 * @param projectName - Kebab-case project name (validated before this call).
 * @param template - The chosen project template variant.
 * @param contractPack - The selected contract pack. When not `'empty'`,
 *   adds the corresponding `@enterstellar/contracts-*` dependency.
 * @returns A JSON string (2-space indented) representing the `package.json`.
 *
 * @example
 * ```ts
 * const json = generatePackageJson('my-enterstellar-app', 'minimal', 'shadcn');
 * await writeFile('my-enterstellar-app/package.json', json);
 * ```
 */
export function generatePackageJson(
  projectName: string,
  template: ProjectTemplate,
  contractPack?: string,
): string {
  const { deps, devDeps, scripts } = getTemplateDeps(template);

  // --- Inject contract pack dependency (Correction 8) ---
  // Only add the dependency when a non-empty pack is selected.
  const contractDeps: Record<string, string> = {};
  if (contractPack !== undefined && contractPack !== 'empty') {
    const pkgName = CONTRACT_PACK_DEPS[contractPack];
    if (pkgName !== undefined) {
      contractDeps[pkgName] = 'latest';
    }
  }

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts,
    dependencies: {
      ...deps,
      ...contractDeps,
    },
    devDependencies: {
      ...TYPESCRIPT_DEV_DEP,
      ...devDeps,
    },
  };

  return JSON.stringify(packageJson, null, 2) + '\n';
}

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/** Resolved dependency sets and scripts for a given template. */
interface TemplateDeps {
  /** Production dependencies. */
  readonly deps: Record<string, string>;
  /** Development dependencies. */
  readonly devDeps: Record<string, string>;
  /** npm scripts. */
  readonly scripts: Record<string, string>;
}

/**
 * Resolves dependencies and scripts for a given template.
 *
 * Each case is fully self-contained — no fallthrough, no shared mutation.
 * Satisfies `noFallthroughCasesInSwitch`.
 */
function getTemplateDeps(template: ProjectTemplate): TemplateDeps {
  switch (template) {
    case 'minimal': {
      return {
        deps: { ...MINIMAL_Enterstellar_DEPS, ...REACT_DEPS },
        devDeps: { vitest: 'latest' },
        scripts: {
          dev: 'echo "Add your dev server here"',
          build: 'tsc --noEmit',
          test: 'vitest run',
          typecheck: 'tsc --noEmit',
          lint: 'eslint src/',
        },
      };
    }
    case 'full': {
      return {
        deps: { ...FULL_Enterstellar_DEPS, ...REACT_DEPS },
        devDeps: { ...Enterstellar_DEV_DEPS },
        scripts: {
          dev: 'echo "Add your dev server here"',
          build: 'tsc --noEmit',
          test: 'vitest run',
          typecheck: 'tsc --noEmit',
          lint: 'eslint src/',
        },
      };
    }
    case 'nextjs': {
      return {
        deps: { ...FULL_Enterstellar_DEPS, ...REACT_DEPS, next: 'latest' },
        devDeps: {
          ...Enterstellar_DEV_DEPS,
          '@types/react': 'latest',
          '@types/react-dom': 'latest',
        },
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          test: 'vitest run',
          typecheck: 'tsc --noEmit',
          lint: 'next lint',
        },
      };
    }
    case 'vite-react': {
      return {
        deps: { ...FULL_Enterstellar_DEPS, ...REACT_DEPS },
        devDeps: {
          ...Enterstellar_DEV_DEPS,
          vite: 'latest',
          '@vitejs/plugin-react': 'latest',
          '@types/react': 'latest',
          '@types/react-dom': 'latest',
        },
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
          test: 'vitest run',
          typecheck: 'tsc --noEmit',
          lint: 'eslint src/',
        },
      };
    }
  }
}
