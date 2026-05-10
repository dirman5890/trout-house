import type { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import SanityImage from '@/components/SanityImage';
import PhotoGallery from '@/components/PhotoGallery';
import EmailCapture from '@/components/EmailCapture';
import { sanityFetch } from '@/lib/sanity/client';
import { NEIGHBORHOOD_PAGE_QUERY } from '@/lib/sanity/queries';
import type { NeighborhoodPage } from '@/lib/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Neighborhood',
  description:
    'Two blocks from Lake Tahoe. Walk to coffee, dinner, and the beach — drive 20 minutes to skiing in winter.',
};

export default async function NeighborhoodPage() {
  const page = await sanityFetch<NeighborhoodPage | null>({
    query: NEIGHBORHOOD_PAGE_QUERY,
    tags: ['neighborhoodPage'],
  });

  return (
    <>
      <section className="container-page pt-20 pb-12 sm:pt-28">
        <SectionHeader
          eyebrow={page?.eyebrow || 'The neighborhood'}
          title={page?.title || 'Two blocks from the lake.'}
          description={page?.description}
        />
      </section>

      {page?.gallery && page.gallery.length > 0 ? (
        <section className="container-page pb-16 sm:pb-24">
          <PhotoGallery photos={page.gallery} alt="The neighborhood — Kings Beach, Lake Tahoe" />
        </section>
      ) : page?.heroPhoto ? (
        <section className="container-page pb-16 sm:pb-24">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-sand">
            <SanityImage
              image={page.heroPhoto}
              alt={page.heroPhoto.alt || 'Lake Tahoe at Kings Beach'}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        </section>
      ) : null}

      <section className="container-page pb-20 sm:pb-28 grid gap-12 lg:grid-cols-2 lg:gap-20">
        {page?.walkableItems && page.walkableItems.length > 0 && (
          <div>
            {page.walkableEyebrow && <p className="eyebrow">{page.walkableEyebrow}</p>}
            {page.walkableTitle && (
              <h2 className="mt-3 font-serif text-display-md text-charcoal text-balance">
                {page.walkableTitle}
              </h2>
            )}
            <ul className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {page.walkableItems.map((item) => (
                <li
                  key={item.name}
                  className="py-4 flex items-baseline justify-between gap-6"
                >
                  <span className="font-serif text-lg text-charcoal">{item.name}</span>
                  {item.detail && (
                    <span className="text-sm text-charcoal-muted text-right">{item.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {page?.seasons && page.seasons.length > 0 && (
          <div>
            {page.seasonsEyebrow && <p className="eyebrow">{page.seasonsEyebrow}</p>}
            {page.seasonsTitle && (
              <h2 className="mt-3 font-serif text-display-md text-charcoal text-balance">
                {page.seasonsTitle}
              </h2>
            )}
            <div className="mt-8 space-y-8">
              {page.seasons.map((s) => (
                <div key={s.title}>
                  <h3 className="font-serif text-xl text-charcoal">{s.title}</h3>
                  <p className="mt-2 text-charcoal/80 leading-relaxed text-pretty">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <EmailCapture />
    </>
  );
}
