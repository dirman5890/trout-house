'use client';

import { useState } from 'react';
import type { Unit } from '@/lib/sanity/types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const LEASE_TERMS = [
  '12-month',
  '6-month',
  'Month-to-month — winter',
  'Month-to-month — summer',
  'Not sure yet',
];

export default function ContactForm({ unit }: { unit?: Unit }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not send message.');
      }
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-forest/30 bg-forest/5 p-8 text-center">
        <p className="font-serif text-2xl text-forest">Message sent.</p>
        <p className="mt-2 text-charcoal-muted">
          Aubrey or Chris will be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="unitNumber" value={unit?.unitNumber || ''} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Your name</label>
          <input id="name" name="name" required className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="moveInDate">Desired move-in</label>
          <input id="moveInDate" name="moveInDate" type="date" className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="leaseTerm">Lease term preference</label>
        <select id="leaseTerm" name="leaseTerm" className="input" defaultValue="">
          <option value="" disabled>Choose one…</option>
          {LEASE_TERMS.map((term) => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={4} className="input resize-none" />
      </div>

      {error && (
        <p role="alert" className="text-sm text-rust">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full sm:w-auto disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      <p className="text-xs text-charcoal-muted">
        We typically respond within 48 hours. We will never share your details.
      </p>
    </form>
  );
}
