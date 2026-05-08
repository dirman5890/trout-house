// Initial bookings seed — derived from the lease spreadsheet shared on
// 2026-05-07. Idempotent (uses deterministic IDs). Re-run after edits.
//
// Also clears the manual `availabilityNote` on units so the computed
// availability text takes over.

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

type SeedBooking = {
  key: string;             // deterministic doc id suffix
  unitId: string;          // unit-N
  start: string;           // ISO date
  end: string;
  type: 'long-term' | 'short-term' | 'blackout';
  tenant?: string;
  notes?: string;
};

const BOOKINGS: SeedBooking[] = [
  // Unit 1 — Bobcat (Ashley Wilson, 1-year lease)
  { key: 'unit1-ashley', unitId: 'unit-1', start: '2026-03-21', end: '2027-03-31', type: 'long-term', tenant: 'Ashley Wilson' },

  // Unit 2 — Bear (STR, multiple Airbnb stays)
  { key: 'unit2-flynn',   unitId: 'unit-2', start: '2026-05-02', end: '2026-05-31', type: 'short-term', tenant: 'Anna May Flynn' },
  { key: 'unit2-morgan',  unitId: 'unit-2', start: '2026-06-26', end: '2026-06-29', type: 'short-term', tenant: 'Jamie Morgan' },
  { key: 'unit2-jacisin', unitId: 'unit-2', start: '2026-07-10', end: '2026-07-13', type: 'short-term', tenant: 'Molly Jacisin' },
  { key: 'unit2-coons',   unitId: 'unit-2', start: '2026-07-16', end: '2026-07-19', type: 'short-term', tenant: 'Reilly Coons' },
  { key: 'unit2-ayala',   unitId: 'unit-2', start: '2026-07-23', end: '2026-07-28', type: 'short-term', tenant: 'Andrea Ayala' },

  // Unit 3 — Fox (Carol Ann tentative summer sublease)
  { key: 'unit3-carolann', unitId: 'unit-3', start: '2026-06-01', end: '2026-08-31', type: 'long-term', tenant: 'Carol Ann and James (tentative)' },

  // Unit 4 — Raccoon (Shakespeare Festival)
  { key: 'unit4-shakespeare', unitId: 'unit-4', start: '2026-06-20', end: '2026-09-02', type: 'long-term', tenant: 'Lake Tahoe Shakespeare Festival' },

  // Unit 5 — Deer (Riley Haswell, year lease)
  { key: 'unit5-riley', unitId: 'unit-5', start: '2025-10-01', end: '2026-09-30', type: 'long-term', tenant: 'Riley Haswell' },

  // Unit 6 — Chipmunk (Karma & Jim, 2-year lease)
  { key: 'unit6-karma', unitId: 'unit-6', start: '2024-12-01', end: '2026-11-30', type: 'long-term', tenant: 'Karma Bury & Jim Baxter' },

  // Unit 7 — Wolf (STR — back-to-back Airbnb stays)
  { key: 'unit7-jarrod', unitId: 'unit-7', start: '2026-03-24', end: '2026-05-10', type: 'short-term', tenant: 'Jarrod Morgan' },
  { key: 'unit7-mary',   unitId: 'unit-7', start: '2026-06-01', end: '2026-09-01', type: 'short-term', tenant: 'Mary Vieregge' },

  // Unit 8 — Beaver (one Airbnb in summer)
  { key: 'unit8-mandie', unitId: 'unit-8', start: '2026-06-07', end: '2026-07-10', type: 'short-term', tenant: 'Mandie' },
];

(async () => {
  console.log(`Seeding ${BOOKINGS.length} bookings…`);
  const tx = client.transaction();
  for (const b of BOOKINGS) {
    tx.createOrReplace({
      _id: `booking-${b.key}`,
      _type: 'booking',
      unit: { _type: 'reference', _ref: b.unitId },
      startDate: b.start,
      endDate: b.end,
      type: b.type,
      tenantName: b.tenant,
      notes: b.notes,
    });
  }
  await tx.commit();
  console.log(`✓ ${BOOKINGS.length} bookings written.`);

  console.log('\nClearing manual availability notes (computed values take over)…');
  const unitIds = ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', 'unit-6', 'unit-7', 'unit-8'];
  const clearTx = client.transaction();
  for (const id of unitIds) {
    clearTx.patch(id, (p) => p.unset(['availabilityNote']));
  }
  await clearTx.commit();
  console.log('✓ Notes cleared. Site will now compute availability from bookings.');
})();
