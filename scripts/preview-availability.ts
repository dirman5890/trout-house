// Print what each unit will compute as availability today.
// Useful sanity check after changing booking data or the min-nights rule.

import { sanityClient } from '../lib/sanity/client';
import { ALL_UNITS_QUERY } from '../lib/sanity/queries';
import type { Unit } from '../lib/sanity/types';
import { unitAvailability } from '../lib/format';

(async () => {
  const units = await sanityClient.fetch<Unit[]>(ALL_UNITS_QUERY);
  for (const u of units) {
    const text = unitAvailability(u);
    console.log(`Unit ${u.unitNumber} (${u.name}):  ${text}`);
  }
})();
