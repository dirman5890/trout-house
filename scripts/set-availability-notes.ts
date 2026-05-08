// Pre-populate availabilityNote for units with known lease end dates
// (from the spreadsheet). User can edit/clear these in Studio.

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

const NOTES: Record<string, string> = {
  'unit-1': 'Leased through March 2027',     // Ashley Wilson
  'unit-3': 'Available September 2026',       // After Carol Ann (tentative Jun–Aug)
  'unit-4': 'Long-term: available September 2026',  // After Shakespeare Festival
  'unit-5': 'Available October 2026',         // After Riley Haswell
  'unit-6': 'Available December 2026',        // After Karma & Jim
  'unit-7': 'Available September 2026',       // After Mary's Airbnb stay
  'unit-8': 'Available now',                  // Vacant outside short Airbnb window
};

(async () => {
  const tx = client.transaction();
  for (const [id, note] of Object.entries(NOTES)) {
    tx.patch(id, (p) => p.set({ availabilityNote: note }));
    console.log(`  ${id} → "${note}"`);
  }
  await tx.commit();
  console.log('\n✓ Done. Edit any in Studio → unit → Basics → Availability note.');
})();
