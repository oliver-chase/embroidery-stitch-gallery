// Loads the real parsers out of stitch-gallery.html, so the tests check the code
// that ships. Set GALLERY_HTML to point the tests at another copy of the file.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const GALLERY = process.env.GALLERY_HTML || path.join(here, '..', 'stitch-gallery.html');

export function loadParsers() {
  const src = fs.readFileSync(GALLERY, 'utf8');
  const a = src.indexOf('// ---------------- PARSERS'), b = src.indexOf('// ---------------- RENDERING');
  if (a < 0 || b < a) throw new Error('Could not find the parser section in ' + GALLERY);
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src.slice(a, b) + '\nthis.api = { parseDST, parsePES, parseFile, PEC_PALETTE };', ctx);
  return ctx.api;
}

// Results come from another JavaScript realm, so compare them as plain data.
export const plain = x => JSON.parse(JSON.stringify(x));

// ---- Sample designs, described as steps in file coordinates ----
// DST steps use the file's own axes (y points up). PES steps use y pointing down.
export const DST_STEPS = [
  { t: 'stitch', dx: 100, dy: 0 }, { t: 'stitch', dx: 0, dy: 100 },
  { t: 'stitch', dx: -100, dy: 0 }, { t: 'stitch', dx: 0, dy: -100 },
  { t: 'jump', dx: 60, dy: 60 },
  { t: 'color', dx: 0, dy: 0 },
  { t: 'stitch', dx: 30, dy: -20 }, { t: 'stitch', dx: -45, dy: 70 },
  { t: 'stitch', dx: 121, dy: -121 }, { t: 'stitch', dx: -121, dy: 121 },
];
export const PES_COLORS = [5, 1];            // palette indexes: Red, Prussian Blue
export const PES_STEPS = [
  { t: 'stitch', dx: 10, dy: 0 }, { t: 'stitch', dx: 0, dy: 20 },
  { t: 'stitch', dx: -30, dy: -5 }, { t: 'stitch', dx: 63, dy: -64 },   // largest short-form values
  { t: 'jump', dx: 300, dy: 150 },
  { t: 'color' },
  { t: 'stitch', dx: -64, dy: 63 }, { t: 'stitch', dx: 64, dy: -65 },   // first long-form values
  { t: 'stitch', dx: 2047, dy: -2048 }, { t: 'stitch', dx: -2047, dy: 2047 },
];

// What the parsers should return for those steps. DST flips y (the file counts
// upward, the screen counts downward), and its colour-change record also reads
// as a jump. PES keeps y as stored.
export function expectedPoints(steps, format) {
  const dst = format === 'dst';
  let x = 0, y = 0;
  return steps.map(s => {
    x += s.dx || 0; y += s.dy || 0;
    const colorChange = s.t === 'color';
    return { x, y: dst ? -y : y, jump: s.t === 'jump' || (dst && colorChange), colorChange };
  });
}

// ---- Encoders ----
function ternary(v) {                         // balanced ternary, weights 1 3 9 27 81
  const d = [];
  for (let i = 0; i < 5; i++) {
    const r = ((v % 3) + 3) % 3;
    if (r === 2) { d.push(-1); v = (v + 1) / 3; } else { d.push(r); v = (v - r) / 3; }
  }
  if (v !== 0) throw new Error('DST step out of range');
  return d;
}
export function dstRecord(dx, dy) {
  const b = [0, 0, 3];
  const X = [[0, 0x01, 0x02], [1, 0x01, 0x02], [0, 0x04, 0x08], [1, 0x04, 0x08], [2, 0x04, 0x08]];
  const Y = [[0, 0x80, 0x40], [1, 0x80, 0x40], [0, 0x20, 0x10], [1, 0x20, 0x10], [2, 0x20, 0x10]];
  ternary(dx).forEach((d, i) => { if (d) b[X[i][0]] |= d > 0 ? X[i][1] : X[i][2]; });
  ternary(dy).forEach((d, i) => { if (d) b[Y[i][0]] |= d > 0 ? Y[i][1] : Y[i][2]; });
  return b;
}
export function encodeDst(steps) {
  const header = Buffer.alloc(512, 0x20);
  header.write('LA:FIXTURE\r', 0, 'latin1');
  const out = [];
  for (const s of steps) {
    const b = dstRecord(s.dx || 0, s.dy || 0);
    if (s.t === 'jump') b[2] |= 0x80;
    if (s.t === 'color') b[2] |= 0xC0;
    out.push(...b);
  }
  out.push(0, 0, 0xF3);
  return Buffer.concat([header, Buffer.from(out)]);
}

// 7-bit short form, or 12-bit long form. A flag puts the jump bit (0x20) or the
// trim bit (0x10) on that axis; real files can set it on either axis.
const pecAxis = (d, flag) => {
  if (!flag && d >= -64 && d <= 63) return [d & 0x7F];
  const v = d & 0xFFF;
  return [0x80 | (v >> 8) | (flag === 'trim' ? 0x10 : flag ? 0x20 : 0), v & 0xFF];
};
export function encodePes(steps, colorIndexes) {
  const stitches = [];
  for (const s of steps) {
    if (s.t === 'color') { stitches.push(0xFE, 0xB0, 0x01); continue; }
    const flags = s.flags || (s.t === 'jump' ? [true, true] : [false, false]);
    stitches.push(...pecAxis(s.dx, flags[0]), ...pecAxis(s.dy, flags[1]));
  }
  stitches.push(0xFF, 0x00);
  const pec = Buffer.alloc(528 + stitches.length);          // stitch data starts 528 bytes into the PEC block
  pec.write('LA:', 0, 'latin1'); pec.write('FIXTURE', 3, 'latin1');
  pec[48] = colorIndexes.length - 1;                        // colour changes = colours - 1
  colorIndexes.forEach((c, i) => { pec[49 + i] = c; });
  Buffer.from(stitches).copy(pec, 528);
  const head = Buffer.alloc(12);
  head.write('#PES0001', 0, 'latin1'); head.writeUInt32LE(12, 8);   // PEC block begins right after the header
  return Buffer.concat([head, pec]);
}
