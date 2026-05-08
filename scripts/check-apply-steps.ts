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
  const data = await client.fetch<{ steps?: Array<{ title: string; body: string }> }>(`*[_id == "applyPage"][0]{ steps }`);
  data.steps?.forEach((s, i) => console.log(`${i + 1}. ${s.title}\n   ${s.body.slice(0, 80)}…`));
})();
