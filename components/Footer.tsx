import Link from 'next/link';
import { NAV_LINKS, SITE_DEFAULTS } from '@/lib/constants';
import type { SiteSettings } from '@/lib/sanity/types';

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const name = settings?.fullName || SITE_DEFAULTS.fullName;
  const description = settings?.description || SITE_DEFAULTS.description;
  const address = settings?.address || SITE_DEFAULTS.address;
  const email = settings?.contactEmail || SITE_DEFAULTS.contactEmail;
  const phone = settings?.contactPhone || SITE_DEFAULTS.contactPhone;
  const airbnb = settings?.airbnbUrl || SITE_DEFAULTS.airbnbUrl;

  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-ivory">
      <div className="container-page py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="font-serif text-2xl text-charcoal">
            {name}
          </Link>
          <p className="mt-3 max-w-sm text-sm text-charcoal-muted leading-relaxed">
            {description}
          </p>
          {address?.line1 && (
            <address className="mt-6 not-italic text-sm text-charcoal-muted leading-relaxed">
              {address.line1}
              <br />
              {address.city}, {address.state} {address.zip}
            </address>
          )}
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-charcoal/80 hover:text-forest transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {airbnb && (
              <li>
                <a
                  href={airbnb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-charcoal/80 hover:text-forest transition-colors"
                >
                  Book on Airbnb ↗
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-charcoal/80">
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-forest transition-colors">
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="hover:text-forest transition-colors"
                >
                  {phone}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-charcoal/10">
        <div className="container-page py-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-charcoal-muted">
          <p>© {new Date().getFullYear()} Trout House LLC. All rights reserved.</p>
          <p className="leading-relaxed">
            Trout House LLC is an Equal Housing Opportunity provider. We do not discriminate based on race, color,
            religion, sex, national origin, disability, familial status, or any other protected class.
          </p>
        </div>
      </div>
    </footer>
  );
}
