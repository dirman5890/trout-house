import Link from 'next/link';
import type { Pricing } from '@/lib/sanity/types';
import { formatMonthly } from '@/lib/format';

type Row = {
  key: 'twelveMonth' | 'sixMonth' | 'monthlyWinter' | 'monthlySummer';
  title: string;
  caveat: string;
  badge?: string;
};

const ROWS: Row[] = [
  {
    key: 'twelveMonth',
    title: '12-month lease',
    caveat: 'Tenant pays utilities',
    badge: 'Best value',
  },
  {
    key: 'sixMonth',
    title: '6-month lease',
    caveat: 'Utilities included',
  },
  {
    key: 'monthlyWinter',
    title: 'Month-to-month · Winter',
    caveat: 'Oct–May · Utilities included',
  },
  {
    key: 'monthlySummer',
    title: 'Month-to-month · Summer',
    caveat: 'Jun–Sep · Utilities included',
  },
];

export default function PricingTable({
  pricing,
  unitNumber,
}: {
  pricing: Pricing;
  unitNumber?: string;
}) {
  return (
    <div className="rounded-3xl border border-charcoal/10 bg-ivory overflow-hidden">
      <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-charcoal/10">
        <p className="eyebrow">Lease options</p>
        <p className="mt-1 font-serif text-xl text-charcoal">Choose the term that fits your stay</p>
      </div>
      <ul className="divide-y divide-charcoal/10">
        {ROWS.map((row) => (
          <li key={row.key} className="flex items-start justify-between gap-4 px-6 py-5 sm:px-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-charcoal">{row.title}</p>
                {row.badge && (
                  <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-forest">
                    {row.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-charcoal-muted">{row.caveat}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-serif text-xl text-charcoal whitespace-nowrap">
                {formatMonthly(pricing[row.key])}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-6 py-5 sm:px-8 sm:py-6 border-t border-charcoal/10 bg-cream">
        <Link
          href={unitNumber ? `/apply?unit=${unitNumber}` : '/apply'}
          className="btn-primary w-full sm:w-auto"
        >
          Apply now
        </Link>
        <p className="mt-3 text-xs text-charcoal-muted">
          No application fee. Most applications reviewed within 48 hours.
        </p>
      </div>
    </div>
  );
}
