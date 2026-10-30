// Run from the repo folder: node --test tests/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadParsers, plain, DST_STEPS, PES_STEPS, PES_COLORS,
  expectedPoints, encodeDst, encodePes, dstRecord,
} from './helpers.mjs';

const { parseDST, parsePES, parseFile, PEC_PALETTE } = loadParsers();
const fixture = name => fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', name));
const ab = buf => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const bounds = pts => {
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
};

test('fixtures on disk match what the builders produce', () => {
  assert.deepEqual(fixture('sample.dst'), encodeDst(DST_STEPS));
  assert.deepEqual(fixture('sample.pes'), encodePes(PES_STEPS, PES_COLORS));
});

// ---------------- DST ----------------
test('DST: the sample file gives every stitch, jump and colour change in order', () => {
  const d = parseDST(ab(fixture('sample.dst')));
  assert.deepEqual(plain(d.stitches), plain(expectedPoints(DST_STEPS, 'dst')));
});

test('DST: stitch count and bounds', () => {
  const d = parseDST(ab(fixture('sample.dst')));
  assert.equal(d.stitches.length, DST_STEPS.length);
  assert.equal(d.stitches.filter(p => p.colorChange).length, 1);
  assert.equal(d.stitches.filter(p => p.jump && !p.colorChange).length, 1);
  assert.deepEqual(bounds(d.stitches), bounds(expectedPoints(DST_STEPS, 'dst')));
});

test('DST: the file counts y upward, so the parsed y is flipped for the screen', () => {
  const d = parseDST(ab(encodeDst([{ t: 'stitch', dx: 0, dy: 50 }])));
  assert.equal(d.stitches[0].y, -50);
});

test('DST: every x and y step from -121 to 121 decodes exactly', () => {
  for (let v = -121; v <= 121; v++) {
    const d = parseDST(ab(encodeDst([{ t: 'stitch', dx: v, dy: 0 }, { t: 'stitch', dx: 0, dy: v }])));
    assert.equal(d.stitches[0].x, v, `x step ${v}`);
    assert.equal(d.stitches[1].y, -v, `y step ${v}`);
  }
});

test('DST: the end record stops parsing even with bytes after it', () => {
  const buf = Buffer.concat([encodeDst([{ t: 'stitch', dx: 5, dy: 5 }]), Buffer.from(dstRecord(9, 9))]);
  assert.equal(parseDST(ab(buf)).stitches.length, 1);
});

test('DST: a header with no stitches gives an empty design', () => {
  assert.equal(parseDST(ab(encodeDst([]))).stitches.length, 0);
});

// ---------------- PES ----------------
test('PES: the sample file gives every stitch, jump and colour change in order', () => {
  const d = parsePES(ab(fixture('sample.pes')));
  assert.deepEqual(plain(d.stitches), plain(expectedPoints(PES_STEPS, 'pes')));
});

test('PES: stitch count, colour change count and bounds', () => {
  const d = parsePES(ab(fixture('sample.pes')));
  assert.equal(d.stitches.length, PES_STEPS.length);
  assert.equal(d.stitches.filter(p => p.colorChange).length, PES_COLORS.length - 1);
  assert.deepEqual(bounds(d.stitches), bounds(expectedPoints(PES_STEPS, 'pes')));
});

test('PES: thread colours come from the standard PEC palette', () => {
  const d = parsePES(ab(fixture('sample.pes')));
  assert.deepEqual(plain(d.colors), PES_COLORS.map(i => PEC_PALETTE[i]));
  assert.deepEqual(plain(d.colors), ['#ed171f', '#0e1f7c']);
});

test('PES: y is kept as stored (it already counts downward)', () => {
  const d = parsePES(ab(encodePes([{ t: 'stitch', dx: 0, dy: 40 }], [1])));
  assert.equal(d.stitches[0].y, 40);
});

test('PES: a jump is flagged, and a normal stitch is not', () => {
  const d = parsePES(ab(encodePes([{ t: 'stitch', dx: 5, dy: 5 }, { t: 'jump', dx: 100, dy: 100 }], [1])));
  assert.deepEqual(plain(d.stitches.map(p => p.jump)), [false, true]);
});

test('PES: a jump or trim bit on either axis marks the stitch as a jump', () => {
  const cases = [[true, false], [false, true], ['trim', false], [false, 'trim']];
  for (const flags of cases) {
    const d = parsePES(ab(encodePes([{ t: 'jump', dx: 100, dy: 100, flags }], [1])));
    assert.equal(d.stitches[0].jump, true, JSON.stringify(flags));
  }
  const plainLong = parsePES(ab(encodePes([{ t: 'stitch', dx: 100, dy: 100 }], [1])));
  assert.equal(plainLong.stitches[0].jump, false, 'a long stitch with no flag is not a jump');
});

test('PES: short and long coordinate forms agree at the boundary', () => {
  for (const v of [-2048, -65, -64, -1, 0, 1, 63, 64, 2047]) {
    const d = parsePES(ab(encodePes([{ t: 'stitch', dx: v, dy: v }], [1])));
    assert.equal(d.stitches[0].x, v, `x ${v}`);
    assert.equal(d.stitches[0].y, v, `y ${v}`);
  }
});

test('PES: a file that is not a PES is rejected', () => {
  assert.throws(() => parsePES(ab(fixture('sample.dst'))), /Not a PES file/);
});

// ---------------- dispatch ----------------
test('parseFile picks the parser from the extension, in any letter case', () => {
  assert.equal(parseFile('x.DST', ab(fixture('sample.dst'))).stitches.length, DST_STEPS.length);
  assert.equal(parseFile('x.Pes', ab(fixture('sample.pes'))).stitches.length, PES_STEPS.length);
});

test('parseFile refuses formats it cannot read', () => {
  assert.throws(() => parseFile('x.jef', new ArrayBuffer(10)), /Unsupported: \.jef/);
});
