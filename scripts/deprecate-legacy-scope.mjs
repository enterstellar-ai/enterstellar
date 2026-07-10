#!/usr/bin/env node
/**
 * Emits npm deprecate commands for the **original** @enterstellar-ai/* releases (v0.1.0).
 * Run AFTER publishing legacy proxy shims (currently v0.1.2 with READMEs).
 *
 * Usage:
 *   node scripts/deprecate-legacy-scope.mjs          # print commands
 *   node scripts/deprecate-legacy-scope.mjs --exec   # run deprecate (requires npm auth)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LEGACY_ROOT = join(__dirname, '..', 'legacy');

const DEPRECATED_VERSION = '0.1.0';

const MESSAGE =
    'Package renamed to @enterstellar scope. Update imports: @enterstellar-ai/<pkg> → @enterstellar/<pkg>.';

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

for (const { name } of packages) {
    const cmd = `npm deprecate "${name}@${DEPRECATED_VERSION}" "${MESSAGE}"`;
    if (exec) {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    } else {
        console.log(cmd);
    }
}

console.log(`\n${packages.length} package(s). Pass --exec to run against npm.`);
