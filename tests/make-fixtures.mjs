// Rebuilds the sample files in tests/fixtures. Run: node tests/make-fixtures.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DST_STEPS, PES_STEPS, PES_COLORS, encodeDst, encodePes } from './helpers.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'sample.dst'), encodeDst(DST_STEPS));
fs.writeFileSync(path.join(dir, 'sample.pes'), encodePes(PES_STEPS, PES_COLORS));
console.log('Wrote tests/fixtures/sample.dst and sample.pes');
