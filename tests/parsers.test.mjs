// Run from the repo folder: node --test tests/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadParsers, plain, DST_STEPS, PES_STEPS, PES_COLORS,
  expectedPoints, encodeDst, encodePes, dstRecord,
} from './helpers.mjs';

const { parseDST, parsePES, parseFile, PEC_PALETTE } = loadParsers();
const sampleDst = () => encodeDst(DST_STEPS), samplePes = () => encodePes(PES_STEPS, PES_COLORS);
const ab = buf => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

// ---------------- DST ----------------
test('DST: the sample design gives every stitch, jump and color change in order', () => {
  const d = parseDST(ab(sampleDst()));
  assert.deepEqual(plain(d.stitches), plain(expectedPoints(DST_STEPS, 'dst')));
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
test('PES: the sample design gives every stitch, jump and color change in order', () => {
  const d = parsePES(ab(samplePes()));
  assert.deepEqual(plain(d.stitches), plain(expectedPoints(PES_STEPS, 'pes')));
});

test('PES: thread colors come from the standard PEC palette', () => {
  const d = parsePES(ab(samplePes()));
  assert.deepEqual(plain(d.colors), PES_COLORS.map(i => PEC_PALETTE[i]));
  assert.deepEqual(plain(d.colors), ['#ed171f', '#0e1f7c']);
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

test('PES: a file with no colors still starts its stitches at the standard offset', () => {
  const d = parsePES(ab(encodePes(PES_STEPS, [])));
  assert.equal(d.stitches.length, PES_STEPS.length);
  assert.deepEqual(plain(d.colors), []);
});

test('PES: a file cut off mid-stitch gives no NaN', () => {
  const full = encodePes([{ t: 'stitch', dx: 100, dy: 0 }], [1]);
  const d = parsePES(ab(full.subarray(0, full.length - 3)));
  assert.ok(d.stitches.every(s => Number.isFinite(s.x) && Number.isFinite(s.y)));
});

test('PES: a file that is not a PES is rejected', () => {
  assert.throws(() => parsePES(ab(sampleDst())), /Not a PES file/);
});

// ---------------- dispatch ----------------
test('parseFile picks the parser from the extension, in any letter case', () => {
  assert.equal(parseFile('x.DST', ab(sampleDst())).stitches.length, DST_STEPS.length);
  assert.equal(parseFile('x.Pes', ab(samplePes())).stitches.length, PES_STEPS.length);
});

test('parseFile refuses formats it cannot read', () => {
  assert.throws(() => parseFile('x.jef', new ArrayBuffer(10)), /Unsupported: \.jef/);
});
