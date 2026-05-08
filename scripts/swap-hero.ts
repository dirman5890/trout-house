// Swap the homepage hero photo to the Tahoe stock image at public/lake/tahoe-hero.jpg.
// Run with: npx tsx scripts/swap-hero.ts

import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
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

async function main() {
  const file = path.resolve(process.cwd(), 'public/lake/tahoe-hero.jpg');
  const buffer = await fs.readFile(file);

  console.log('Uploading hero photo…');
  const asset = await client.assets.upload('image', buffer, { filename: 'tahoe-hero.jpg' });
  console.log(`  asset _id: ${asset._id}`);

  console.log('Patching homePage.heroPhoto…');
  await client
    .patch('homePage')
    .set({
      heroPhoto: {
        _type: 'unitPhoto',
        asset: { _type: 'reference', _ref: asset._id },
        alt: 'Sunrise over Lake Tahoe',
      },
    })
    .commit();

  console.log('\n✓ Done. Refresh the homepage in 60s (or right now in dev mode).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
