// Convert CB PHOTO DUMP photos → optimized JPGs, upload to Sanity, set as
// the neighborhood gallery. Handles both real HEIC and JPEG-with-.HEIC-extension
// (common when photos get shared via certain apps).

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

console.log(`Found ${files.length} HEIC-extension files. Converting + uploading…\n`);

const galleryItems = [];

for (const [i, file] of files.entries()) {
  const srcPath = path.join(SRC_DIR, file);
  const outName = file.replace(/\.heic$/i, '.jpg');
  const outPath = path.join(OUT_DIR, outName);

  try {
    const srcBuffer = await fs.readFile(srcPath);

    // Try real HEIC first (older AVC variant). If that throws, fall back
    // to treating the buffer as already-decodable (often it's a JPEG with
    // a .HEIC extension — common with iPhone photos shared via various apps).
    let inputBuffer = srcBuffer;
    try {
      inputBuffer = await heicConvert({ buffer: srcBuffer, format: 'JPEG', quality: 0.92 });
    } catch {
      // not a real HEIC — let sharp try directly
    }

    const meta = await sharp(inputBuffer).metadata();
    const longEdge = Math.max(meta.width || 0, meta.height || 0);
    const pipeline = sharp(inputBuffer).rotate(); // honor EXIF orientation
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

    const asset = await client.assets.upload('image', finalBuffer, { filename: outName });

    galleryItems.push({
      _key: `cb-${asset._id.slice(-12)}-${i}`,
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

console.log(`\nWriting neighborhoodPage.gallery (${galleryItems.length} photos)…`);
await client.patch('neighborhoodPage').set({ gallery: galleryItems }).commit();
console.log('✓ Done.');
