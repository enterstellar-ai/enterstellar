#!/usr/bin/env node
/**
 * Unpublish @enterstellar-ai/* legacy proxy versions from npm.
 *
 * WARNING: npm permanently reserves every published name@version — you cannot
 * republish the same version after unpublish. Use this only to remove mistaken
 * releases; to ship fixes (e.g. README), bump the proxy version instead.
 *
 * Usage:
 *   node scripts/unpublish-legacy-proxies.mjs          # print commands
 *   node scripts/unpublish-legacy-proxies.mjs --exec   # run unpublish (requires npm auth)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LEGACY_ROOT = join(__dirname, '..', 'legacy');

const packages = readdirSync(LEGACY_ROOT)
    .filter((entry) => {
        const pkgPath = join(LEGACY_ROOT, entry, 'package.json');
        try {
            statSync(pkgPath);
            return true;
        } catch {
            return false;
        }
    })
    .map((entry) => {
        const pkg = JSON.parse(readFileSync(join(LEGACY_ROOT, entry, 'package.json'), 'utf8'));
        return { name: pkg.name, version: pkg.version };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

const exec = process.argv.includes('--exec');

console.log(
    exec
        ? `Unpublishing ${packages.length} legacy proxy version(s) from npm...\n`
        : `Dry run — ${packages.length} unpublish command(s):\n`,
);

let failures = 0;

for (const { name, version } of packages) {
    const spec = `${name}@${version}`;
    const cmd = `npm unpublish "${spec}" --force`;
    if (exec) {
        console.log(`Running: ${cmd}`);
        try {
            execSync(cmd, { stdio: 'inherit' });
        } catch {
            failures += 1;
            console.error(`Failed: ${spec}`);
        }
    } else {
        console.log(cmd);
    }
}

if (exec) {
    if (failures > 0) {
        console.error(`\n${failures} unpublish(s) failed. Fix errors, then retry.`);
        process.exit(1);
    }
    console.log(`\nUnpublished ${packages.length} version(s). Next: pnpm legacy:publish`);
} else {
    console.log(`\n${packages.length} package(s). Pass --exec to run against npm.`);
}
