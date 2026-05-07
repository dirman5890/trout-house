import type { Metadata } from 'next';
import SanityImage from '@/components/SanityImage';
import PhotoGallery from '@/components/PhotoGallery';
import SectionHeader from '@/components/SectionHeader';
import { PortableTextBody } from '@/lib/sanity/portable-text';
import { sanityFetch } from '@/lib/sanity/client';
import { SHORT_STAYS_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries';
import type { ShortStaysPage, SiteSettings } from '@/lib/sanity/types';
import { formatBedsBaths, formatSquareFeet } from '@/lib/format';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Short Stays',
  description:
    'Book a nightly stay at Trout House Kings Beach — fireplace, full kitchen, walk to Lake Tahoe.',
};

export default async function ShortStaysPage() {
  const [page, settings] = await Promise.all([
    sanityFetch<ShortStaysPage | null>({
      query: SHORT_STAYS_PAGE_QUERY,
      tags: ['shortStaysPage', 'unit'],
    }),
    sanityFetch<SiteSettings | null>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
  ]);

  const unit = page?.unit;
  const photos = unit?.photos || [];
  const airbnb = settings?.airbnbUrl;

  return (
    <>
      <section className="container-page pt-20 pb-10 sm:pt-28">
        <SectionHeader
          eyebrow={page?.eyebrow || 'Short stays'}
          title={page?.title || 'A two-bedroom on the lake side of Kings Beach.'}
          description={page?.description}
        />
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {airbnb && (
            <a href={airbnb} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Book on Airbnb ↗
            </a>
          )}
          {unit && (
            <p className="text-sm text-charcoal-muted">
              {formatBedsBaths(unit.beds, unit.baths)} · {formatSquareFeet(unit.squareFeet)}
            </p>
          )}
        </div>
      </section>

      {photos.length > 0 && (
        <section className="container-page mt-6">
          <PhotoGallery photos={photos} alt="Trout House short stay" />
        </section>
      )}

      <section className="container-page py-16 sm:py-24 grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-20">
        <div className="max-w-prose">
          {page?.bodyEyebrow && <p className="eyebrow">{page.bodyEyebrow}</p>}
          {page?.bodyTitle && (
            <h2 className="mt-3 font-serif text-display-md text-charcoal text-balance">
              {page.bodyTitle}
            </h2>
          )}
          <div className="mt-6">
            <PortableTextBody value={page?.bodyContent} />
          </div>
          {airbnb && (
            <div className="mt-8">
              <a href={airbnb} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Check availability on Airbnb ↗
              </a>
            </div>
          )}
        </div>

        {(page?.amenities || page?.detailImage) && (
          <aside className="rounded-3xl bg-ivory p-8">
            {page?.amenities && page.amenities.length > 0 && (
              <>
                <p className="eyebrow">In the unit</p>
                <ul className="mt-4 space-y-3 text-charcoal/85">
                  {page.amenities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-3 shrink-0 bg-forest" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {page?.detailImage && (
              <div className="mt-8 pt-8 border-t border-charcoal/10">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-sand">
                  <SanityImage
                    image={page.detailImage}
                    alt={page.detailImage.alt || 'Trout House detail'}
                    fill
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </aside>
        )}
      </section>
    </>
  );
}
