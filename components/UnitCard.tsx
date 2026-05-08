import Link from 'next/link';
import SanityImage from '@/components/SanityImage';
import StatusBadge from './StatusBadge';
import type { Unit } from '@/lib/sanity/types';
import {
  effectiveUnitStatus,
  formatBedsBaths,
  formatMonthly,
  formatSquareFeet,
  unitAvailability,
} from '@/lib/format';

export default function UnitCard({ unit }: { unit: Unit }) {
  const lowestRate = Math.min(
    unit.pricing.twelveMonth,
    unit.pricing.sixMonth,
    unit.pricing.monthlyWinter,
    unit.pricing.monthlySummer,
  );
  const primary = unit.photos?.[0];
  const status = effectiveUnitStatus(unit);

  return (
    <Link
      href={`/units/${unit.unitNumber}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-ivory transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {primary && (
          <SanityImage
            image={primary}
            alt={primary.alt || `${unit.name || `Unit ${unit.unitNumber}`} — primary photo`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-4 top-4">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">Unit {unit.unitNumber}</p>
          <p className="text-xs text-charcoal-muted">{formatSquareFeet(unit.squareFeet)}</p>
        </div>
        <h3 className="mt-2 font-serif text-2xl text-charcoal">
          {unit.name || (unit.type === '2br' ? 'Two Bedroom' : 'Studio')}
        </h3>
        <p className="mt-1.5 text-sm text-charcoal-muted">
          {formatBedsBaths(unit.beds, unit.baths)}
        </p>

        {unit.shortDescription && (
          <p className="mt-4 text-sm text-charcoal/80 leading-relaxed line-clamp-2 text-pretty">
            {unit.shortDescription}
          </p>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-charcoal/10 pt-5 gap-3">
          <div className="min-w-0">
            {status === 'str-only' ? (
              <>
                <p className="eyebrow">Short stays</p>
                <p className="mt-1 font-serif text-xl text-charcoal">Book on Airbnb</p>
              </>
            ) : status === 'available' ? (
              <>
                <p className="eyebrow">From</p>
                <p className="mt-1 font-serif text-xl text-charcoal">{formatMonthly(lowestRate)}</p>
                <p className="mt-1 text-xs text-forest font-medium">{unitAvailability(unit)}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">Availability</p>
                <p className="mt-1 font-serif text-lg text-charcoal text-balance">
                  {unitAvailability(unit)}
                </p>
              </>
            )}
          </div>
          <span className="btn-ghost group-hover:text-forest shrink-0">
            View
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
