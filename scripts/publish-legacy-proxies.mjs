#!/usr/bin/env node
/**
 * One-time migration publish: build and publish all @enterstellar-ai/* legacy proxy packages.
 *
 * Prerequisites:
 *   1. @enterstellar/* canonical packages are already published to npm.
 *   2. NODE_AUTH_TOKEN or npm login is configured.
 *
 * This is NOT part of the regular release pipeline — run once after scope migration,
 * then retire when the @enterstellar-ai/* deprecation window closes.
 *
 * Usage: pnpm legacy:publish
 */

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(command) {
    console.log(`\n> ${command}`);
    execSync(command, { cwd: ROOT, stdio: 'inherit' });
}

console.log('Legacy proxy publish — migration-only workflow');
console.log('Ensure @enterstellar/* is already on npm before continuing.\n');

run('pnpm legacy:build');
run("pnpm --filter './legacy/*' publish --access public --no-git-checks");

console.log('\nLegacy proxies published. Next: pnpm legacy:deprecate --exec');
