#!/usr/bin/env node
/**
 * Generates @enterstellar-ai/* proxy packages under legacy/ for zero-breakage npm migration.
 *
 * Each proxy re-exports the matching @enterstellar/* package. Run after canonical packages
 * are renamed; publish @enterstellar/* first, then legacy proxies, then npm deprecate.
 *
 * Usage: node scripts/generate-legacy-proxies.mjs
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LEGACY_ROOT = join(ROOT, 'legacy');

/** Published packages that need legacy proxies (packages/* with private: false). */
const PACKAGES = [
    'adapters',
    'adapter-firebase',
    'adapter-supabase',
    'agent-sdk',
    'cache',
    'cli',
    'cloud',
    'compiler',
    'connection',
    'contract-protocol',
    'contracts-shadcn',
    'devtools',
    'forge',
    'global-index',
    'lifecycle',
    'migration',
    'normalizer',
    'react',
    'registry',
    'semantic-index',
    'state',
    'telemetry',
    'test',
    'types',
];

const LEGACY_VERSION = '0.1.1';
const DEPRECATION =
    'DEPRECATED: This package has moved to @enterstellar. Update imports to the new scope.';

function writePackageReadme(dir, legacyName, canonicalName, variant = 'library') {
    const npmCanonical = `https://www.npmjs.com/package/${canonicalName}`;

    let extra = '';
    if (variant === 'cli') {
        extra = `
## CLI binaries

The \`enterstellar\`, \`ens\`, and \`create-enterstellar-app\` commands still work via this shim.
For new projects, install [\`@enterstellar/cli\`](${npmCanonical}) directly:

\`\`\`bash
npm install -g @enterstellar/cli
\`\`\`
`;
    } else if (variant === 'contract-protocol') {
        extra = `
## Schemas & validation CLI

JSON schemas, conformance fixtures, and the \`enterstellar-protocol-validate\` binary are
bundled from [\`@enterstellar/contract-protocol\`](${npmCanonical}). New projects should
depend on that package directly.
`;
    }

    write(
        join(dir, 'README.md'),
        `# \`${legacyName}\` (deprecated)

> **Renamed:** use [\`${canonicalName}\`](${npmCanonical}) instead.

Enterstellar moved its npm scope from \`@enterstellar-ai\` to \`@enterstellar\`.
This package is a **compatibility shim** that re-exports \`${canonicalName}\` so existing
installs keep working during the transition.

## Migrate

\`\`\`bash
npm install ${canonicalName}
\`\`\`

\`\`\`diff
- import { ... } from '${legacyName}';
+ import { ... } from '${canonicalName}';
\`\`\`
${extra}
## Documentation

- [enterstellar.dev/docs](https://enterstellar.dev/docs)
`,
    );
}

const TSUP_CONFIG = `import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: {
        compilerOptions: {
            composite: false,
            incremental: false,
        },
    },
    clean: true,
    sourcemap: true,
    splitting: false,
    treeshake: false,
    external: [/^@enterstellar\\//],
});
`;

const TSCONFIG = `{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "composite": false,
    "incremental": false
  },
  "include": ["src/**/*.ts"]
}
`;

function write(filePath, content) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, 'utf8');
}

function libraryProxy(pkgDir, canonicalName) {
    const legacyName = `@enterstellar-ai/${pkgDir}`;
    const dir = join(LEGACY_ROOT, pkgDir);

    write(
        join(dir, 'package.json'),
        JSON.stringify(
            {
                name: legacyName,
                description: DEPRECATION,
                version: LEGACY_VERSION,
                author: 'Enterstellar',
                license: 'Apache-2.0',
                homepage: 'https://enterstellar.dev',
                repository: {
                    type: 'git',
                    url: 'https://github.com/enterstellar/enterstellar.git',
                    directory: `legacy/${pkgDir}`,
                },
                type: 'module',
                private: false,
                sideEffects: false,
                publishConfig: { access: 'public' },
                main: './dist/index.cjs',
                module: './dist/index.js',
                types: './dist/index.d.ts',
                exports: {
                    '.': {
                        import: {
                            types: './dist/index.d.ts',
                            default: './dist/index.js',
                        },
                        require: {
                            types: './dist/index.d.cts',
                            default: './dist/index.cjs',
                        },
                    },
                },
                files: ['dist', 'README.md'],
                scripts: {
                    build: 'tsup',
                    typecheck: 'tsc --noEmit',
                },
                dependencies: {
                    [canonicalName]: 'workspace:*',
                },
                devDependencies: {
                    tsup: '^8.5.1',
                    typescript: '^5.9.3',
                },
            },
            null,
            4,
        ) + '\n',
    );

    write(join(dir, 'src/index.ts'), `export * from '${canonicalName}';\n`);
    write(join(dir, 'tsup.config.ts'), TSUP_CONFIG);
    write(join(dir, 'tsconfig.json'), TSCONFIG);
    writePackageReadme(dir, legacyName, canonicalName);
}

