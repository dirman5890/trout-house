// Move the short-term-rental flag from Unit 1 (Bobcat) to Unit 2 (Bear)
// and update the /short-stays page to feature Unit 2.
//
// To swap back later, edit in Studio:
//   1. Site → Units → Bobcat → Links → toggle "Also bookable on Airbnb" ON
//   2. Site → Units → Bear → Links → toggle "Also bookable on Airbnb" OFF
//   3. Site → Short stays page → Featured unit → change reference to Bobcat (unit-1)

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
    .transaction()
    .patch('unit-1', (p) => p.set({ shortTermAvailable: false }))
    .patch('unit-2', (p) => p.set({ shortTermAvailable: true }))
    .patch('shortStaysPage', (p) =>
      p.set({ unit: { _type: 'reference', _ref: 'unit-2' } }),
    )
    .commit();

  console.log('✓ STR is now Unit 2 (Bear). /short-stays page updated.');
})();
