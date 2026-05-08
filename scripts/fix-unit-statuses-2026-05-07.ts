// Fix unit statuses + availability notes to match the lease spreadsheet:
//
// - Unit 6 (Chipmunk): Karma & Jim through Nov 30, 2026 → status 'leased'
// - Unit 8 (Beaver): vacant now, Mandie Airbnb Jun 7–Jul 10 → note the window
// - Unit 4 (Raccoon): vacant now, Shakespeare Jun 20–Sep 2 → note the window

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
  await client
    .transaction()
    .patch('unit-6', (p) =>
      p.set({
        status: 'leased',
        availabilityNote: 'Available December 2026',
      }),
    )
    .patch('unit-8', (p) =>
      p.set({
        availabilityNote: 'Available through June 7 (1-month window)',
      }),
    )
    .patch('unit-4', (p) =>
      p.set({
        availabilityNote: 'Available through June 19 · Long-term: September 2026',
      }),
    )
    .commit();

  console.log('✓ Statuses + notes updated.');
  console.log('  Unit 6 (Chipmunk) → leased, "Available December 2026"');
  console.log('  Unit 8 (Beaver)   → "Available through June 7 (1-month window)"');
  console.log('  Unit 4 (Raccoon)  → "Available through June 19 · Long-term: September 2026"');
})();
