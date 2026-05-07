import type { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import UnitFilter from '@/components/UnitFilter';
import EmailCapture from '@/components/EmailCapture';
import { sanityFetch } from '@/lib/sanity/client';
import { ALL_UNITS_QUERY, UNITS_PAGE_QUERY } from '@/lib/sanity/queries';
import type { Unit, UnitsPage } from '@/lib/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Units',
  description:
    'Browse all furnished units at Trout House Kings Beach — studios and a two-bedroom, with availability and lease options.',
};

export default async function UnitsPage() {
  const [page, units] = await Promise.all([
    sanityFetch<UnitsPage | null>({ query: UNITS_PAGE_QUERY, tags: ['unitsPage'] }),
    sanityFetch<Unit[]>({ query: ALL_UNITS_QUERY, tags: ['unit'] }),
  ]);

  return (
    <>
      <section className="container-page pt-20 pb-12 sm:pt-28">
        <SectionHeader
          eyebrow={page?.eyebrow || 'The building'}
          title={page?.title || 'Eight units. Furnished, walkable, available on your terms.'}
          description={page?.description}
        />
      </section>
      <section className="container-page pb-24">
        <UnitFilter units={units || []} />
      </section>
      <EmailCapture />
    </>
  );
}