function cliProxy() {
    const dir = join(LEGACY_ROOT, 'cli');
    const pkg = {
        name: '@enterstellar-ai/cli',
        description: DEPRECATION,
        version: LEGACY_VERSION,
        author: 'Enterstellar',
        license: 'Apache-2.0',
        homepage: 'https://enterstellar.dev',
        repository: {
            type: 'git',
            url: 'https://github.com/enterstellar/enterstellar.git',
            directory: 'legacy/cli',
        },
        type: 'module',
        private: false,
        sideEffects: false,
        publishConfig: { access: 'public' },
        bin: {
            enterstellar: './node_modules/@enterstellar/cli/dist/bin.js',
            ens: './node_modules/@enterstellar/cli/dist/bin.js',
            'create-enterstellar-app':
                './node_modules/@enterstellar/cli/dist/create-enterstellar-app.js',
        },
        main: './dist/index.cjs',
        module: './dist/index.js',
        types: './dist/index.d.ts',
        exports: {
            '.': {
                import: {
                    types: './dist/index.d.ts',
                    default: './dist/index.js',
                },
                require: {
                    types: './dist/index.d.cts',
                    default: './dist/index.cjs',
                },
            },
        },
        files: ['dist', 'README.md'],
        scripts: {
            build: 'tsup',
            typecheck: 'tsc --noEmit',
        },
        dependencies: {
            '@enterstellar/cli': 'workspace:*',
        },
        devDependencies: {
            tsup: '^8.5.1',
            typescript: '^5.9.3',
        },
    };

    write(join(dir, 'package.json'), JSON.stringify(pkg, null, 4) + '\n');
    write(join(dir, 'src/index.ts'), `export * from '@enterstellar/cli';\n`);
    write(join(dir, 'tsup.config.ts'), TSUP_CONFIG);
    write(join(dir, 'tsconfig.json'), TSCONFIG);
    writePackageReadme(dir, '@enterstellar-ai/cli', '@enterstellar/cli', 'cli');
}

function contractProtocolProxy() {
    const dir = join(LEGACY_ROOT, 'contract-protocol');

    write(
        join(dir, 'package.json'),
        JSON.stringify(
            {
                name: '@enterstellar-ai/contract-protocol',
                description: DEPRECATION,
                version: LEGACY_VERSION,
                author: 'Enterstellar',
                license: 'Apache-2.0',
                homepage: 'https://enterstellar.dev',
                repository: {
                    type: 'git',
                    url: 'https://github.com/enterstellar/enterstellar.git',
                    directory: 'legacy/contract-protocol',
                },
                type: 'module',
                private: false,
                sideEffects: false,
                publishConfig: { access: 'public' },
                bin: {
                    'enterstellar-protocol-validate': './bin/validate.ts',
                },
                files: ['schemas', 'examples', 'conformance', 'bin', 'PROTOCOL_VERSION.md', 'README.md'],
                scripts: {
                    build: 'node scripts/sync-artifacts.mjs',
                    prepublishOnly: 'pnpm run build',
                },
                dependencies: {
                    '@enterstellar/contract-protocol': 'workspace:*',
                },
            },
            null,
            4,
        ) + '\n',
    );

    write(
        join(dir, 'scripts/sync-artifacts.mjs'),
        `#!/usr/bin/env node
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const legacyRoot = join(__dirname, '..');
const sourceRoot = join(__dirname, '../../../packages/contract-protocol');

for (const entry of ['schemas', 'examples', 'conformance', 'bin']) {
    const dest = join(legacyRoot, entry);
    mkdirSync(dest, { recursive: true });
    cpSync(join(sourceRoot, entry), dest, { recursive: true });
}

cpSync(join(sourceRoot, 'PROTOCOL_VERSION.md'), join(legacyRoot, 'PROTOCOL_VERSION.md'));
console.log('Synced contract-protocol artifacts into legacy/contract-protocol');
`,
    );

    writePackageReadme(
        dir,
        '@enterstellar-ai/contract-protocol',
        '@enterstellar/contract-protocol',
        'contract-protocol',
    );
}

