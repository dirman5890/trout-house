'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NAV_LINKS, SITE_DEFAULTS } from '@/lib/constants';
import type { SiteSettings } from '@/lib/sanity/types';

export default function Header({ settings }: { settings: SiteSettings | null }) {
  const name = settings?.name || SITE_DEFAULTS.name;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full transition-colors duration-300',
        scrolled || open
          ? 'bg-cream/90 backdrop-blur-md border-b border-charcoal/10'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          aria-label={`${name} — home`}
          className="relative z-10 block transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          {/* White circular backdrop — gives the logo's interior the white
              "page" the design expects, so the trout details and text read
              cleanly. Square dimensions force a true circle. Negative
              bottom margin lets it extend below the header bar into the hero;
              we never extend above so it can't clip at the viewport top. */}
          <span className="flex h-36 w-36 sm:h-48 sm:w-48 items-center justify-center rounded-full bg-white shadow-md shadow-charcoal/10 -mb-12 sm:-mb-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.svg"
              alt={name}
              className="max-h-full max-w-full"
            />
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal/80 hover:text-forest transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/apply" className="btn-primary !py-2 !px-5 text-xs">
            Start Application
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 hover:bg-charcoal/5"
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-charcoal transition-transform duration-300 ${
                open ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-px w-5 bg-charcoal transition-transform duration-300 ${
                open ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-charcoal/10 bg-cream">
          <nav className="container-page flex flex-col py-6 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 font-serif text-2xl text-charcoal hover:text-forest"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              Start Application
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
