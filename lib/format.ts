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
