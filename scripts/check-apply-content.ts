// Verify current state of applyPage content in Sanity.

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
  const data = await client.fetch<{
    faqs?: Array<{ q: string; a: string }>;
    steps?: Array<{ title: string; body: string }>;
  }>(`*[_id == "applyPage"][0]{ faqs, steps }`);

  console.log('FAQs:');
  data.faqs?.forEach((f, i) => console.log(`  ${i + 1}. ${f.q}`));

  console.log('\nStep 3 body:');
  console.log(`  ${data.steps?.[2]?.body || '(no step 3)'}`);
})();
