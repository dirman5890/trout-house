import { Analytics } from '@vercel/analytics/next';
import { sanityFetch } from '@/lib/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries';
import type { SiteSettings } from '@/lib/sanity/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Marketing layout: site chrome (header, footer, skip link, analytics).
// Site settings are fetched once and passed down to header/footer so they
// stay editable in Sanity without prop-drilling everywhere.

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <Header settings={settings} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <Analytics />
    </>
  );
}
