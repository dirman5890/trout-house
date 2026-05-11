// Swap the Short Stays sidebar detail photo from the parking-lot drone
// to the painted-sunset shot — better mood for "book a short stay."

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

(async () => {
  const buffer = await fs.readFile(
    path.resolve(process.cwd(), 'public/neighborhood/IMG_4663.jpg'),
  );
  const asset = await client.assets.upload('image', buffer, { filename: 'shortstays-sunset.jpg' });

  await client.patch('shortStaysPage').set({
    detailImage: {
      _type: 'unitPhoto',
      asset: { _type: 'reference', _ref: asset._id },
      alt: 'Sunset over Lake Tahoe — two blocks from Bear',
    },
  }).commit();

  console.log('✓ Short stays sidebar photo swapped to the painted sunset.');
})();
