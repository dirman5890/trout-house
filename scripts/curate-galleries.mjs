// Curated gallery lists — homepage gets a tight 10-photo mix of property + lake +
// neighborhood; neighborhood page gets a broader 15-photo story of the area.
// Re-uploads to Sanity are content-addressed (same bytes → same asset _id),
// so this is idempotent.

import { promises as fs } from 'node:fs';
import path from 'node:path';
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

const HOMEPAGE = [
  { file: 'public/neighborhood/IMG_1266.jpg', alt: 'Lake Tahoe pier reflecting on glass-calm water' },
  { file: 'public/exterior/aerial.jpg', alt: 'Trout House from above — snow on the rooftops' },
  { file: 'public/neighborhood/IMG_9108.jpg', alt: 'Winter sunset over Lake Tahoe from Kings Beach' },
  { file: 'public/exterior/snow.jpg', alt: 'Trout House exterior in winter' },
  { file: 'public/neighborhood/IMG_4663.jpg', alt: 'Painted sunset over Lake Tahoe' },
  { file: 'public/neighborhood/IMG_0415.jpg', alt: 'Crowds gathered on Kings Beach at sunset' },
  { file: 'public/exterior/aerial-overhead.jpg', alt: 'Trout House — top-down view' },
  { file: 'public/neighborhood/IMG_1861.jpg', alt: 'Trout House under a heavy snow' },
  { file: 'public/neighborhood/IMG_4248.jpg', alt: 'Sunset over Lake Tahoe framed by hilltop pines' },
  { file: 'public/neighborhood/70846126241__F7344C26-9F07-47F1-A1E6-C2566BE9B20C.jpg', alt: 'Stairs down to a rocky Lake Tahoe cove' },
];

const NEIGHBORHOOD = [
  { file: 'public/neighborhood/IMG_4663.jpg', alt: 'Painted sunset over Lake Tahoe' },
  { file: 'public/neighborhood/IMG_9108.jpg', alt: 'Winter sunset over Lake Tahoe from Kings Beach' },
  { file: 'public/neighborhood/IMG_1266.jpg', alt: 'Lake Tahoe pier reflecting on glass-calm water' },
  { file: 'public/neighborhood/IMG_0415.jpg', alt: 'Crowds gathered on Kings Beach at sunset' },
  { file: 'public/neighborhood/IMG_3630.jpg', alt: 'Wading on Kings Beach at twilight' },
  { file: 'public/neighborhood/IMG_4645.jpg', alt: 'Music on the beach at sunset, Kings Beach' },
  { file: 'public/neighborhood/70846126241__F7344C26-9F07-47F1-A1E6-C2566BE9B20C.jpg', alt: 'Stairs down to a rocky Lake Tahoe cove' },
  { file: 'public/neighborhood/IMG_0484.jpg', alt: 'Hilltop view of the North Shore marina' },
  { file: 'public/neighborhood/IMG_3573.jpg', alt: 'Sun rays through pines, Lake Tahoe in the distance' },
  { file: 'public/neighborhood/IMG_4248.jpg', alt: 'Sunset over Lake Tahoe framed by hilltop pines' },
  { file: 'public/neighborhood/IMG_4582.jpg', alt: 'Lone pine over Lake Tahoe from a hilltop' },
  { file: 'public/neighborhood/IMG_4584.jpg', alt: 'Boats moored at the North Shore marina' },
  { file: 'public/neighborhood/IMG_9111.jpg', alt: 'Winter sunset over Lake Tahoe and snowy beach' },
  { file: 'public/neighborhood/IMG_9394.jpg', alt: 'White Caps Pizza in heavy snow, Kings Beach' },
  { file: 'public/neighborhood/IMG_9106.jpg', alt: 'Kings Beach main street at winter dusk' },
];

async function uploadAndRef(item, idx) {
  const buffer = await fs.readFile(path.resolve(process.cwd(), item.file));
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(item.file),
  });
  return {
    _key: `g${idx}-${asset._id.slice(-10)}`,
    _type: 'unitPhoto',
    asset: { _type: 'reference', _ref: asset._id },
    alt: item.alt,
  };
}

async function buildGallery(name, list) {
  console.log(`\n${name} — uploading ${list.length} photos…`);
  const out = [];
  for (let i = 0; i < list.length; i++) {
    out.push(await uploadAndRef(list[i], i));
    process.stdout.write('.');
  }
  console.log('');
  return out;
}

const homepageGallery = await buildGallery('Homepage gallery', HOMEPAGE);
await client.patch('homePage').set({ gallery: homepageGallery }).commit();
console.log(`✓ Homepage gallery set (${homepageGallery.length} photos).`);

const neighborhoodGallery = await buildGallery('Neighborhood gallery', NEIGHBORHOOD);
await client.patch('neighborhoodPage').set({ gallery: neighborhoodGallery }).commit();
console.log(`✓ Neighborhood gallery set (${neighborhoodGallery.length} photos).`);

console.log('\n✓ Done. Reorder/edit alt text in Studio if you want.');
