// One-shot: convert HEIC → optimized JPG, upload to Sanity, append to
// neighborhoodPage.gallery. Skips the MOV file. Idempotent in that re-running
// uploads new asset versions; you would dedupe in Studio after.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const SRC_DIR = path.resolve(process.cwd(), 'CB PHOTO DUMP');
const OUT_DIR = path.resolve(process.cwd(), 'public/neighborhood');
const MAX_DIM = 2400;
const QUALITY = 82;

await fs.mkdir(OUT_DIR, { recursive: true });

const files = (await fs.readdir(SRC_DIR))
  .filter((f) => f.toLowerCase().endsWith('.heic'))
  .sort();

console.log(`Found ${files.length} HEIC files. Converting + uploading…\n`);

const galleryItems = [];

for (const [i, file] of files.entries()) {
  const srcPath = path.join(SRC_DIR, file);
  const outName = file.replace(/\.heic$/i, '.jpg');
  const outPath = path.join(OUT_DIR, outName);

  try {
    // 1. HEIC → JPEG buffer (pure JS, slow but reliable on Windows)
    const heicBuffer = await fs.readFile(srcPath);
    const jpegBuffer = await heicConvert({
      buffer: heicBuffer,
      format: 'JPEG',
      quality: 0.92,
    });

    // 2. Sharp: resize + recompress to web size
    const meta = await sharp(jpegBuffer).metadata();
    const longEdge = Math.max(meta.width || 0, meta.height || 0);
    const pipeline = sharp(jpegBuffer).rotate(); // honor EXIF orientation
    if (longEdge > MAX_DIM) {
      pipeline.resize({
        width: meta.width >= meta.height ? MAX_DIM : null,
        height: meta.height > meta.width ? MAX_DIM : null,
        withoutEnlargement: true,
      });
    }
    const finalBuffer = await pipeline
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();
    await fs.writeFile(outPath, finalBuffer);

    // 3. Upload to Sanity (content-addressed → no dupes)
    const asset = await client.assets.upload('image', finalBuffer, {
      filename: outName,
    });

    galleryItems.push({
      _key: `cb-${asset._id.slice(-12)}`,
      _type: 'unitPhoto',
      asset: { _type: 'reference', _ref: asset._id },
      alt: 'Trout House neighborhood — Kings Beach, Lake Tahoe',
    });

    console.log(
      `  ✓ ${String(i + 1).padStart(2)}/${files.length}  ${file}  →  ${outName}  (${Math.round(finalBuffer.length / 1024)} KB)`,
    );
  } catch (err) {
    console.error(`  ✗ ${file}: ${err.message}`);
  }
}

console.log(`\nPatching neighborhoodPage.gallery with ${galleryItems.length} photos…`);
await client.patch('neighborhoodPage').set({ gallery: galleryItems }).commit();
console.log('✓ Done. Open Studio to reorder, edit alt text, or move some to the homepage gallery.');
