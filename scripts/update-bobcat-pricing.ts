// Bobcat (Unit 1) 12-month rate → $3,250.

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
    .patch('unit-1')
    .set({ 'pricing.twelveMonth': 3250, 'pricing.sixMonth': 3950 })
    .commit();
  console.log('✓ Unit 1 (Bobcat) — 12mo $3,250 · 6mo $3,950');
})();
