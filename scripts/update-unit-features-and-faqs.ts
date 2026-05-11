// Per-unit features rewritten to match owner spec (May 2026):
//   Unit 1 Bobcat:  Two king beds · tub + walk-in shower · central AC/heat
//   Unit 2 Bear:    King bed, no sleeper · central AC/heat
//   Unit 3 Fox,     Unit 4 Raccoon,
//   Unit 7 Wolf,    Unit 8 Beaver:  King bed + sleeper sofa · central AC/heat
//   Unit 5 Deer,    Unit 6 Chipmunk: Queen bed · central AC/heat
//
// Also patches the apply page FAQ:
//   - Pet deposit: $200 → $400
//   - Adds new FAQ about the $35 TransUnion SmartMove credit check

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

// Features always added at the end of every unit (the "house standard" amenities).
const COMMON_STUDIO = [
  'Kitchenette',
  'Walk-in shower',
  'Smart TV + Wi-Fi',
  'Reserved off-street parking',
];

const FEATURES_BY_UNIT: Record<string, string[]> = {
  'unit-1': [
    'Two king beds',
    'Tub + walk-in shower',
    'Central AC and heating',
    'Full kitchen',
    'Wood-burning fireplace',
    'In-unit washer/dryer',
    'Smart TV + Wi-Fi',
    'Reserved off-street parking',
  ],
  'unit-2': [
    'King bed',
    'Central AC and heating',
    ...COMMON_STUDIO,
  ],
  'unit-3': [
    'King bed + sleeper sofa',
    'Central AC and heating',
    ...COMMON_STUDIO,
  ],
  'unit-4': [
    'King bed + sleeper sofa',
    'Central AC and heating',
    ...COMMON_STUDIO,
  ],
  'unit-5': [
    'Queen bed',
    'Central AC and heating',
    ...COMMON_STUDIO,
  ],
  'unit-6': [
    'Queen bed',
    'Central AC and heating',
    ...COMMON_STUDIO,
  ],
  'unit-7': [
    'King bed + sleeper sofa',
    'Central AC and heating',
    ...COMMON_STUDIO,
  ],
  'unit-8': [
    'King bed + sleeper sofa',
    'Central AC and heating',
    ...COMMON_STUDIO,
  ],
};

(async () => {
  // 1. Features
  console.log('Patching unit features…');
  const tx = client.transaction();
  for (const [id, labels] of Object.entries(FEATURES_BY_UNIT)) {
    const features = labels.map((label, i) => ({
      _key: `feat-${id}-${i}`,
      _type: 'unitFeature',
      label,
    }));
    tx.patch(id, (p) => p.set({ features }));
    console.log(`  ${id}: ${labels.length} features`);
  }
  await tx.commit();
  console.log('✓ Features patched.');

  // 2. FAQs
  console.log('\nPatching apply page FAQs…');
  const apply = await client.fetch<{
    faqs?: Array<{ _key: string; _type: string; q: string; a: string }>;
  }>(`*[_id == "applyPage"][0]{ faqs }`);

  const updatedFaqs = (apply?.faqs || []).map((f) => {
    if (f.q === 'Are pets allowed?') {
      return {
        ...f,
        a: 'Yes, on a case-by-case basis. There is a $400 non-refundable pet deposit per pet. Tell us about your pet on the application — type, count, breed, and weight — and we will follow up with any specifics.',
      };
    }
    if (f.q === 'Is there an application fee?') {
      return {
        ...f,
        a: 'Submitting the application is free. If we move forward after reviewing it, you will pay $35 directly to TransUnion for the SmartMove credit and background check — we will email you instructions when we get to that step.',
      };
    }
    return f;
  });

  // Add a new FAQ specifically about the TransUnion screening if not already there.
  if (!updatedFaqs.some((f) => /transunion|smartmove/i.test(f.q))) {
    updatedFaqs.push({
      _key: 'screening',
      _type: 'faqItem',
      q: 'How does the credit and background check work?',
      a: 'After we review your initial application, we use TransUnion SmartMove for credit, criminal, and eviction screening. The $35 fee is paid directly to TransUnion — not to us. We will email the link after our first review.',
    });
  }

  await client.patch('applyPage').set({ faqs: updatedFaqs }).commit();
  console.log(`✓ FAQs patched (${updatedFaqs.length} items total).`);

  console.log('\n✓ Done.');
})();
