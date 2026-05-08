// Reuse the homepage's Lake Tahoe hero photo on the neighborhood page too,
// so both pages show actual Tahoe (not the property aerial fallback).

import { createClient } from '@sanity/client';
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
  const home = await client.fetch<{ heroPhoto?: { asset?: { _id: string } } }>(
    `*[_id == "homePage"][0]{ heroPhoto{ asset->{ _id } } }`,
  );
  const ref = home?.heroPhoto?.asset?._id;
  if (!ref) {
    console.error('No homepage hero photo asset found');
    process.exit(1);
  }
  await client
    .patch('neighborhoodPage')
    .set({
      heroPhoto: {
        _type: 'unitPhoto',
        asset: { _type: 'reference', _ref: ref },
        alt: 'Lake Tahoe at Kings Beach',
      },
    })
    .commit();
  console.log('✓ Neighborhood page hero now uses the Lake Tahoe photo.');
})();
