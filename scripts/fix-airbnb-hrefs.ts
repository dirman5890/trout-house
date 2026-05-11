// Find every CTA on every page that points to an old/stale Airbnb URL and
// repoint them to the canonical siteSettings.airbnbUrl.

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
  const settings = await client.fetch<{ airbnbUrl?: string }>(
    `*[_id == "siteSettings"][0]{ airbnbUrl }`,
  );
  const correctUrl = settings?.airbnbUrl;
  if (!correctUrl) {
    console.error('No siteSettings.airbnbUrl set — fix that first.');
    process.exit(1);
  }
  console.log('Canonical Airbnb URL:', correctUrl, '\n');

  // Audit every CTA-bearing field that might point to Airbnb.
  const home = await client.fetch<{
    heroPrimaryCta?: { href?: string; label?: string };
    heroSecondaryCta?: { href?: string; label?: string };
    aboutPrimaryCta?: { href?: string; label?: string };
    aboutSecondaryCta?: { href?: string; label?: string };
  }>(`*[_id == "homePage"][0]{ heroPrimaryCta, heroSecondaryCta, aboutPrimaryCta, aboutSecondaryCta }`);

  const fixes: Record<string, unknown> = {};
  for (const [field, cta] of Object.entries(home || {})) {
    if (!cta?.href) continue;
    if (/airbnb\.com/.test(cta.href) && cta.href !== correctUrl) {
      console.log(`  homePage.${field}.href`);
      console.log(`    was: ${cta.href}`);
      console.log(`    now: ${correctUrl}`);
      fixes[`${field}.href`] = correctUrl;
      // also ensure external is true
      fixes[`${field}.external`] = true;
    }
  }

  if (Object.keys(fixes).length === 0) {
    console.log('No stale Airbnb URLs found on homePage. ✓');
  } else {
    await client.patch('homePage').set(fixes).commit();
    console.log(`\n✓ Patched ${Object.keys(fixes).length / 2} CTA(s) on homePage.`);
  }
})();
