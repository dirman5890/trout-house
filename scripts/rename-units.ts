// One-shot script to rename units in Sanity. Idempotent.
//
// Run with: npx tsx scripts/rename-units.ts

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const projectId = required('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';
const token = required('SANITY_WRITE_TOKEN');

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const RENAMES: Record<string, string> = {
  'unit-2': 'Bear',
  'unit-5': 'Deer',
  'unit-6': 'Chipmunk',
};

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Missing env var ${name}`);
    process.exit(1);
  }
  return v;
}

async function main() {
  const tx = client.transaction();
  for (const [id, name] of Object.entries(RENAMES)) {
    tx.patch(id, (p) => p.set({ name }));
    console.log(`  ${id} → ${name}`);
  }
  await tx.commit();
  console.log('\n✓ Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
