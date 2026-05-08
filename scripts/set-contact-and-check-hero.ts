// Set the contact email + report the current hero photo so we can confirm what's live.

import { createClient } from '@sanity/client';
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
  await client
    .patch('siteSettings')
    .set({ contactEmail: 'trouthousellc@gmail.com' })
    .commit();
  console.log('✓ contactEmail set to trouthousellc@gmail.com');

  const home = await client.fetch<{ heroPhoto?: { asset?: { url: string } } }>(
    `*[_id == "homePage"][0]{ "heroPhoto": heroPhoto{ asset->{ url } } }`,
  );
  console.log(`\nCurrent hero photo URL:`);
  console.log(`  ${home?.heroPhoto?.asset?.url || '(none set)'}`);

  const ss = await client.fetch<{ unit?: { unitNumber: string; name: string } }>(
    `*[_id == "shortStaysPage"][0]{ "unit": unit->{ unitNumber, name } }`,
  );
  console.log(`\nshortStaysPage referenced unit:`);
  console.log(`  Unit ${ss?.unit?.unitNumber} (${ss?.unit?.name})`);
})();
