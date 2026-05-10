// Seed the homepage gallery with the property + lake photos we have.
// User will add more (neighborhood photos) via Studio when those land.

import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

// Order matters — first is the primary card in the grid.
const PHOTOS: { file: string; alt: string }[] = [
  { file: 'public/lake/kings-beach.jpg', alt: 'Lake Tahoe shoreline at Kings Beach' },
  { file: 'public/exterior/aerial.jpg', alt: 'Trout House from above — snow on the rooftops' },
  { file: 'public/exterior/snow.jpg', alt: 'Trout House exterior in winter' },
  { file: 'public/exterior/aerial-overhead.jpg', alt: 'Trout House top-down view' },
];

async function uploadPhoto(file: string, alt: string) {
  const buffer = await fs.readFile(path.resolve(process.cwd(), file));
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(file),
  });
  return {
    _key: asset._id.replace(/[^a-z0-9]/gi, '').slice(-12), // deterministic-ish key
    _type: 'unitPhoto',
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  };
}

(async () => {
  console.log(`Uploading ${PHOTOS.length} photos…`);
  const gallery = [];
  for (const p of PHOTOS) {
    const photo = await uploadPhoto(p.file, p.alt);
    gallery.push(photo);
    console.log(`  ✓ ${p.file}`);
  }

  console.log('\nPatching homePage.gallery…');
  await client.patch('homePage').set({ gallery }).commit();
  console.log(`✓ Homepage gallery seeded with ${gallery.length} photos.`);
})();
