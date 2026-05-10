// Snapshot of the unit data used by the one-time Sanity seed script
// (`npm run sanity:seed`). After seeding, Sanity is the source of truth —
// edits made here will not flow to the live site.

type SeedUnit = {
  unitNumber: string;
  name: string;
  type: 'studio' | '2br';
  squareFeet: number;
  beds: number;
  baths: number;
  features: string[];
  shortDescription?: string;
  status: 'available' | 'leased' | 'coming-soon';
  availableDate?: string;
  photos: string[];
  pricing: {
    twelveMonth: number;
    sixMonth: number;
    utilitiesIncluded: {
      twelveMonth: boolean;
      sixMonth: boolean;
    };
  };
  applyUrl: string;
  shortTermAvailable?: boolean;
};

// Standard studio rates. 12-month: tenant pays utilities. 6-month: included.
const STUDIO_PRICING = {
  twelveMonth: 1895,
  sixMonth: 1995,
  utilitiesIncluded: {
    twelveMonth: false,
    sixMonth: true,
  },
} as const;

// TODO: confirm 2BR pricing before launch — these are placeholders.
const TWO_BR_PRICING = {
  twelveMonth: 3400,
  sixMonth: 3575,
  utilitiesIncluded: {
    twelveMonth: false,
    sixMonth: true,
  },
} as const;

// TODO: replace each applyUrl with the unit-specific Avail deep link.
const availUrl = (unitNumber: string) =>
  `https://www.avail.co/l/TODO-trout-house-unit-${unitNumber}`;

// Each unit's `photos` array references files in /public/units/<unitNumber>/.
// Photos are pre-optimized JPGs (~2400px max, q82) — see scripts/optimize-images.mjs.
// First photo is the card/hero image for the unit.
//
// Units that don't have their own bathroom shot reference the building-wide
// typical bathroom at /units/typical/bathroom.jpg.
const TYPICAL_BATHROOM = '/units/typical/bathroom.jpg';

export const UNITS: SeedUnit[] = [
  {
    unitNumber: '1',
    name: 'Bobcat',
    type: '2br',
    squareFeet: 950,
    beds: 2,
    baths: 1,
    features: [
      'Wood-burning fireplace',
      'Full kitchen',
      'Two queen bedrooms',
      'In-unit washer/dryer',
      'Private deck',
      'Smart TV + Wi-Fi',
    ],
    shortDescription:
      'Our largest unit. A two-bedroom with a wood-burning fireplace, full kitchen, and a deck that catches the late-afternoon sun.',
    status: 'available',
    photos: [
      '/units/1/living.jpg',
      '/units/1/living-room.jpg',
      '/units/1/interior.jpg',
      '/units/1/bedroom-1.jpg',
      '/units/1/bedroom-2.jpg',
      '/units/1/bathroom.jpg',
    ],
    pricing: TWO_BR_PRICING,
    applyUrl: availUrl('1'),
    shortTermAvailable: true,
  },
  {
    unitNumber: '2',
    name: 'Chipmunk',
    type: 'studio',
    squareFeet: 420,
    beds: 0,
    baths: 1,
    features: [
      'Queen bed + sleeper sofa',
      'Kitchenette with full-size fridge',
      'Walk-in shower',
      'Smart TV + Wi-Fi',
      'Reserved parking spot',
    ],
    shortDescription:
      'A bright, efficient studio with morning light and a kitchenette built for real cooking.',
    status: 'available',
    photos: [
      '/units/2/overview.jpg',
      '/units/2/loft.jpg',
      '/units/2/entry.jpg',
      '/units/2/kitchen.jpg',
      '/units/2/kitchen-2.jpg',
      TYPICAL_BATHROOM,
    ],
    pricing: STUDIO_PRICING,
    applyUrl: availUrl('2'),
  },
  {
    unitNumber: '3',
    name: 'Fox',
    type: 'studio',
    squareFeet: 410,
    beds: 0,
    baths: 1,
    features: [
      'Queen bed',
      'Kitchenette',
      'Walk-in shower',
      'Smart TV + Wi-Fi',
      'Reserved parking spot',
    ],
    status: 'leased',
    photos: [
      '/units/3/overview.jpg',
      '/units/3/interior.jpg',
      TYPICAL_BATHROOM,
    ],
    pricing: STUDIO_PRICING,
    applyUrl: availUrl('3'),
  },
  {
    unitNumber: '4',
    name: 'Raccoon',
    type: 'studio',
    squareFeet: 420,
    beds: 0,
    baths: 1,
    features: [
      'Queen bed',
      'Kitchenette with full-size fridge',
      'Walk-in shower',
      'Smart TV + Wi-Fi',
      'Reserved parking spot',
    ],
    shortDescription:
      'Quiet corner studio with views into the trees out the back. A favorite for remote work.',
    status: 'available',
    photos: [
      '/units/4/kitchen-living.jpg',
      '/units/4/kitchen.jpg',
      '/units/4/bathroom.jpg',
    ],
    pricing: STUDIO_PRICING,
    applyUrl: availUrl('4'),
  },
  {
    unitNumber: '5',
    name: 'Bear',
    type: 'studio',
    squareFeet: 415,
    beds: 0,
    baths: 1,
    features: [
      'Queen bed',
      'Kitchenette',
      'Walk-in shower',
      'Smart TV + Wi-Fi',
      'Reserved parking spot',
    ],
    status: 'leased',
    photos: [
      '/units/5/living-kitchen.jpg',
      '/units/5/bedroom-living.jpg',
      '/units/5/bathroom.jpg',
    ],
    pricing: STUDIO_PRICING,
    applyUrl: availUrl('5'),
  },
  {
    unitNumber: '6',
    name: 'Deer',
    type: 'studio',
    squareFeet: 420,
    beds: 0,
    baths: 1,
    features: [
      'Queen bed',
      'Kitchenette with full-size fridge',
      'Walk-in shower',
      'Smart TV + Wi-Fi',
      'Reserved parking spot',
    ],
    shortDescription:
      'Top-floor studio with the best afternoon light in the building.',
    status: 'available',
    photos: [
      '/units/6/overview.jpg',
      '/units/6/living.jpg',
      '/units/6/bathroom.jpg',
      '/units/6/exterior.jpg',
    ],
    pricing: STUDIO_PRICING,
    applyUrl: availUrl('6'),
  },
  {
    unitNumber: '7',
    name: 'Wolf',
    type: 'studio',
    squareFeet: 410,
    beds: 0,
    baths: 1,
    features: [
      'Queen bed',
      'Kitchenette',
      'Walk-in shower',
      'Smart TV + Wi-Fi',
      'Reserved parking spot',
    ],
    status: 'coming-soon',
    availableDate: '2026-06-01',
    photos: [
      '/units/7/overview.jpg',
      '/units/7/entry.jpg',
      TYPICAL_BATHROOM,
    ],
    pricing: STUDIO_PRICING,
    applyUrl: availUrl('7'),
  },
  {
    unitNumber: '8',
    name: 'Beaver',
    type: 'studio',
    squareFeet: 425,
    beds: 0,
    baths: 1,
    features: [
      'Queen bed',
      'Kitchenette with full-size fridge',
      'Walk-in shower',
      'Smart TV + Wi-Fi',
      'Reserved parking spot',
    ],
    shortDescription:
      'The largest studio in the building, with a peek of the ridgeline from the bed.',
    status: 'available',
    photos: [
      '/units/8/overview.jpg',
      '/units/8/exterior.jpg',
      '/units/8/bathroom.jpg',
    ],
    pricing: STUDIO_PRICING,
    applyUrl: availUrl('8'),
  },
];

