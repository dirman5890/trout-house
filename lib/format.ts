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

// Compute availability string from bookings. Logic:
//   - inside a current booking → "Available [end + 1 day]"
//   - has a future booking → "Available now through [start - 1 day]"
//   - no bookings (or all in past) → "Available now"
function availabilityFromBookings(bookings: Booking[]): string {
  const today = todayIso();
  // Sort to be defensive even if the query already orders.
  const sorted = [...bookings].sort((a, b) =>
    a.startDate < b.startDate ? -1 : 1,
  );

  const current = sorted.find(
    (b) => b.startDate <= today && today <= b.endDate,
  );
  if (current) {
    return `Available ${formatDateLong(addDaysIso(current.endDate, 1))}`;
  }

  const next = sorted.find((b) => today < b.startDate);
  if (next) {
    return `Available now through ${formatDateLong(addDaysIso(next.startDate, -1))}`;
  }

  return 'Available now';
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
