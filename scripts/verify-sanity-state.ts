// Quick health check — print current Sanity values for the things that
// keep coming up: hero photo, neighborhood photo, short stays unit ref.

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
    home: { heroPhoto?: { asset?: { url: string } } };
    neighborhood: { heroPhoto?: { asset?: { url: string } } };
    shortStays: { unit?: { unitNumber: string; name: string } };
  }>(`{
    "home": *[_id == "homePage"][0]{ heroPhoto{ asset->{ url } } },
    "neighborhood": *[_id == "neighborhoodPage"][0]{ heroPhoto{ asset->{ url } } },
    "shortStays": *[_id == "shortStaysPage"][0]{ "unit": unit->{ unitNumber, name } }
  }`);

  console.log('Homepage hero:      ', data.home?.heroPhoto?.asset?.url || '(none)');
  console.log('Neighborhood hero:  ', data.neighborhood?.heroPhoto?.asset?.url || '(none)');
  console.log('Short stays unit:   ', data.shortStays?.unit
    ? `Unit ${data.shortStays.unit.unitNumber} (${data.shortStays.unit.name})`
    : '(none)',
  );
})();
