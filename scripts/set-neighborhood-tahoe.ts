// Upload the verified Lake Tahoe shoreline photo (Leo_Visions / Unsplash)
// and set it as the neighborhood page hero — distinct from the homepage hero
// so the two pages feel different.

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
    path.resolve(process.cwd(), 'public/lake/kings-beach.jpg'),
  );

  console.log('Uploading Lake Tahoe shoreline photo…');
  const asset = await client.assets.upload('image', buffer, {
    filename: 'lake-tahoe-shoreline.jpg',
  });

  await client
    .patch('neighborhoodPage')
    .set({
      heroPhoto: {
        _type: 'unitPhoto',
        asset: { _type: 'reference', _ref: asset._id },
        alt: 'Lake Tahoe shoreline — North Shore',
      },
    })
    .commit();

  console.log('✓ Neighborhood hero updated to verified Lake Tahoe photo.');
})();
