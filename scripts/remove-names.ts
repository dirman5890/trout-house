// Strip first names from public-facing apply step 3.

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
    steps?: Array<{ _key: string; _type: string; title: string; body: string }>;
  }>(`*[_id == "applyPage"][0]{ steps }`);

  const steps = (apply?.steps || []).map((s) =>
    s._key === 's3'
      ? {
          ...s,
          body: "We review every application personally and reach out by email with next steps — questions, a viewing, or a lease offer.",
        }
      : s,
  );

  await client.patch('applyPage').set({ steps }).commit();
  console.log('✓ Step 3 rewritten — no first names.');
})();
