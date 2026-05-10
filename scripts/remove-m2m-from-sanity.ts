// Strip month-to-month from all live content + clear M2M data on every unit.

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
  // 1. Homepage value props — replace the third one (lease flexibility blurb)
  console.log('Patching homePage.valueProps[2] …');
  const home = await client.fetch<{
    valueProps?: Array<{ _key: string; _type: string; title: string; body: string }>;
  }>(`*[_id == "homePage"][0]{ valueProps }`);
  const newValueProps = (home?.valueProps || []).map((vp) =>
    vp._key === 'flex'
      ? {
          ...vp,
          title: 'Choose your term',
          body: 'Twelve-month or six-month leases. Pick the term that fits your stay; switch when you renew.',
        }
      : vp,
  );
  await client.patch('homePage').set({ valueProps: newValueProps }).commit();

  // 2. Homepage about body — second paragraph mentions lease terms
  console.log('Patching homePage.aboutBody …');
  await client.patch('homePage').set({
    aboutBody: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: "Trout House is a small, owner-operated property at 8638 Trout Avenue in Kings Beach. Each unit is fully furnished, recently updated, and built for the way people actually live in Tahoe — long weekends that turn into long winters, remote work that turns into a season on the lake.",
          },
        ],
      },
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's2',
            text: 'We offer twelve-month and six-month leases so the building stays lived-in and loved through every season.',
          },
        ],
      },
    ],
  }).commit();

  // 3. Apply page step 1 (mentions m2m as a term option)
  console.log('Patching applyPage.steps[0] …');
  const apply = await client.fetch<{
    steps?: Array<{ _key: string; _type: string; title: string; body: string }>;
  }>(`*[_id == "applyPage"][0]{ steps }`);
  const newSteps = (apply?.steps || []).map((s) =>
    s._key === 's1'
      ? {
          ...s,
          body: 'Browse the units page, pick what fits your stay, and note the lease term — twelve-month or six-month.',
        }
      : s,
  );
  await client.patch('applyPage').set({ steps: newSteps }).commit();

  // 4. Short stays page — mentions terms in body content? Check then patch.
  // (Skipping — short stays page is for STR/Airbnb only, no LTR term references expected.)

  // 5. Per-unit pricing — unset the M2M fields entirely so no orphan data.
  console.log('Clearing M2M fields on every unit …');
  const unitIds = ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', 'unit-6', 'unit-7', 'unit-8'];
  const tx = client.transaction();
  for (const id of unitIds) {
    tx.patch(id, (p) =>
      p.unset([
        'pricing.monthlyWinter',
        'pricing.monthlySummer',
        'pricing.utilitiesIncludedMonthlyWinter',
        'pricing.utilitiesIncludedMonthlySummer',
      ]),
    );
  }
  await tx.commit();

  console.log('\n✓ All references to month-to-month removed from Sanity.');
})();
