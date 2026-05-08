export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonthly(amount: number): string {
  return `${formatCurrency(amount)}/mo`;
}

export function formatSquareFeet(sqft: number): string {
  return `${sqft.toLocaleString('en-US')} sq ft`;
}

export function formatBedsBaths(beds: number, baths: number): string {
  const bedLabel = beds === 0 ? 'Studio' : `${beds} bed${beds === 1 ? '' : 's'}`;
  const bathLabel = `${baths} bath${baths === 1 ? '' : 's'}`;
  return beds === 0 ? bedLabel : `${bedLabel} · ${bathLabel}`;
}

export function statusLabel(
  status: 'available' | 'str-only' | 'leased' | 'coming-soon',
): string {
  switch (status) {
    case 'available':
      return 'Available now';
    case 'str-only':
      return 'Available for short stays';
    case 'leased':
      return 'Leased';
    case 'coming-soon':
      return 'Coming soon';
  }
}

// Friendly date format used in availability text — "July 11, 2026", not ISO.
function formatDateLong(iso: string): string {
  // Parse as UTC to avoid TZ shifting "2026-07-11" → "2026-07-10" in PST.
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function todayIso(): string {
  // YYYY-MM-DD in the renderer's local timezone — matches how dates feel
  // to the property manager filling in Studio.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

type Booking = { startDate: string; endDate: string; type: string };

// Minimum advertisable LTR window in nights. 30 is the legal floor (TRPA /
// Placer Co. compliance for non-STR units); we use 35 to give ~5 days of
// operational buffer for application + screening + move-in coordination.
// Bumping/lowering this is the single knob that controls "should we show
// this short window or skip past it?".
const MIN_LTR_NIGHTS = 35;

function nightsBetween(startIso: string, endIso: string): number {
  const a = Date.UTC(
    parseInt(startIso.slice(0, 4), 10),
    parseInt(startIso.slice(5, 7), 10) - 1,
    parseInt(startIso.slice(8, 10), 10),
  );
  const b = Date.UTC(
    parseInt(endIso.slice(0, 4), 10),
    parseInt(endIso.slice(5, 7), 10) - 1,
    parseInt(endIso.slice(8, 10), 10),
  );
  return Math.round((b - a) / 86_400_000);
}

// Walks forward through bookings starting from today, jumping past any
// booking that blocks us, and reports the first gap that's at least
// MIN_LTR_NIGHTS long.
function availabilityFromBookings(bookings: Booking[]): string {
  const today = todayIso();
  const sorted = [...bookings].sort((a, b) =>
    a.startDate < b.startDate ? -1 : 1,
  );

  let cursor = today;

  for (const b of sorted) {
    if (cursor > b.endDate) continue; // already past

    // Currently inside this booking — jump to the day after.
    if (cursor >= b.startDate && cursor <= b.endDate) {
      cursor = addDaysIso(b.endDate, 1);
      continue;
    }

    // cursor < b.startDate — there's a gap before this booking.
    const gap = nightsBetween(cursor, b.startDate);
    if (gap >= MIN_LTR_NIGHTS) {
      const windowEnd = addDaysIso(b.startDate, -1);
      return cursor === today
        ? `Available now through ${formatDateLong(windowEnd)}`
        : `Available ${formatDateLong(cursor)} through ${formatDateLong(windowEnd)}`;
    }

    // Gap too short to rent — skip past this booking.
    cursor = addDaysIso(b.endDate, 1);
  }

  // No more bookings — open-ended availability from `cursor` onward.
  return cursor === today ? 'Available now' : `Available ${formatDateLong(cursor)}`;
}

// One-line availability string for cards + detail pages. Order of precedence:
//   1. `availabilityNote` (manual Studio override)
//   2. Computed from bookings (if any exist)
//   3. Fallback to status label
export function unitAvailability(unit: {
  status: 'available' | 'str-only' | 'leased' | 'coming-soon';
  availableDate?: string;
  availabilityNote?: string;
  bookings?: Booking[];
}): string {
  if (unit.availabilityNote && unit.availabilityNote.trim().length > 0) {
    return unit.availabilityNote.trim();
  }
  if (unit.status === 'str-only') return 'Bookable on Airbnb';
  if (unit.bookings && unit.bookings.length > 0) {
    return availabilityFromBookings(unit.bookings);
  }
  switch (unit.status) {
    case 'available':
      return 'Available now';
    case 'coming-soon':
      return unit.availableDate
        ? `Available ${formatDateLong(unit.availableDate)}`
        : 'Coming soon';
    case 'leased':
      return 'Currently leased';
  }
}

// Computed status used to drive the colored badge — derived from bookings so
// it never contradicts the availability text. Walks the same logic as
// `availabilityFromBookings` but returns a status code instead of a string.
export function effectiveUnitStatus(unit: {
  status: 'available' | 'str-only' | 'leased' | 'coming-soon';
  bookings?: Booking[];
}): 'available' | 'str-only' | 'leased' | 'coming-soon' {
  if (unit.status === 'str-only') return 'str-only';
  const bookings = unit.bookings || [];
  if (bookings.length === 0) return unit.status;

  const today = todayIso();
  const sorted = [...bookings].sort((a, b) => (a.startDate < b.startDate ? -1 : 1));

  let cursor = today;
  for (const b of sorted) {
    if (cursor > b.endDate) continue;
    if (cursor >= b.startDate && cursor <= b.endDate) {
      cursor = addDaysIso(b.endDate, 1);
      continue;
    }
    const gap = nightsBetween(cursor, b.startDate);
    if (gap >= MIN_LTR_NIGHTS) {
      // Found a long-enough gap. Is today inside it?
      return cursor === today ? 'available' : 'coming-soon';
    }
    cursor = addDaysIso(b.endDate, 1);
  }
  // No more bookings — open-ended availability from cursor onward.
  return cursor === today ? 'available' : 'coming-soon';
}
