import type { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import FAQ from '@/components/FAQ';
import ApplicationForm from '@/components/ApplicationForm';
import { sanityFetch } from '@/lib/sanity/client';
import {
  APPLY_PAGE_QUERY,
  LEASE_APPLICABLE_UNITS_QUERY,
} from '@/lib/sanity/queries';
import type { ApplyPage, Unit } from '@/lib/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Apply',
  description:
    'Apply for a furnished rental at Trout House Kings Beach — no application fee, 48-hour turnaround.',
};

type ApplicableUnit = {
  unitNumber: string;
  name?: string;
  type: 'studio' | '2br';
  status: 'available' | 'leased' | 'coming-soon';
  availableDate?: string;
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: { unit?: string; term?: string };
}) {
  const [page, units] = await Promise.all([
    sanityFetch<ApplyPage | null>({ query: APPLY_PAGE_QUERY, tags: ['applyPage'] }),
    sanityFetch<ApplicableUnit[]>({
      query: LEASE_APPLICABLE_UNITS_QUERY,
      tags: ['unit'],
    }),
  ]);

  const steps = page?.steps || [];
  const faqs = page?.faqs || [];

  return (
    <>
      <section className="container-page pt-20 pb-12 sm:pt-28">
        <SectionHeader
          eyebrow={page?.eyebrow || 'Apply'}
          title={page?.title || 'Three steps to a key in your hand.'}
          description={
            page?.description ||
            'No application fee, no third-party redirects. Submit through the form below — most applications are reviewed within 48 hours.'
          }
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#form" className="btn-primary">
            Start application ↓
          </a>
          <a href="#faq" className="btn-secondary">
            Read the FAQ
          </a>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-3xl bg-ivory p-7 sm:p-8 flex flex-col">
                <span className="font-serif text-2xl text-rust">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-xl text-charcoal text-balance">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-charcoal/80 leading-relaxed text-pretty">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section id="form" className="container-page py-16 sm:py-24 max-w-3xl scroll-mt-24">
        <SectionHeader
          eyebrow="Application form"
          title="Tell us about you."
          description="No fee. Your information goes directly to the property owner — not a third-party screening service."
        />
        <div className="mt-12">
          <ApplicationForm
            units={units || []}
            defaultUnit={searchParams.unit}
            defaultTerm={searchParams.term}
          />
        </div>
      </section>

      {faqs.length > 0 && (
        <section id="faq" className="container-page py-16 sm:py-24 max-w-3xl scroll-mt-24">
          <SectionHeader
            eyebrow={page?.faqEyebrow || 'Common questions'}
            title={page?.faqTitle || 'Things we get asked.'}
          />
          <div className="mt-10">
            <FAQ items={faqs} />
          </div>
        </section>
      )}
    </>
  );
}
