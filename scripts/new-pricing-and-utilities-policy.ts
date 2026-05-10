// 1. Studio 6-month bumped to $2,095 (was $1,995)
// 2. Bear (Unit 2) priced for its eventual LTR conversion: $2,095 / $2,295
// 3. Bobcat (Unit 1) stays at $3,400 / $3,575 (no change requested)
// 4. Clear the now-unused utilitiesIncludedTwelveMonth / utilitiesIncludedSixMonth
//    booleans on every unit (both terms share the same utility policy)
// 5. Utilities FAQ rewritten to clarify water/trash always included

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

// Studio units (all except Bobcat which is 2BR, and Bear which has its own rate)
const STUDIO_IDS = ['unit-3', 'unit-4', 'unit-5', 'unit-6', 'unit-7', 'unit-8'];

(async () => {
  console.log('Patching unit pricing…');
  const tx = client.transaction();

  // Studios: 12mo $1,895 (unchanged), 6mo $1,995 → $2,095
  for (const id of STUDIO_IDS) {
    tx.patch(id, (p) =>
      p
        .set({ 'pricing.twelveMonth': 1895, 'pricing.sixMonth': 2095 })
        .unset([
          'pricing.utilitiesIncludedTwelveMonth',
          'pricing.utilitiesIncludedSixMonth',
        ]),
    );
  }

  // Bear (Unit 2) — bigger studio, premium rate when it converts to LTR
  tx.patch('unit-2', (p) =>
    p
      .set({ 'pricing.twelveMonth': 2095, 'pricing.sixMonth': 2295 })
      .unset([
        'pricing.utilitiesIncludedTwelveMonth',
        'pricing.utilitiesIncludedSixMonth',
      ]),
  );

  // Bobcat (Unit 1) — keep current rates, just unset the now-unused booleans
  tx.patch('unit-1', (p) =>
    p.unset([
      'pricing.utilitiesIncludedTwelveMonth',
      'pricing.utilitiesIncludedSixMonth',
    ]),
  );

  await tx.commit();
  console.log('✓ Pricing patched.');

  // Utilities FAQ
  console.log('\nRewriting utilities FAQ…');
  const apply = await client.fetch<{
    faqs?: Array<{ _key: string; _type: string; q: string; a: string }>;
  }>(`*[_id == "applyPage"][0]{ faqs }`);
  const faqs = (apply?.faqs || []).map((f) =>
    f.q === 'Are utilities included?'
      ? {
          ...f,
          a: 'Water and trash are included on every lease. Tenants pay their own electric (Liberty) and internet (Spectrum) directly — we have found this saves tenants money compared to bundling everything into rent.',
        }
      : f,
  );
  await client.patch('applyPage').set({ faqs }).commit();
  console.log('✓ Utilities FAQ rewritten.');

  console.log('\n✓ Done.');
})();
