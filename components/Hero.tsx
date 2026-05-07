import Link from 'next/link';
import SanityImage from './SanityImage';
import type { Cta, SanityImage as SanityImageType } from '@/lib/sanity/types';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  photo?: SanityImageType;
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

function CtaButton({
  cta,
  variant,
}: {
  cta?: Cta;
  variant: 'primary' | 'secondary';
}) {
  if (!cta) return null;
  const className =
    variant === 'primary'
      ? 'inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-charcoal transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-ivory'
      : 'inline-flex items-center justify-center gap-2 rounded-full border border-cream/40 px-7 py-3.5 text-sm font-medium text-cream transition-all duration-300 ease-smooth hover:bg-cream hover:text-charcoal';
  if (cta.external) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
        {cta.label} ↗
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

export default function Hero({
  eyebrow,
  title,
  subtitle,
  photo,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-cream">
      <div className="absolute inset-0 -z-10">
        {photo && (
          <SanityImage
            image={photo}
            alt={photo.alt || 'Trout House'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/40 to-charcoal/80"
        />
      </div>

      <div className="container-page relative pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36">
        {eyebrow && <p className="eyebrow !text-cream/70">{eyebrow}</p>}
        <h1 className="mt-5 max-w-4xl text-display-xl text-cream text-balance">{title}</h1>
        {subtitle && (
          <p className="mt-6 max-w-xl text-lg text-cream/85 leading-relaxed">{subtitle}</p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CtaButton cta={primaryCta} variant="primary" />
            <CtaButton cta={secondaryCta} variant="secondary" />
          </div>
        )}
      </div>
    </section>
  );
}
