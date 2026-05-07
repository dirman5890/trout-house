import type { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import FAQ from '@/components/FAQ';
import { sanityFetch } from '@/lib/sanity/client';
import { APPLY_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries';
import type { ApplyPage, SiteSettings } from '@/lib/sanity/types';
import { SITE_DEFAULTS } from '@/lib/constants';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Apply',
  description:
    'How to apply for a furnished rental at Trout House Kings Beach. Online application, 48-hour turnaround, digital lease.',
};

export default async function ApplyPage() {
  const [page, settings] = await Promise.all([
    sanityFetch<ApplyPage | null>({ query: APPLY_PAGE_QUERY, tags: ['applyPage'] }),
    sanityFetch<SiteSettings | null>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
  ]);

  const applyUrl = settings?.applyUrlFallback || SITE_DEFAULTS.applyUrlFallback;
  const steps = page?.steps || [];
  const faqs = page?.faqs || [];

  return (
    <>
      <section className="container-page pt-20 pb-12 sm:pt-28">
        <SectionHeader
          eyebrow={page?.eyebrow || 'Apply'}
          title={page?.title || 'Four steps to a key in your hand.'}
          description={page?.description}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Start application ↗
          </a>
          <a href="#faq" className="btn-secondary">
            Read the FAQ
          </a>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="container-page py-16 sm:py-20">
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-3xl bg-ivory p-7 sm:p-8 flex flex-col">
                <span className="font-serif text-2xl text-rust">
                  0{i + 1}
                </span>
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

      <section className="container-page pb-24">
        <div className="rounded-3xl border border-charcoal/10 bg-ivory p-10 text-center">
          <p className="font-serif text-display-md text-charcoal text-balance">
            Ready when you are.
          </p>
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            Start application ↗
          </a>
        </div>
      </section>
    </>
  );
}
