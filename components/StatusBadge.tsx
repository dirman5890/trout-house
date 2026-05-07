import type { UnitStatus } from '@/lib/sanity/types';
import { statusLabel } from '@/lib/format';

const STYLES: Record<UnitStatus, string> = {
  available: 'bg-forest text-cream',
  leased: 'bg-charcoal/10 text-charcoal-muted',
  'coming-soon': 'bg-rust text-cream',
};

export default function StatusBadge({
  status,
  className = '',
}: {
  status: UnitStatus;
  className?: string;
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider',
        STYLES[status],
        className,
      ].join(' ')}
    >
      {status === 'available' && (
        <span className="h-1.5 w-1.5 rounded-full bg-cream animate-pulse" aria-hidden="true" />
      )}
      {statusLabel(status)}
    </span>
  );
}
