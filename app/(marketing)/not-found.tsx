import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-page py-32 sm:py-40 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-display-lg text-charcoal text-balance">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mt-4 text-charcoal-muted max-w-md mx-auto">
        Maybe a unit was leased and the link is stale. Try one of these:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-secondary">Home</Link>
        <Link href="/units" className="btn-primary">View available units</Link>
      </div>
    </section>
  );
}
