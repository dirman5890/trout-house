'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Props = {
  eyebrow?: string;
  title?: string;
  body?: string;
};

export default function EmailCapture({
  eyebrow = 'Stay in the loop',
  title = 'Be the first to know when a unit opens up.',
  body = 'We email when a unit becomes available — never more than once a month, and never for anything other than Trout House.',
}: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const responseBody = await res.json().catch(() => ({}));
        throw new Error(responseBody.error || 'Could not subscribe.');
      }
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  return (
    <section className="container-page my-20 sm:my-28">
      <div className="rounded-3xl bg-forest text-cream px-8 py-14 sm:px-14 sm:py-20 lg:px-20 lg:py-24 overflow-hidden relative">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-forest-light/40 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <p className="eyebrow !text-cream/70">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-display-lg text-cream text-balance">{title}</h2>
          <p className="mt-4 text-cream/85 leading-relaxed">{body}</p>

          {status === 'success' ? (
            <p className="mt-8 font-serif text-xl text-cream">
              You&rsquo;re on the list. Talk soon.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:gap-2">
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr] sm:gap-2">
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="rounded-full border border-cream/20 bg-cream/10 px-5 py-3.5 text-cream placeholder:text-cream/50 focus:border-cream focus:outline-none"
                />
                <input
                  name="zip"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  placeholder="ZIP"
                  autoComplete="postal-code"
                  className="rounded-full border border-cream/20 bg-cream/10 px-5 py-3.5 text-cream placeholder:text-cream/50 focus:border-cream focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-charcoal transition-all hover:-translate-y-0.5 hover:bg-ivory disabled:opacity-60"
              >
                {status === 'submitting' ? 'Adding…' : 'Notify me'}
              </button>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm text-rust">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
