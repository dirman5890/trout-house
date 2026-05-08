// Combined content patch:
// 1. Replace bogus "Tahoe" Unsplash photo with property aerial (neighborhood)
// 2. Swap Log Cabin Caffé → White Caps Pizza in walkable items
// 3. Rewrite Short Stays content for Unit 2 (Bear, studio) — remove fireplace,
//    2-bedroom, and other Unit-1-specific content that bled in from the seed.

import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

(async () => {
  // ---- 1. Neighborhood hero ----
  const aerial = await fs.readFile(path.resolve(process.cwd(), 'public/exterior/aerial.jpg'));
  console.log('Uploading property aerial as neighborhood hero…');
  const aerialAsset = await client.assets.upload('image', aerial, { filename: 'property-aerial.jpg' });

  await client.patch('neighborhoodPage').set({
    heroPhoto: {
      _type: 'unitPhoto',
      asset: { _type: 'reference', _ref: aerialAsset._id },
      alt: 'Trout House from above — Kings Beach, North Lake Tahoe',
    },
    // ---- 2. Walkable items: Log Cabin → White Caps ----
    walkableItems: [
      { _key: 'w1', _type: 'walkableItem', name: 'Kings Beach State Recreation Area', detail: '2 blocks · 5 min walk' },
      { _key: 'w2', _type: 'walkableItem', name: 'Old Post Office Café', detail: 'Coffee + breakfast · 4 min walk' },
      { _key: 'w3', _type: 'walkableItem', name: 'White Caps Pizza', detail: 'Best pizza in North Lake · 6 min walk' },
      { _key: 'w4', _type: 'walkableItem', name: 'Soule Domain', detail: 'Dinner · 8 min walk' },
      { _key: 'w5', _type: 'walkableItem', name: 'Safeway', detail: 'Groceries · 7 min walk' },
      { _key: 'w6', _type: 'walkableItem', name: 'Boatworks Mall + waterfront', detail: '15 min walk along the shore' },
    ],
  }).commit();
  console.log('✓ Neighborhood page updated.');

  // ---- 3. Short Stays page rewritten for Bear (studio, no fireplace) ----
  await client.patch('shortStaysPage').set({
    title: 'A furnished studio steps from Lake Tahoe.',
    description:
      'Our most-booked Airbnb — a bright studio in the heart of Kings Beach. Sleeps up to four, two blocks from the sand.',
    bodyTitle: 'Built for long weekends that turn into long stays.',
    bodyContent: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'A bright, furnished studio in the heart of Kings Beach. The queen bed plus pull-out sleeper sofa sleep up to four; the kitchenette has a full-size fridge so you can actually cook.',
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
            text: "Wi-Fi is fast enough for video calls; the smart TV is set up for the streaming services you already pay for. Reserved off-street parking means you don't have to fight for a spot when you get back from the lake.",
          },
        ],
      },
      {
        _type: 'block',
        _key: 'b3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's3',
            text: "You're a two-block walk from Kings Beach State Recreation Area. Coffee and breakfast are even closer.",
          },
        ],
      },
    ],
    amenities: [
      'Queen bed + sleeper sofa (sleeps 4)',
      'Kitchenette with full-size fridge',
      'Walk-in shower',
      'Smart TV + fast Wi-Fi',
      'Reserved off-street parking',
      'Self check-in',
    ],
  }).commit();
  console.log('✓ Short stays page rewritten for Bear (studio).');

  console.log('\n✓ All content fixes done.');
})();
