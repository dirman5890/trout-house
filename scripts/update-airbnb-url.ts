// Update the Airbnb URL with the share ID — the bare rooms/ID URL was 404'ing.

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const URL =
  'https://www.airbnb.com/rooms/715982194049155250?s=67&unique_share_id=a2f347b2-6c42-48b1-b57f-6535331736b2';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

(async () => {
  await client.patch('siteSettings').set({ airbnbUrl: URL }).commit();
  console.log('✓ Airbnb URL updated.');
})();
