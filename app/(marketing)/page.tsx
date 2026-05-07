import Link from 'next/link';
import Hero from '@/components/Hero';
import ValueProps from '@/components/ValueProps';
import UnitGrid from '@/components/UnitGrid';
import EmailCapture from '@/components/EmailCapture';
import SectionHeader from '@/components/SectionHeader';
import SanityImage from '@/components/SanityImage';
import { PortableTextBody } from '@/lib/sanity/portable-text';
import { sanityFetch } from '@/lib/sanity/client';
import { AVAILABLE_UNITS_QUERY, HOME_PAGE_QUERY } from '@/lib/sanity/queries';
import type { HomePage, Unit } from '@/lib/sanity/types';

export const revalidate = 60;

export default async function HomePage() {
  const [home, units] = await Promise.all([
    sanityFetch<HomePage | null>({ query: HOME_PAGE_QUERY, tags: ['homePage'] }),
    sanityFetch<Unit[]>({ query: AVAILABLE_UNITS_QUERY, tags: ['unit'] }),
  ]);

  const available = (units || []).slice(0, 6);

  return (
    <>
      <Hero
        eyebrow={home?.heroEyebrow}
        title={home?.heroTitle || 'Furnished living on the North Shore.'}
        subtitle={home?.heroSubtitle}
        photo={home?.heroPhoto}
        primaryCta={home?.heroPrimaryCta}
        secondaryCta={home?.heroSecondaryCta}
      />

      {home?.valueProps && home.valueProps.length > 0 && <ValueProps items={home.valueProps} />}

      <section id="units" className="container-page py-16 sm:py-24 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Available now"
            title="Open units, ready to live in."
            description="A small collection of furnished studios and a two-bedroom — eight units in total, with new openings each season."
          />
          <Link href="/units" className="btn-ghost shrink-0">
            See all units
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {available.length > 0 ? (
          <UnitGrid units={available} />
        ) : (
          <div className="rounded-3xl border border-charcoal/10 bg-ivory p-10 text-center">
            <p className="font-serif text-2xl text-charcoal">All leased at the moment.</p>
            <p className="mt-2 text-charcoal-muted">
              Get on the list below — we&rsquo;ll email when something opens.
            </p>
          </div>
        )}
      </section>

      {(home?.aboutTitle || home?.aboutBody || home?.aboutPhoto) && (
        <section className="bg-ivory">
          <div className="container-page py-20 sm:py-28 grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {home.aboutPhoto && (
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-sand">
                <SanityImage
                  image={home.aboutPhoto}
                  alt={home.aboutPhoto.alt || 'Trout House'}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="max-w-xl">
              {home.aboutEyebrow && <p className="eyebrow">{home.aboutEyebrow}</p>}
              {home.aboutTitle && (
                <h2 className="mt-3 font-serif text-display-lg text-charcoal text-balance">
                  {home.aboutTitle}
                </h2>
              )}
              <div className="mt-6">
                <PortableTextBody value={home.aboutBody} />
              </div>
              {(home.aboutPrimaryCta || home.aboutSecondaryCta) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {home.aboutSecondaryCta && (
                    <Link href={home.aboutSecondaryCta.href} className="btn-secondary">
                      {home.aboutSecondaryCta.label}
                    </Link>
                  )}
                  {home.aboutPrimaryCta && (
                    <Link href={home.aboutPrimaryCta.href} className="btn-primary">
                      {home.aboutPrimaryCta.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <EmailCapture
        eyebrow={home?.emailCaptureEyebrow}
        title={home?.emailCaptureTitle}
        body={home?.emailCaptureBody}
      />
    </>
  );
}
