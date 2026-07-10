#!/usr/bin/env node
/**
 * One-time npm scope migration publish orchestrator.
 *
 * Runs the full 4-step sequence when NODE_AUTH_TOKEN (or npm login) is available:
 *   1. pnpm changeset:publish     → @enterstellar/*@0.1.1
 *   2. pnpm legacy:build          → build proxy shims
 *   3. publish legacy/*           → @enterstellar-ai/*@0.1.1 proxies
 *   4. pnpm legacy:deprecate --exec → deprecate @enterstellar-ai/*@0.1.0
 *
 * This is NOT wired into prebuild/postbuild — run once after merging the migration commit.
 *
 * Usage:
 *   NODE_AUTH_TOKEN=<token> pnpm migration:publish
 *   NODE_AUTH_TOKEN=<token> pnpm migration:publish -- --skip-deprecate
 */

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const skipDeprecate = process.argv.includes('--skip-deprecate');

function run(command) {
    console.log(`\n> ${command}`);
    execSync(command, {
        cwd: ROOT,
        stdio: 'inherit',
        env: process.env,
    });
}

function assertNpmAuth() {
    try {
        execSync('npm whoami', { cwd: ROOT, stdio: 'pipe', env: process.env });
    } catch {
        console.error(
            'npm authentication required. Set NODE_AUTH_TOKEN or run `npm login` before publishing.',
        );
        process.exit(1);
    }
}

console.log('Enterstellar npm scope migration — one-time publish\n');
assertNpmAuth();

console.log('Step 1/4: Publish @enterstellar/* (Changesets)');
run('pnpm changeset:publish');

console.log('\nStep 2–3/4: Build and publish @enterstellar-ai/* legacy proxies');
run('pnpm legacy:publish');

if (skipDeprecate) {
    console.log('\nSkipped step 4 (--skip-deprecate). Run: pnpm legacy:deprecate -- --exec');
} else {
    console.log('\nStep 4/4: Deprecate original @enterstellar-ai/*@0.1.0 releases');
    run('node scripts/deprecate-legacy-scope.mjs --exec');
}

console.log('\nMigration publish complete.');
