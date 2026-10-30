// Reads every .dst and .pes in a folder with the gallery's own parsers and reports
// files that fail, come out empty or have odd dimensions.
// Run: node tests/audit-library.mjs "/path/to/embroidery folder"
// Cloud-only files (iCloud, OneDrive) are skipped, so nothing gets downloaded.
import fs from 'node:fs';
import path from 'node:path';
import { loadParsers } from './helpers.mjs';

const root = process.argv[2];
if (!root) { console.error('Usage: node tests/audit-library.mjs "/path/to/folder"'); process.exit(1); }
const { parseFile } = loadParsers();

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (/\.(pes|dst)$/i.test(e.name)) files.push(p);
  }
})(root);

const r = { read: 0, cloudOnly: 0, failed: [], empty: [], odd: [] };
for (const f of files) {
  const st = fs.statSync(f);
  if (st.size > 0 && st.blocks === 0) { r.cloudOnly++; continue; }   // placeholder with no data on disk
  const buf = fs.readFileSync(f);
  try {
    const d = parseFile(path.basename(f), buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    const pts = d.stitches.filter(p => !p.colorChange);
    if (!pts.length) { r.empty.push(f); continue; }
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const wMm = (Math.max(...xs) - Math.min(...xs)) / 10, hMm = (Math.max(...ys) - Math.min(...ys)) / 10;
    if (wMm > 1000 || hMm > 1000) r.odd.push(`${f} (${Math.round(wMm)} x ${Math.round(hMm)} mm)`);
    r.read++;
  } catch (e) { r.failed.push(`${f}: ${e.message}`); }
}
console.log(`${files.length} designs found: ${r.read} read, ${r.cloudOnly} cloud-only and skipped, ${r.failed.length} failed, ${r.empty.length} empty, ${r.odd.length} over 1 metre`);
for (const [label, list] of [['Failed', r.failed], ['Empty', r.empty], ['Over 1 metre', r.odd]]) {
  if (list.length) { console.log(`\n${label}:`); list.slice(0, 20).forEach(x => console.log('  ' + x.replace(root + '/', ''))); }
}
