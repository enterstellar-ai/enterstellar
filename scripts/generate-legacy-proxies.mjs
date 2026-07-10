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
                    url: 'https://github.com/enterstellar-ai/enterstellar.git',
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
                files: ['dist'],
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
            url: 'https://github.com/enterstellar-ai/enterstellar.git',
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
        files: ['dist'],
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
                    url: 'https://github.com/enterstellar-ai/enterstellar.git',
                    directory: 'legacy/contract-protocol',
                },
                type: 'module',
                private: false,
                sideEffects: false,
                publishConfig: { access: 'public' },
                bin: {
                    'enterstellar-protocol-validate': './bin/validate.ts',
                },
                files: ['schemas', 'examples', 'conformance', 'bin', 'PROTOCOL_VERSION.md'],
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
}

function legacyReadme() {
    write(
        join(LEGACY_ROOT, 'README.md'),
        `# Legacy NPM scope proxies (\`@enterstellar-ai/*\`)

Thin compatibility packages published under the **old** npm scope after the canonical
packages moved to \`@enterstellar/*\`.

## Publish order (zero-breakage)

1. Publish all \`@enterstellar/*\` packages at their current versions (e.g. \`0.1.0\`).
2. Build legacy proxies: \`pnpm legacy:build\`
3. Publish all \`legacy/*\` packages (patch \`0.1.1\`).
4. Deprecate old scope: \`pnpm legacy:deprecate\`

## Regenerate proxies

\`\`\`bash
node scripts/generate-legacy-proxies.mjs
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
