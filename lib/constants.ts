// Structural constants kept in code (URL, nav routes). Editable content
// lives in Sanity — see siteSettings/homePage/etc. document types.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://trouthousetahoe.com';

// Fallback display values used when Sanity hasn't been seeded yet.
export const SITE_DEFAULTS = {
  name: 'Trout House',
  fullName: 'Trout House Kings Beach',
  tagline: 'Furnished living on the North Shore',
  description:
    'Studio and 2-bedroom furnished rentals in Kings Beach, walkable to Lake Tahoe.',
  contactEmail: '',
  contactPhone: '',
  airbnbUrl: 'https://www.airbnb.com/rooms/TODO',
  applyUrlFallback: 'https://www.avail.co/l/TODO-trout-house',
  address: { line1: '8638 Trout Ave', city: 'Kings Beach', state: 'CA', zip: '96143' },
};

export const NAV_LINKS = [
  { href: '/units', label: 'Units' },
  { href: '/short-stays', label: 'Short Stays' },
  { href: '/neighborhood', label: 'Neighborhood' },
  { href: '/apply', label: 'Apply' },
] as const;
