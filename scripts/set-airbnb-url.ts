// Set the Airbnb listing URL on siteSettings.

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';
const token = process.env.SANITY_WRITE_TOKEN!;

const URL = 'https://www.airbnb.com/rooms/715982194049155250';

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

(async () => {
  await client.patch('siteSettings').set({ airbnbUrl: URL }).commit();
  console.log(`✓ siteSettings.airbnbUrl set to ${URL}`);
})();
