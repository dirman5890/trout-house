'use client';

import { useMemo, useState } from 'react';
import UnitGrid from './UnitGrid';
import type { Unit } from '@/lib/sanity/types';

type Filter = 'all' | 'available' | 'studio' | '2br';

const OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All units' },
  { value: 'available', label: 'Available now' },
  { value: 'studio', label: 'Studios' },
  { value: '2br', label: '2 bedroom' },
];

export default function UnitFilter({ units }: { units: Unit[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    switch (filter) {
      case 'available':
        return units.filter((u) => u.status === 'available');
      case 'studio':
        return units.filter((u) => u.type === 'studio');
      case '2br':
        return units.filter((u) => u.type === '2br');
      default:
        return units;
    }
  }, [units, filter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {OPTIONS.map((opt) => {
          const active = filter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={[
                'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                active
                  ? 'bg-charcoal text-cream'
                  : 'bg-ivory text-charcoal/80 hover:bg-sand',
              ].join(' ')}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
        <p className="ml-auto text-xs text-charcoal-muted">
          {filtered.length} of {units.length}
        </p>
      </div>
      <UnitGrid units={filtered} />
    </div>
  );
}
