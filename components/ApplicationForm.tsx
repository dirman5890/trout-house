'use client';

import { useState } from 'react';

type ApplicableUnit = {
  unitNumber: string;
  name?: string;
  type: 'studio' | '2br';
  status: 'available' | 'leased' | 'coming-soon';
  availableDate?: string;
};

type Props = {
  units: ApplicableUnit[];
  defaultUnit?: string;
  defaultTerm?: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const LEASE_TERMS = [
  { value: '12-month', label: '12-month lease (best value)' },
  { value: '6-month', label: '6-month lease' },
  { value: 'not-sure', label: 'Not sure yet' },
];

function unitOptionLabel(unit: ApplicableUnit): string {
  const base = `Unit ${unit.unitNumber}${unit.name ? ` — ${unit.name}` : ''}`;
  switch (unit.status) {
    case 'available':
      return `${base} (Available now)`;
    case 'coming-soon':
      return `${base} (Available ${unit.availableDate ? new Date(unit.availableDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'soon'})`;
    case 'leased':
      return `${base} (Currently leased — apply ahead)`;
  }
}

export default function ApplicationForm({ units, defaultUnit, defaultTerm }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pets, setPets] = useState<'no' | 'yes'>('no');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Submission failed.');
      }
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-forest/30 bg-forest/5 p-10 text-center">
        <p className="font-serif text-3xl text-forest">Application received.</p>
        <p className="mt-3 text-charcoal-muted max-w-md mx-auto leading-relaxed">
          We&rsquo;ll review and be in touch within 48 hours — usually faster. If approved,
          we&rsquo;ll send you a digital lease and move-in details.
        </p>
        <p className="mt-6 text-sm text-charcoal-muted">
          Questions in the meantime?{' '}
          <a
            href="mailto:trouthousellc@gmail.com"
            className="underline underline-offset-4 hover:text-forest"
          >
            trouthousellc@gmail.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      {/* Personal */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Full name *</label>
            <input id="name" name="name" required className="input" autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required className="input" autoComplete="email" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="phone">Phone *</label>
            <input id="phone" name="phone" type="tel" required className="input" autoComplete="tel" />
          </div>
          <div>
            <label className="label" htmlFor="currentCity">Current city / state</label>
            <input id="currentCity" name="currentCity" className="input" autoComplete="address-level2" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="currentAddress">Current address (optional)</label>
          <input id="currentAddress" name="currentAddress" className="input" autoComplete="street-address" />
        </div>
      </fieldset>

      {/* Employment */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">Employment + income</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="employer">Employer *</label>
            <input id="employer" name="employer" required className="input" autoComplete="organization" />
          </div>
          <div>
            <label className="label" htmlFor="jobTitle">Job title</label>
            <input id="jobTitle" name="jobTitle" className="input" autoComplete="organization-title" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="monthlyIncome">Monthly income (USD) *</label>
          <input
            id="monthlyIncome"
            name="monthlyIncome"
            required
            inputMode="numeric"
            placeholder="e.g. 6500"
            className="input"
          />
          <p className="mt-1.5 text-xs text-charcoal-muted">Gross monthly. Combine with co-applicant if you have one.</p>
        </div>
      </fieldset>

      {/* Tenancy */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">What you&rsquo;re looking for</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="unitNumber">Which unit? *</label>
            <select
              id="unitNumber"
              name="unitNumber"
              required
              defaultValue={defaultUnit || ''}
              className="input"
            >
              <option value="" disabled>Choose a unit…</option>
              {units.map((u) => (
                <option key={u.unitNumber} value={u.unitNumber}>
                  {unitOptionLabel(u)}
                </option>
              ))}
              <option value="any">Any available unit</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="moveInDate">Desired move-in date *</label>
            <input id="moveInDate" name="moveInDate" type="date" required className="input" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="leaseTerm">Lease term *</label>
          <select
            id="leaseTerm"
            name="leaseTerm"
            required
            defaultValue={defaultTerm || ''}
            className="input"
          >
            <option value="" disabled>Choose a term…</option>
            {LEASE_TERMS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="label">Pets?</span>
          <div className="mt-2 flex gap-3">
            {[
              { value: 'no', label: 'No pets' },
              { value: 'yes', label: 'Yes' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={[
                  'flex-1 sm:flex-none cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-all',
                  pets === opt.value
                    ? 'border-charcoal bg-charcoal text-cream'
                    : 'border-charcoal/20 bg-cream text-charcoal hover:border-charcoal/40',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="pets"
                  value={opt.value}
                  checked={pets === opt.value}
                  onChange={() => setPets(opt.value as 'no' | 'yes')}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        {pets === 'yes' && (
          <div>
            <label className="label" htmlFor="petsDescription">Tell us about your pet(s)</label>
            <input
              id="petsDescription"
              name="petsDescription"
              placeholder="e.g. one 25 lb dog, well-behaved, 4 yrs old"
              className="input"
            />
          </div>
        )}
      </fieldset>

      {/* References */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">References (optional)</legend>
        <p className="text-sm text-charcoal-muted -mt-3">
          Helpful but not required at this stage — we&rsquo;ll ask for more during review if needed.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="previousLandlord">Previous landlord</label>
            <input id="previousLandlord" name="previousLandlord" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="previousLandlordPhone">Phone</label>
            <input id="previousLandlordPhone" name="previousLandlordPhone" type="tel" className="input" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="professionalReference">Professional reference</label>
            <input id="professionalReference" name="professionalReference" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="professionalReferencePhone">Phone</label>
            <input id="professionalReferencePhone" name="professionalReferencePhone" type="tel" className="input" />
          </div>
        </div>
      </fieldset>

      {/* Notes */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">Anything else?</legend>
        <textarea
          name="message"
          rows={4}
          placeholder="Co-applicants, reason for moving, schedule a viewing — anything that helps us know who you are."
          className="input resize-none"
        />
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-rust">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-charcoal/10">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary w-full sm:w-auto disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Submit application'}
        </button>
        <p className="text-xs text-charcoal-muted">
          No application fee. We typically respond within 48 hours.
        </p>
      </div>
    </form>
  );
}
