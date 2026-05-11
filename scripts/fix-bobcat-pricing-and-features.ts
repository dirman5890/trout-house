// Bobcat: correct 6-month to $3,450 and remove "Private deck" from features
// (verified false with the owner).

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
  const unit = await client.fetch<{
    features?: Array<{ _key: string; _type: string; label: string }>;
  }>(`*[_id == "unit-1"][0]{ features }`);

  const features = (unit?.features || []).filter(
    (f) => !/private deck/i.test(f.label),
  );

  await client
    .patch('unit-1')
    .set({ 'pricing.sixMonth': 3450, features })
    .commit();

  console.log('✓ Bobcat 6-month → $3,450');
  console.log(`✓ "Private deck" removed (${(unit?.features?.length || 0) - features.length} feature dropped)`);
})();
