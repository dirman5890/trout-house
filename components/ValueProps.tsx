import type { ValueProp } from '@/lib/sanity/types';

export default function ValueProps({ items }: { items: ValueProp[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="grid gap-12 sm:grid-cols-3 sm:gap-8 lg:gap-16">
        {items.map((prop, i) => (
          <div key={prop.title} className="relative">
            <span className="font-serif text-sm text-rust" aria-hidden="true">
              0{i + 1}
            </span>
            <h3 className="mt-3 font-serif text-2xl sm:text-[1.65rem] text-charcoal text-balance">
              {prop.title}
            </h3>
            <p className="mt-3 text-charcoal-muted leading-relaxed text-pretty">
              {prop.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
