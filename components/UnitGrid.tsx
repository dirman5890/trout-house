import UnitCard from './UnitCard';
import type { Unit } from '@/lib/sanity/types';

export default function UnitGrid({ units }: { units: Unit[] }) {
  if (units.length === 0) {
    return (
      <p className="text-center text-charcoal-muted py-16">
        No units match your filter. Try changing it, or{' '}
        <a href="/apply" className="underline underline-offset-4 hover:text-forest">
          start an application
        </a>{' '}
        and we&rsquo;ll reach out when something opens.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {units.map((unit) => (
        <UnitCard key={unit._id} unit={unit} />
      ))}
    </div>
  );
}
