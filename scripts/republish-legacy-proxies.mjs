#!/usr/bin/env node
/**
 * Unpublish then republish all @enterstellar-ai/* legacy proxy packages.
 *
 * NOTE: npm never allows reusing a published version string. This script only
 * works for versions that were never published, or to republish a NEW bumped
 * version after unpublishing mistaken releases. For README fixes on live
 * proxies, bump LEGACY_VERSION in generate-legacy-proxies.mjs and run
 * `pnpm legacy:publish` instead.
 *
 * Usage: pnpm legacy:republish
 */

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(command) {
    console.log(`\n> ${command}`);
    execSync(command, { cwd: ROOT, stdio: 'inherit' });
}

console.log('Legacy proxy republish — unpublish @0.1.1 then publish with READMEs\n');

run('node scripts/unpublish-legacy-proxies.mjs --exec');
run('node scripts/publish-legacy-proxies.mjs');

console.log('\nLegacy proxies republished.');
