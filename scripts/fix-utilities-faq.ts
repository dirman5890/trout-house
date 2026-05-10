// Patch live applyPage utilities FAQ — used to mention M2M.

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
  const apply = await client.fetch<{
    faqs?: Array<{ _key: string; _type: string; q: string; a: string }>;
  }>(`*[_id == "applyPage"][0]{ faqs }`);

  const faqs = (apply?.faqs || []).map((f) =>
    f.q === 'Are utilities included?'
      ? {
          ...f,
          a: 'Utilities are included on the 6-month lease. On the 12-month lease, the tenant pays utilities directly — most tenants find this saves money over a full year.',
        }
      : f,
  );

  await client.patch('applyPage').set({ faqs }).commit();
  console.log('✓ Utilities FAQ rewritten — no M2M mention.');
})();
