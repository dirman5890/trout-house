import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PhotoGallery from '@/components/PhotoGallery';
import PricingTable from '@/components/PricingTable';
import ContactForm from '@/components/ContactForm';
import StatusBadge from '@/components/StatusBadge';
import SectionHeader from '@/components/SectionHeader';
import { sanityClient, sanityFetch } from '@/lib/sanity/client';
import {
  ALL_UNIT_NUMBERS_QUERY,
  SITE_SETTINGS_QUERY,
  UNIT_BY_NUMBER_QUERY,
} from '@/lib/sanity/queries';
import type { SiteSettings, Unit } from '@/lib/sanity/types';
import { formatBedsBaths, formatSquareFeet } from '@/lib/format';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const numbers = await sanityClient.fetch<string[]>(ALL_UNIT_NUMBERS_QUERY);
    return numbers.map((unitNumber) => ({ unitNumber }));
  } catch {
    // Sanity not configured yet — let pages render dynamically.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { unitNumber: string };
}): Promise<Metadata> {
  const unit = await sanityFetch<Unit | null>({
    query: UNIT_BY_NUMBER_QUERY,
    params: { unitNumber: params.unitNumber },
    tags: ['unit'],
  });
  if (!unit) return {};
  const title = `Unit ${unit.unitNumber}${unit.name ? ` · ${unit.name}` : ''}`;
  const description =
    unit.shortDescription ||
    `${formatBedsBaths(unit.beds, unit.baths)}, ${formatSquareFeet(unit.squareFeet)}. Furnished rental at Trout House Kings Beach.`;
  return { title, description };
}

export default async function UnitDetailPage({
  params,
}: {
  params: { unitNumber: string };
}) {
  const [unit, settings] = await Promise.all([
    sanityFetch<Unit | null>({
      query: UNIT_BY_NUMBER_QUERY,
      params: { unitNumber: params.unitNumber },
      tags: ['unit'],
    }),
    sanityFetch<SiteSettings | null>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
  ]);

  if (!unit) notFound();

  const airbnb = settings?.airbnbUrl;
  const photos = unit.photos || [];

  return (
    <>
      <section className="container-page pt-12 sm:pt-16">
        <Link
          href="/units"
          className="inline-flex items-center gap-2 text-sm text-charcoal-muted hover:text-forest transition-colors"
        >
          <span aria-hidden="true">←</span> All units
        </Link>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="eyebrow">Unit {unit.unitNumber}</p>
            <h1 className="mt-3 font-serif text-display-lg text-charcoal text-balance">
              {unit.name || (unit.type === '2br' ? 'Two Bedroom' : 'Studio')}
            </h1>
            <p className="mt-3 text-charcoal-muted">
              {formatBedsBaths(unit.beds, unit.baths)} · {formatSquareFeet(unit.squareFeet)}
            </p>
          </div>
          <StatusBadge status={unit.status} className="self-start sm:self-end" />
        </div>
      </section>

      <section className="container-page mt-10">
        <PhotoGallery photos={photos} alt={`Unit ${unit.unitNumber}`} />
      </section>

      <section className="container-page py-16 sm:py-24 grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {unit.status === 'str-only' ? (
            <div className="rounded-3xl border border-charcoal/10 bg-ivory overflow-hidden">
              <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-charcoal/10">
                <p className="eyebrow">Short stays</p>
                <p className="mt-1 font-serif text-xl text-charcoal">
                  Bookable nightly on Airbnb
                </p>
              </div>
              <div className="px-6 py-6 sm:px-8 sm:py-7 space-y-4">
                <p className="text-charcoal/85 leading-relaxed">
                  This unit is currently dedicated to short-term stays. Pricing,
                  availability, and reservations are managed through Airbnb.
                </p>
                {airbnb ? (
                  <a
                    href={airbnb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full sm:w-auto"
                  >
                    Book on Airbnb ↗
                  </a>
                ) : (
                  <p className="text-sm text-charcoal-muted">
                    Airbnb listing link coming soon — check back shortly.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <PricingTable pricing={unit.pricing} unitNumber={unit.unitNumber} />
              {unit.shortTermAvailable && airbnb && (
                <div className="mt-6 rounded-3xl border border-charcoal/10 bg-ivory p-6">
                  <p className="eyebrow">Also available</p>
                  <p className="mt-2 font-serif text-xl text-charcoal">Book a short stay</p>
                  <p className="mt-2 text-sm text-charcoal-muted">
                    This unit is also bookable nightly on Airbnb.
                  </p>
                  <a
                    href={airbnb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary mt-4 !py-2 !px-5 text-xs"
                  >
                    Book on Airbnb ↗
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          {unit.shortDescription && (
            <p className="text-lg text-charcoal/85 leading-relaxed text-pretty max-w-prose">
              {unit.shortDescription}
            </p>
          )}

          {unit.features && unit.features.length > 0 && (
            <div className="mt-10">
              <p className="eyebrow">In the unit</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 max-w-2xl">
                {unit.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-charcoal/85">
                    <span aria-hidden="true" className="mt-2 h-1 w-3 shrink-0 bg-forest" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {unit.availableDate && unit.status === 'coming-soon' && (
            <div className="mt-10 rounded-2xl bg-ivory p-6">
              <p className="eyebrow">Coming soon</p>
              <p className="mt-2 text-charcoal">
                Available starting{' '}
                <span className="font-medium">
                  {new Date(unit.availableDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                . Get on the list below and we&rsquo;ll let you know when applications open.
              </p>
            </div>
          )}

          <div id="ask" className="mt-16">
            <SectionHeader
              eyebrow="Have questions?"
              title="Ask us anything about this unit."
              description="Aubrey or Chris will respond within 48 hours. We're happy to walk you through the lease, schedule a viewing, or talk seasonality."
            />
            <div className="mt-8">
              <ContactForm unit={unit} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
