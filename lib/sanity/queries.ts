import { groq } from 'next-sanity';

// All shared field projections live here so each page query is a one-liner.
// Keep these aligned with the TS types in lib/sanity/types.ts.

const PHOTO_FIELDS = `
  asset->{ _id, url, metadata { dimensions, lqip } },
  alt,
  caption,
  hotspot,
  crop
`;

const PRICING_FIELDS = `
  twelveMonth,
  sixMonth
`;

const CTA_FIELDS = `label, href, external`;

const UNIT_FIELDS = `
  _id,
  unitNumber,
  name,
  type,
  status,
  availableDate,
  availabilityNote,
  squareFeet,
  beds,
  baths,
  shortDescription,
  "features": features[].label,
  "photos": photos[]{ ${PHOTO_FIELDS} },
  pricing { ${PRICING_FIELDS} },
  applyUrl,
  shortTermAvailable,
  "bookings": *[_type == "booking" && references(^._id)] | order(startDate asc) {
    _id, startDate, endDate, type
  }
`;

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  name,
  fullName,
  tagline,
  description,
  address,
  contactEmail,
  contactPhone,
  airbnbUrl,
  applyUrlFallback
}`;

export const ALL_UNITS_QUERY = groq`*[_type == "unit"] | order(order asc, unitNumber asc){
  ${UNIT_FIELDS}
}`;

export const AVAILABLE_UNITS_QUERY = groq`*[_type == "unit" && status == "available"] | order(order asc, unitNumber asc){
  ${UNIT_FIELDS}
}`;

export const UNIT_BY_NUMBER_QUERY = groq`*[_type == "unit" && unitNumber == $unitNumber][0]{
  ${UNIT_FIELDS}
}`;

export const ALL_UNIT_NUMBERS_QUERY = groq`*[_type == "unit"].unitNumber`;

// Units that can be applied for long-term — excludes STR-only since those
// aren't lease-applicable. Includes leased units (people may want to apply
// ahead of an opening) and coming-soon units.
export const LEASE_APPLICABLE_UNITS_QUERY = groq`*[_type == "unit" && status != "str-only"] | order(order asc) {
  unitNumber,
  name,
  type,
  status,
  availableDate,
  beds,
  baths
}`;

export const HOME_PAGE_QUERY = groq`*[_type == "homePage"][0]{
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  "heroPhoto": heroPhoto{ ${PHOTO_FIELDS} },
  heroPrimaryCta { ${CTA_FIELDS} },
  heroSecondaryCta { ${CTA_FIELDS} },
  valueProps,
  aboutEyebrow,
  aboutTitle,
  aboutBody,
  "aboutPhoto": aboutPhoto{ ${PHOTO_FIELDS} },
  aboutPrimaryCta { ${CTA_FIELDS} },
  aboutSecondaryCta { ${CTA_FIELDS} },
  emailCaptureEyebrow,
  emailCaptureTitle,
  emailCaptureBody
}`;

export const UNITS_PAGE_QUERY = groq`*[_type == "unitsPage"][0]{
  eyebrow,
  title,
  description
}`;

export const SHORT_STAYS_PAGE_QUERY = groq`*[_type == "shortStaysPage"][0]{
  eyebrow,
  title,
  description,
  bodyEyebrow,
  bodyTitle,
  bodyContent,
  amenities,
  "detailImage": detailImage{ ${PHOTO_FIELDS} },
  "unit": unit->{ ${UNIT_FIELDS} }
}`;

export const NEIGHBORHOOD_PAGE_QUERY = groq`*[_type == "neighborhoodPage"][0]{
  eyebrow,
  title,
  description,
  "heroPhoto": heroPhoto{ ${PHOTO_FIELDS} },
  walkableEyebrow,
  walkableTitle,
  walkableItems,
  seasonsEyebrow,
  seasonsTitle,
  seasons
}`;

export const APPLY_PAGE_QUERY = groq`*[_type == "applyPage"][0]{
  eyebrow,
  title,
  description,
  steps,
  faqEyebrow,
  faqTitle,
  faqs
}`;
