// Seed a fresh Sanity dataset with our existing units, photos, and page content.
//
// Run after creating a Sanity project at sanity.io/manage:
//
//   1. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
//   2. Create a write token (sanity.io/manage → API → Tokens, "Editor" role)
//      and set SANITY_WRITE_TOKEN in .env.local
//   3. npm run sanity:seed
//
// Idempotent — safe to re-run. Documents use deterministic IDs so re-runs
// update existing records rather than creating duplicates.

import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { UNITS } from '../data/units';

// Load env vars in the same order Next.js does:
// .env.local overrides .env, both available to the script.
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const projectId = required('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';
const token = required('SANITY_WRITE_TOKEN');

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const PUBLIC = path.resolve(process.cwd(), 'public');

// ---------- helpers ----------

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Missing env var ${name}. Set it in .env.local and re-run.`);
    process.exit(1);
  }
  return v;
}

async function uploadAsset(relPath: string, alt: string) {
  const abs = path.join(PUBLIC, relPath.replace(/^\//, ''));
  try {
    await fs.access(abs);
  } catch {
    console.warn(`  skip — missing file: ${relPath}`);
    return null;
  }
  const buffer = await fs.readFile(abs);
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(relPath),
  });
  return {
    _type: 'unitPhoto' as const,
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  };
}

async function uploadMany(paths: string[], altPrefix: string) {
  const out = [];
  for (const p of paths) {
    const role = path.basename(p, path.extname(p)).replace(/-/g, ' ');
    const alt = `${altPrefix} — ${role}`;
    const photo = await uploadAsset(p, alt);
    if (photo) {
      out.push({ ...photo, _key: photo.asset._ref });
    }
  }
  return out;
}

function rolePart(p: string): string {
  return path
    .basename(p, path.extname(p))
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------- main ----------

async function main() {
  console.log(`→ Seeding project ${projectId} / dataset "${dataset}"\n`);

  // 1. Upload images and create unit documents
  console.log('Uploading unit photos…');
  const unitDocs = [];
  for (const unit of UNITS) {
    console.log(`  Unit ${unit.unitNumber} (${unit.name})`);
    const photos = await uploadMany(unit.photos, `${unit.name} — Unit ${unit.unitNumber}`);
    unitDocs.push({
      _id: `unit-${unit.unitNumber}`,
      _type: 'unit',
      unitNumber: unit.unitNumber,
      name: unit.name,
      order: parseInt(unit.unitNumber, 10),
      type: unit.type,
      status: unit.status,
      availableDate: unit.availableDate,
      squareFeet: unit.squareFeet,
      beds: unit.beds,
      baths: unit.baths,
      shortDescription: unit.shortDescription,
      features: unit.features.map((label, i) => ({
        _key: `feat-${i}`,
        _type: 'unitFeature',
        label,
      })),
      photos,
      pricing: {
        twelveMonth: unit.pricing.twelveMonth,
        sixMonth: unit.pricing.sixMonth,
        utilitiesIncludedTwelveMonth: unit.pricing.utilitiesIncluded.twelveMonth,
        utilitiesIncludedSixMonth: unit.pricing.utilitiesIncluded.sixMonth,
      },
      applyUrl: unit.applyUrl,
      shortTermAvailable: unit.shortTermAvailable || false,
    });
  }

  // 2. Upload page-level images
  console.log('\nUploading page images…');
  const heroPhoto = await uploadAsset('/exterior/drone.jpg', 'Trout House at 8638 Trout Avenue, Kings Beach');
  const aboutPhoto = await uploadAsset('/exterior/snow.jpg', 'Trout House exterior in winter');
  const shortStaysDetailImage = await uploadAsset('/exterior/aerial-overhead.jpg', 'Trout House from above');
  const neighborhoodHeroPhoto = await uploadAsset('/lake/north-shore.jpg', "Lake Tahoe's north shore at Kings Beach");

  // 3. Page singletons
  const docs: Record<string, unknown>[] = [];

  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Trout House',
    fullName: 'Trout House Kings Beach',
    tagline: 'Furnished living on the North Shore',
    description:
      'Studio and 2-bedroom furnished rentals in Kings Beach, walkable to Lake Tahoe.',
    address: {
      _type: 'address',
      line1: '8638 Trout Ave',
      city: 'Kings Beach',
      state: 'CA',
      zip: '96143',
    },
    contactEmail: 'hello@trouthousekb.com',
    contactPhone: '',
    airbnbUrl: 'https://www.airbnb.com/rooms/TODO',
    applyUrlFallback: 'https://www.avail.co/l/TODO-trout-house',
  });

  docs.push({
    _id: 'homePage',
    _type: 'homePage',
    heroEyebrow: 'Kings Beach · Lake Tahoe',
    heroTitle: 'Furnished living on the North Shore.',
    heroSubtitle:
      'Studio and 2-bedroom rentals in Kings Beach, walkable to Lake Tahoe. Move-in ready, with lease terms that flex to your stay.',
    heroPhoto: heroPhoto && { ...heroPhoto },
    heroPrimaryCta: { _type: 'cta', label: 'View available units', href: '/units' },
    heroSecondaryCta: {
      _type: 'cta',
      label: 'Book a short stay',
      href: 'https://www.airbnb.com/rooms/TODO',
      external: true,
    },
    valueProps: [
      {
        _key: 'walk',
        _type: 'valueProp',
        title: 'Walk to the lake',
        body: 'Two blocks from the sand at Kings Beach State Recreation Area. Beach mornings, dinner on the water, no car required.',
      },
      {
        _key: 'furnished',
        _type: 'valueProp',
        title: 'Fully furnished, move-in ready',
        body: 'Beds, linens, kitchenware, Wi-Fi, smart TV. Bring a duffel and groceries; everything else is here.',
      },
      {
        _key: 'flex',
        _type: 'valueProp',
        title: 'Flexible lease terms',
        body: 'Twelve-month or six-month leases. Pick the term that fits your stay; switch when you renew.',
      },
    ],
    aboutEyebrow: 'About Trout House',
    aboutTitle: 'Eight thoughtfully renovated units, two blocks from the lake.',
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
    aboutPhoto: aboutPhoto && { ...aboutPhoto },
    aboutPrimaryCta: { _type: 'cta', label: 'Start application', href: '/apply' },
    aboutSecondaryCta: { _type: 'cta', label: 'The neighborhood', href: '/neighborhood' },
    emailCaptureEyebrow: 'Stay in the loop',
    emailCaptureTitle: 'Be the first to know when a unit opens up.',
    emailCaptureBody:
      'We email when a unit becomes available — never more than once a month, and never for anything other than Trout House.',
  });

  docs.push({
    _id: 'unitsPage',
    _type: 'unitsPage',
    eyebrow: 'The building',
    title: 'Eight units. Furnished, walkable, available on your terms.',
    description:
      "Filter by what's available now, or explore all studios and the two-bedroom. Click any unit for photos, full pricing, and the application link.",
  });

  docs.push({
    _id: 'shortStaysPage',
    _type: 'shortStaysPage',
    eyebrow: 'Short stays',
    title: 'A two-bedroom on the lake side of Kings Beach.',
    description:
      'Our largest unit is bookable nightly on Airbnb. Two queen bedrooms, a wood-burning fireplace, full kitchen, and a two-block walk to the sand.',
    unit: { _type: 'reference', _ref: 'unit-1' },
    bodyEyebrow: 'Why guests pick this one',
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
            text: 'Two queen bedrooms sleep four comfortably, with a sleeper sofa for an extra two. The kitchen is full-size — not a kitchenette — with a real range, full-size fridge, dishwasher, and the kind of cookware you actually want to use.',
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
            text: 'The wood-burning fireplace is the centerpiece in winter. In summer, the deck off the living room catches afternoon light and runs cool well into evening. Wi-Fi is fast enough for video calls; the smart TV is set up for the streaming services you already pay for.',
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
      'Two queen bedrooms',
      'Wood-burning fireplace',
      'Full kitchen, full-size fridge',
      'Dishwasher + in-unit washer/dryer',
      'Smart TV + fast Wi-Fi',
      'Private deck',
      'Reserved parking',
      'Self check-in',
    ],
    detailImage: shortStaysDetailImage && { ...shortStaysDetailImage },
  });

  docs.push({
    _id: 'neighborhoodPage',
    _type: 'neighborhoodPage',
    eyebrow: 'The neighborhood',
    title: 'Two blocks from the lake. A whole life within walking distance.',
    description:
      'Kings Beach is the working heart of the North Shore — a smaller, quieter, more lived-in alternative to Tahoe City or Incline. Trout House sits at the center of it.',
    heroPhoto: neighborhoodHeroPhoto && { ...neighborhoodHeroPhoto },
    walkableEyebrow: 'Walkable',
    walkableTitle: "Most days, you won't need a car.",
    walkableItems: [
      { _key: 'w1', _type: 'walkableItem', name: 'Kings Beach State Recreation Area', detail: '2 blocks · 5 min walk' },
      { _key: 'w2', _type: 'walkableItem', name: 'Old Post Office Café', detail: 'Coffee + breakfast · 4 min walk' },
      { _key: 'w3', _type: 'walkableItem', name: 'Log Cabin Caffé', detail: 'Brunch institution · 6 min walk' },
      { _key: 'w4', _type: 'walkableItem', name: 'Soule Domain', detail: 'Dinner · 8 min walk' },
      { _key: 'w5', _type: 'walkableItem', name: 'Safeway', detail: 'Groceries · 7 min walk' },
      { _key: 'w6', _type: 'walkableItem', name: 'Boatworks Mall + waterfront', detail: '15 min walk along the shore' },
    ],
    seasonsEyebrow: 'Seasons',
    seasonsTitle: 'Tahoe in four chapters.',
    seasons: [
      {
        _key: 'winter',
        _type: 'season',
        title: 'Winter (Nov–Apr)',
        body: 'Northstar is 20 minutes south. Palisades and Alpine Meadows are 30. Storms come in fast and clear out fast — most weeks have at least one bluebird day after a dump. The fireplace gets a workout.',
      },
      {
        _key: 'spring',
        _type: 'season',
        title: 'Spring (Apr–Jun)',
        body: 'Quiet shoulder months. Ski-and-paddle days are real — corn snow on Squaw in the morning, the lake in the afternoon. Restaurant reservations get easy.',
      },
      {
        _key: 'summer',
        _type: 'season',
        title: 'Summer (Jun–Sep)',
        body: 'Beach mornings, hikes on the Tahoe Rim Trail, paddle and sail rentals at the marina. The Lake Tahoe Shakespeare Festival runs at Sand Harbor, 25 minutes east.',
      },
      {
        _key: 'fall',
        _type: 'season',
        title: 'Fall (Sep–Nov)',
        body: 'The aspens turn gold around Page Meadows and Hope Valley. Cool mornings, warm afternoons, no crowds. Our favorite season at the property.',
      },
    ],
  });

  docs.push({
    _id: 'applyPage',
    _type: 'applyPage',
    eyebrow: 'Apply',
    title: 'Four steps to a key in your hand.',
    description:
      'Applications are processed online through our screening partner Avail. Most tenants go from application to move-in in under a week.',
    steps: [
      {
        _key: 's1',
        _type: 'applyStep',
        title: 'Choose your unit and lease term',
        body: 'Browse the units page, pick what fits your stay, and note the lease term — twelve-month or six-month.',
      },
      {
        _key: 's2',
        _type: 'applyStep',
        title: 'Submit through Avail',
        body: 'We screen applications through Avail, our trusted partner. The $55 fee covers credit, criminal, and eviction screening — it goes to Avail, not to us.',
      },
      {
        _key: 's3',
        _type: 'applyStep',
        title: 'We review within 48 hours',
        body: "We review every application personally and reach out by email with next steps — questions, a viewing, or a lease offer.",
      },
      {
        _key: 's4',
        _type: 'applyStep',
        title: 'Sign your lease and move in',
        body: "Lease signing is digital. Once it's signed and the deposit is paid, you get keys and the door code. Move in on your start date.",
      },
    ],
    faqEyebrow: 'Common questions',
    faqTitle: 'Things we get asked.',
    faqs: [
      { _key: 'f1', _type: 'faqItem', q: 'Are utilities included?', a: 'Utilities are included on the 6-month lease. On the 12-month lease, the tenant pays utilities directly — most tenants find this saves money over a full year.' },
      { _key: 'f2', _type: 'faqItem', q: 'Are pets allowed?', a: 'We consider pets case by case. Email us with your pet, and we will let you know — there is typically a one-time pet deposit and a small monthly pet rent.' },
      { _key: 'f3', _type: 'faqItem', q: 'How does parking work?', a: 'Each unit comes with one reserved off-street parking spot. Additional vehicles can use street parking subject to local rules.' },
      { _key: 'f4', _type: 'faqItem', q: 'What is the security deposit?', a: "One month's rent, refundable at move-out subject to standard California security deposit law." },
      { _key: 'f5', _type: 'faqItem', q: 'Can I sublet or rent out the unit on Airbnb?', a: 'No. Long-term leases are for residential use only. Subletting and short-term rental are not permitted.' },
      { _key: 'f7', _type: 'faqItem', q: 'Do you offer viewings?', a: 'Yes. Once you submit an application, or if you have specific questions before applying, we will schedule a 15-minute walkthrough.' },
    ],
  });

  // 4. Write everything in a single transaction
  console.log('\nWriting documents…');
  const tx = client.transaction();
  for (const u of unitDocs) tx.createOrReplace(u);
  for (const d of docs) tx.createOrReplace(d as { _id: string; _type: string });
  await tx.commit();

  console.log(`\n✓ Done.`);
  console.log(`  ${unitDocs.length} units + ${docs.length} singletons written.`);
  console.log(`  Open the Studio: http://localhost:3000/studio`);
  console.log(`  (Note role: ${rolePart('living-kitchen')} — used as image alt fallback.)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
