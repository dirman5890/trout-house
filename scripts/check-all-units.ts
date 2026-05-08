// Print current status + availability of all units.

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
  const units = await client.fetch<
    Array<{ unitNumber: string; name: string; status: string; availabilityNote?: string }>
  >(`*[_type == "unit"] | order(unitNumber asc){ unitNumber, name, status, availabilityNote }`);

  console.log('Unit | Name      | Status        | Note');
  console.log('-----|-----------|---------------|---------------------------');
  units.forEach((u) =>
    console.log(`  ${u.unitNumber}  | ${u.name.padEnd(9)} | ${u.status.padEnd(13)} | ${u.availabilityNote || ''}`),
  );

  const homePageShows = units.filter((u) => u.status === 'available').length;
  console.log(`\nHomepage "Available now" section shows: ${homePageShows} unit(s)`);
})();
