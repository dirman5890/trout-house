// TypeScript types matching the GROQ projections in lib/sanity/queries.ts.
// Keep these in sync when schemas change. (Manual maintenance for now —
// can swap to sanity-typegen later if the team grows.)

export type SanityImage = {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number; aspectRatio: number };
      lqip?: string;
    };
  };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type Cta = {
  label: string;
  href: string;
  external?: boolean;
};

export type Pricing = {
  twelveMonth: number;
  sixMonth: number;
  monthlyWinter: number;
  monthlySummer: number;
  utilitiesIncludedTwelveMonth: boolean;
  utilitiesIncludedSixMonth: boolean;
  utilitiesIncludedMonthlyWinter: boolean;
  utilitiesIncludedMonthlySummer: boolean;
};

export type UnitStatus = 'available' | 'leased' | 'coming-soon';
export type UnitType = 'studio' | '2br';

export type Unit = {
  _id: string;
  unitNumber: string;
  name?: string;
  type: UnitType;
  status: UnitStatus;
  availableDate?: string;
  squareFeet: number;
  beds: number;
  baths: number;
  shortDescription?: string;
  features?: string[];
  photos?: SanityImage[];
  pricing: Pricing;
  applyUrl?: string;
  shortTermAvailable?: boolean;
};

export type SiteSettings = {
  name: string;
  fullName: string;
  tagline?: string;
  description?: string;
  address?: { line1?: string; city?: string; state?: string; zip?: string };
  contactEmail?: string;
  contactPhone?: string;
  airbnbUrl?: string;
  applyUrlFallback?: string;
};

export type ValueProp = { title: string; body: string };
export type WalkableItem = { name: string; detail?: string };
export type Season = { title: string; body: string };
export type FaqItem = { q: string; a: string };
export type ApplyStep = { title: string; body: string };

// Portable Text — leave as `unknown[]` and let the renderer type-narrow.
export type PortableTextValue = unknown[];

export type HomePage = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroPhoto?: SanityImage;
  heroPrimaryCta?: Cta;
  heroSecondaryCta?: Cta;
  valueProps?: ValueProp[];
  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutBody?: PortableTextValue;
  aboutPhoto?: SanityImage;
  aboutPrimaryCta?: Cta;
  aboutSecondaryCta?: Cta;
  emailCaptureEyebrow?: string;
  emailCaptureTitle?: string;
  emailCaptureBody?: string;
};

export type UnitsPage = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export type ShortStaysPage = {
  eyebrow?: string;
  title?: string;
  description?: string;
  bodyEyebrow?: string;
  bodyTitle?: string;
  bodyContent?: PortableTextValue;
  amenities?: string[];
  detailImage?: SanityImage;
  unit?: Unit;
};

export type NeighborhoodPage = {
  eyebrow?: string;
  title?: string;
  description?: string;
  heroPhoto?: SanityImage;
  walkableEyebrow?: string;
  walkableTitle?: string;
  walkableItems?: WalkableItem[];
  seasonsEyebrow?: string;
  seasonsTitle?: string;
  seasons?: Season[];
};

export type ApplyPage = {
  eyebrow?: string;
  title?: string;
  description?: string;
  steps?: ApplyStep[];
  faqEyebrow?: string;
  faqTitle?: string;
  faqs?: FaqItem[];
};
