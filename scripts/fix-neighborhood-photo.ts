// Replace the bogus Unsplash "Lake Tahoe" photo (which was actually a tropical
// beach) with the property's actual aerial drone shot as a temporary fallback.
// User can swap this for their own Tahoe photo in Studio when ready.

import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

(async () => {
  const file = path.resolve(process.cwd(), 'public/exterior/aerial.jpg');
  const buffer = await fs.readFile(file);

  console.log('Uploading property aerial as neighborhood hero…');
  const asset = await client.assets.upload('image', buffer, { filename: 'property-aerial.jpg' });

  await client
    .patch('neighborhoodPage')
    .set({
      heroPhoto: {
        _type: 'unitPhoto',
        asset: { _type: 'reference', _ref: asset._id },
        alt: 'Trout House from above — Kings Beach, North Lake Tahoe',
      },
    })
    .commit();

  console.log('✓ Neighborhood page hero updated to property aerial.');
})();
