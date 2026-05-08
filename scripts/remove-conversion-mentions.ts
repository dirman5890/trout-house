// Remove all mentions of the boutique hotel conversion from live Sanity content.
// Safe to re-run.
//
// Run with: npx tsx scripts/remove-conversion-mentions.ts

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const projectId = required('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';
const token = required('SANITY_WRITE_TOKEN');

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Missing env var ${name}`);
    process.exit(1);
  }
  return v;
}

// Replacement second paragraph for the homepage about section — keeps the
// lease-flexibility message, drops the hotel conversion language.
const ABOUT_BODY = [
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
        text: "We lease on flexible terms — twelve months, six months, or month-to-month, with winter and summer rates — so the building stays lived-in and loved through every season.",
      },
    ],
  },
];

async function main() {
  console.log('Patching homePage.aboutBody…');
  await client.patch('homePage').set({ aboutBody: ABOUT_BODY }).commit();

  console.log('Removing conversion FAQ from applyPage…');
  // Pull out any FAQ whose question or answer mentions hotel/conversion/TRPA.
  const apply = await client.fetch<{ faqs?: Array<{ _key: string; q: string; a: string }> }>(
    `*[_id == "applyPage"][0]{ faqs }`,
  );
  const filtered = (apply?.faqs || []).filter((f) => {
    const text = `${f.q} ${f.a}`.toLowerCase();
    return !/(hotel|conversion|trpa|converting)/.test(text);
  });
  await client.patch('applyPage').set({ faqs: filtered }).commit();
  console.log(`  ${(apply?.faqs?.length || 0) - filtered.length} FAQ removed`);

  console.log('\n✓ Done. Refresh the site to verify.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