function legacyReadme() {
    write(
        join(LEGACY_ROOT, 'README.md'),
        `# Legacy NPM scope proxies (\`@enterstellar-ai/*\`)

Thin compatibility packages published under the **old** npm scope after the canonical
packages moved to \`@enterstellar/*\`.

Each proxy includes its own **\`README.md\`** (listed in \`package.json#files\`) so npm
shows the deprecation notice instead of "This package does not have a README".

**Retention:** Keep this directory and the \`legacy:*\` scripts for **3–6 months** after
the migration publish, then delete once \`@enterstellar-ai/*@0.1.0\` is deprecated and
downstream consumers have migrated.

> **Intentional exception:** \`@enterstellar-ai\` appears **only** under \`legacy/\`, the
> migration scripts, and \`.changeset/config.json\` \`ignore\` list. Everywhere else in the
> repo uses \`@enterstellar\` and \`github.com/enterstellar/enterstellar\`.

## Why this is NOT in \`prebuild\` / \`postbuild\`

This is a **one-time migration bridge**, not part of normal development or release:

| Step                                 | Frequency                  | Belongs in every build? |
| ------------------------------------ | -------------------------- | ----------------------- |
| Publish \`@enterstellar/*\`            | Every release (Changesets) | No — release CI only    |
| Build + publish legacy proxies       | Once (migration)           | **No**                  |
| Deprecate \`@enterstellar-ai/*@0.1.0\` | Once                       | **No**                  |

Hooking legacy build/publish into \`turbo build\` or \`changeset:publish\` would slow every
CI run and risk re-publishing shim packages indefinitely. Use the explicit scripts below.

## Migration publish sequence (run once)

\`\`\`bash
# All four steps (requires NODE_AUTH_TOKEN or npm login):
NODE_AUTH_TOKEN=<token> pnpm migration:publish

# Or step-by-step:
NODE_AUTH_TOKEN=<token> pnpm changeset:publish   # 1. @enterstellar/*
pnpm legacy:publish                               # 2–3. @enterstellar-ai/* proxies
pnpm legacy:deprecate -- --exec                   # 4. deprecate @enterstellar-ai/*@0.1.0
\`\`\`

## Scripts

| Script                         | Purpose                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| \`pnpm legacy:generate\`         | Regenerate \`legacy/*\` from \`scripts/generate-legacy-proxies.mjs\` |
| \`pnpm legacy:build\`            | Build all proxy packages                                         |
| \`pnpm legacy:publish\`          | Build + publish all proxies to npm (migration only)              |
| \`pnpm legacy:deprecate\`        | Print \`npm deprecate\` commands for v0.1.0                        |
| \`pnpm legacy:deprecate --exec\` | Run deprecate against npm                                        |

## Regenerate proxies

\`\`\`bash
pnpm legacy:generate
\`\`\`

Do not hand-edit generated library/cli proxies — update the generator instead.
`,
    );

    write(
        join(LEGACY_ROOT, 'tsconfig.base.json'),
        `{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  }
}
`,
    );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

if (existsSync(LEGACY_ROOT)) {
    for (const pkgDir of PACKAGES) {
        const target = join(LEGACY_ROOT, pkgDir);
        if (existsSync(target)) {
            rmSync(target, { recursive: true, force: true });
        }
    }
}

legacyReadme();

for (const pkgDir of PACKAGES) {
    const canonicalName = `@enterstellar/${pkgDir}`;
    if (pkgDir === 'cli') {
        cliProxy();
    } else if (pkgDir === 'contract-protocol') {
        contractProtocolProxy();
    } else {
        libraryProxy(pkgDir, canonicalName);
    }
}

console.log(`Generated ${PACKAGES.length} legacy proxy packages in legacy/`);
