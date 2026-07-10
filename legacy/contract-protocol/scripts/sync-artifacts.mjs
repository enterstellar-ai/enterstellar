#!/usr/bin/env node
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
