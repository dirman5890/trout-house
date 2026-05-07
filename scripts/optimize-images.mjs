// Convert raw photos in /PHOTOS/ into web-ready JPGs in /public/units, /public/exterior, etc.
// Run with: node scripts/optimize-images.mjs
//
// Mapping is explicit (rather than parsed) because source filenames are inconsistent —
// case differences, optional dashes, abbreviations like "kitch", parenthetical suffixes.
//
// Output JPGs are resized to max 2400px on the long edge at quality 82.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, 'PHOTOS');
const PUBLIC = path.join(ROOT, 'public');

const MAX_DIM = 2400;
const QUALITY = 82;

const MAPPING = [
  // Exteriors
  ['Aerial.png', 'exterior/aerial.jpg'],
  ['Exterior Aerial.png', 'exterior/aerial-overhead.jpg'],
  ['Exterior Drone.png', 'exterior/drone.jpg'],
  ['Exterior Parking Lot.png', 'exterior/parking.jpg'],
  ['Exterior Snow.png', 'exterior/snow.jpg'],

  // Typical bathroom — used for units that don't have their own bathroom shot.
  ['Typical Bathroom.png', 'units/typical/bathroom.jpg'],

  // Unit 1 (Bobcat) — 2BR
  ['Unit 1 Living.png', 'units/1/living.jpg'],
  ['Unit 1 living room.png', 'units/1/living-room.jpg'],
  ['Unit 1 Interior.png', 'units/1/interior.jpg'],
  ['Unit 1 Bedroom.png', 'units/1/bedroom-1.jpg'],
  ['Unit 1 bedroom (2).png', 'units/1/bedroom-2.jpg'],
  ['Unit 1 - bathroom.png', 'units/1/bathroom.jpg'],

  // Unit 2 (Chipmunk)
  ['Unit 2 total.png', 'units/2/overview.jpg'],
  ['Unit 2 loft.png', 'units/2/loft.jpg'],
  ['Unit 2 Entry.png', 'units/2/entry.jpg'],
  ['Unit 2 - kitch.png', 'units/2/kitchen.jpg'],
  ['Unit 2 - Kitchen 2.png', 'units/2/kitchen-2.jpg'],

  // Unit 3 (Fox)
  ['Unit 3.png', 'units/3/overview.jpg'],
  ['Unit 3 Interior.png', 'units/3/interior.jpg'],

  // Unit 4 (Raccoon)
  ['Unit 4 - Kitchen and Living.png', 'units/4/kitchen-living.jpg'],
  ['Unit 4 - Kitchen.JPG', 'units/4/kitchen.jpg'],
  ['Unit 4 Bathroom.png', 'units/4/bathroom.jpg'],

  // Unit 5 (Bear)
  ['Unit 5 - Living Room_Kitchen.png', 'units/5/living-kitchen.jpg'],
  ['Unit 5 - Bedroom_Living Area.png', 'units/5/bedroom-living.jpg'],
  ['Unit 5 - bathroom (2).png', 'units/5/bathroom.jpg'],

  // Unit 6 (Deer)
  ['Unit 6.png', 'units/6/overview.jpg'],
  ['Unit 6 - Living Room.png', 'units/6/living.jpg'],
  ['Unit 6 - Bathroom.png', 'units/6/bathroom.jpg'],
  ['Unit 6 exterior.png', 'units/6/exterior.jpg'],

  // Unit 7 (Wolf)
  ['Unit 7.png', 'units/7/overview.jpg'],
  ['Unit 7 - Entry.png', 'units/7/entry.jpg'],

  // Unit 8 (Beaver)
  ['Unit 8.png', 'units/8/overview.jpg'],
  ['Unit 8 - bathroom.png', 'units/8/bathroom.jpg'],
  ['Unit 8 - Exterior.png', 'units/8/exterior.jpg'],
];

async function ensureDir(file) {
  await fs.mkdir(path.dirname(file), { recursive: true });
}

async function convert(srcRel, outRel) {
  const src = path.join(SRC, srcRel);
  const out = path.join(PUBLIC, outRel);

  try {
    await fs.access(src);
  } catch {
    console.warn(`  skip — missing source: ${srcRel}`);
    return null;
  }

  await ensureDir(out);

  const meta = await sharp(src).metadata();
  const longEdge = Math.max(meta.width || 0, meta.height || 0);
  const pipeline = sharp(src).rotate(); // honor EXIF orientation

  if (longEdge > MAX_DIM) {
    pipeline.resize({
      width: meta.width >= meta.height ? MAX_DIM : null,
      height: meta.height > meta.width ? MAX_DIM : null,
      withoutEnlargement: true,
    });
  }

  const { size } = await pipeline
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(out);

  return { srcSize: (await fs.stat(src)).size, outSize: size };
}

function fmt(bytes) {
  return bytes >= 1e6
    ? `${(bytes / 1e6).toFixed(1)} MB`
    : `${(bytes / 1e3).toFixed(0)} KB`;
}

async function main() {
  console.log(`Converting ${MAPPING.length} images…`);
  let totalSrc = 0;
  let totalOut = 0;
  let written = 0;

  for (const [srcRel, outRel] of MAPPING) {
    const result = await convert(srcRel, outRel);
    if (result) {
      written += 1;
      totalSrc += result.srcSize;
      totalOut += result.outSize;
      console.log(
        `  ✓ ${srcRel.padEnd(45)} → ${outRel.padEnd(38)}  ${fmt(result.srcSize)} → ${fmt(result.outSize)}`,
      );
    }
  }

  console.log('');
  console.log(`Done. ${written}/${MAPPING.length} images written.`);
  console.log(`Total: ${fmt(totalSrc)} → ${fmt(totalOut)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
