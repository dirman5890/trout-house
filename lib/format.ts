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
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// One-line availability string for cards + detail pages. The Sanity
// `availabilityNote` field overrides the auto-derived text — use it for
// custom messages like "Leased through March 2027".
export function unitAvailability(unit: {
  status: 'available' | 'str-only' | 'leased' | 'coming-soon';
  availableDate?: string;
  availabilityNote?: string;
}): string {
  if (unit.availabilityNote && unit.availabilityNote.trim().length > 0) {
    return unit.availabilityNote.trim();
  }
  switch (unit.status) {
    case 'available':
      return 'Available now';
    case 'str-only':
      return 'Bookable on Airbnb';
    case 'coming-soon':
      return unit.availableDate
        ? `Available ${formatDateLong(unit.availableDate)}`
        : 'Coming soon';
    case 'leased':
      return 'Currently leased';
  }
}
