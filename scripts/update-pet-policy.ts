// $200 non-refundable pet deposit per pet — update FAQ.

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
    f.q === 'Are pets allowed?'
      ? {
          ...f,
          a: 'Yes, on a case-by-case basis. There is a $200 non-refundable pet deposit per pet. Tell us about your pet on the application and we will follow up with any specifics (size, breed restrictions, etc.).',
        }
      : f,
  );

  await client.patch('applyPage').set({ faqs }).commit();
  console.log('✓ Pet FAQ updated — $200 non-refundable per pet.');
})();
