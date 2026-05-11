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

/* Tiny pill-style yes/no radio (used a lot in the questionnaire). */
function YesNo({
  name,
  value,
  onChange,
}: {
  name: string;
  value: 'yes' | 'no';
  onChange: (v: 'yes' | 'no') => void;
}) {
  return (
    <div className="flex gap-2">
      {(['no', 'yes'] as const).map((v) => (
        <label
          key={v}
          className={[
            'cursor-pointer rounded-full border px-4 py-1.5 text-xs font-medium transition-all capitalize',
            value === v
              ? 'border-charcoal bg-charcoal text-cream'
              : 'border-charcoal/20 bg-cream text-charcoal hover:border-charcoal/40',
          ].join(' ')}
        >
          <input
            type="radio"
            name={name}
            value={v}
            checked={value === v}
            onChange={() => onChange(v)}
            className="sr-only"
          />
          {v}
        </label>
      ))}
    </div>
  );
}

export default function ApplicationForm({ units, defaultUnit, defaultTerm }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  // Per-field yes/no state so we can render the pill toggles.
  const [petsBitten, setPetsBitten] = useState<'yes' | 'no'>('no');
  const [petsTrained, setPetsTrained] = useState<'yes' | 'no'>('no');
  const [petsDepositOk, setPetsDepositOk] = useState<'yes' | 'no'>('yes');
  const [smokes, setSmokes] = useState<'yes' | 'no'>('no');
  const [checkingAccount, setCheckingAccount] = useState<'yes' | 'no'>('yes');
  const [moveInReady, setMoveInReady] = useState<'yes' | 'no'>('yes');

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
          We&rsquo;ll review and be in touch within 48 hours. If approved, we&rsquo;ll
          email instructions for the TransUnion SmartMove background and credit check
          ($35, paid by you to TransUnion). Once that comes back, we&rsquo;ll send a
          digital lease and move-in details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <p className="text-sm text-charcoal-muted bg-ivory rounded-2xl px-5 py-4">
        <strong className="text-charcoal">Please fill this out in full.</strong>{' '}
        Incomplete applications get sent back, which slows your move-in. Required
        fields are marked with *. Each adult occupant must submit their own
        application.
      </p>

      {/* ─── ABOUT THIS UNIT ─────────────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">About this unit</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="unitNumber">Which unit are you applying for? *</label>
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
        <div className="grid gap-5 sm:grid-cols-2">
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
            <label className="label" htmlFor="occupants">How many people will live here? *</label>
            <input
              id="occupants"
              name="occupants"
              type="number"
              min="1"
              max="10"
              required
              className="input"
            />
          </div>
        </div>
      </fieldset>

      {/* ─── PERSONAL ─────────────────────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">Personal information</legend>
        <p className="text-xs text-charcoal-muted -mt-3">Please don&rsquo;t leave any blanks.</p>
        <div className="grid gap-5 sm:grid-cols-[2fr_1fr_2fr]">
          <div>
            <label className="label" htmlFor="firstName">First name *</label>
            <input id="firstName" name="firstName" required className="input" autoComplete="given-name" />
          </div>
          <div>
            <label className="label" htmlFor="middleInitial">M.I.</label>
            <input id="middleInitial" name="middleInitial" maxLength={1} className="input" autoComplete="additional-name" />
          </div>
          <div>
            <label className="label" htmlFor="lastName">Last name *</label>
            <input id="lastName" name="lastName" required className="input" autoComplete="family-name" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="dateOfBirth">Date of birth *</label>
            <input id="dateOfBirth" name="dateOfBirth" type="date" required className="input" autoComplete="bday" />
          </div>
          <div>
            <label className="label" htmlFor="driversLicense">Driver&rsquo;s license number *</label>
            <input id="driversLicense" name="driversLicense" required className="input" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="phone">Phone *</label>
            <input id="phone" name="phone" type="tel" required className="input" autoComplete="tel" />
          </div>
          <div>
            <label className="label" htmlFor="altPhone">Alternate phone</label>
            <input id="altPhone" name="altPhone" type="tel" className="input" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
      </fieldset>

      {/* ─── RENTAL HISTORY ───────────────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">Rental history</legend>
        <p className="text-xs text-charcoal-muted -mt-3">
          All addresses for the past 5 years. Skip the previous-address sections if you don&rsquo;t have them.
        </p>

        {/* Current */}
        <div className="rounded-2xl bg-ivory p-5 space-y-5">
          <p className="eyebrow">Current address *</p>
          <div>
            <label className="label" htmlFor="currentAddress">Street address *</label>
            <input id="currentAddress" name="currentAddress" required className="input" autoComplete="street-address" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="currentCityStateZip">City, state, ZIP *</label>
              <input id="currentCityStateZip" name="currentCityStateZip" required className="input" autoComplete="address-level2" />
            </div>
            <div>
              <label className="label" htmlFor="currentMoveIn">Move-in date</label>
              <input id="currentMoveIn" name="currentMoveIn" type="date" className="input" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="currentLandlordName">Landlord name</label>
              <input id="currentLandlordName" name="currentLandlordName" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="currentLandlordPhone">Landlord phone</label>
              <input id="currentLandlordPhone" name="currentLandlordPhone" type="tel" className="input" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="currentRent">Monthly rent</label>
              <input id="currentRent" name="currentRent" inputMode="numeric" placeholder="$" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="reasonForMoving">Reason for moving</label>
              <input id="reasonForMoving" name="reasonForMoving" className="input" />
            </div>
          </div>
        </div>

        {/* Previous #1 */}
        <details className="rounded-2xl bg-ivory">
          <summary className="cursor-pointer px-5 py-4 font-medium text-charcoal">
            + Previous address #1 (optional)
          </summary>
          <div className="space-y-5 px-5 pb-5">
            <input name="prev1Address" placeholder="Street address" className="input" />
            <div className="grid gap-5 sm:grid-cols-2">
              <input name="prev1CityStateZip" placeholder="City, state, ZIP" className="input" />
              <input name="prev1LandlordName" placeholder="Landlord name" className="input" />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="prev1MoveIn">Move-in</label>
                <input id="prev1MoveIn" name="prev1MoveIn" type="date" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="prev1MoveOut">Move-out</label>
                <input id="prev1MoveOut" name="prev1MoveOut" type="date" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="prev1Rent">Monthly rent</label>
                <input id="prev1Rent" name="prev1Rent" inputMode="numeric" placeholder="$" className="input" />
              </div>
            </div>
            <input name="prev1LandlordPhone" type="tel" placeholder="Landlord phone" className="input" />
          </div>
        </details>

        {/* Previous #2 */}
        <details className="rounded-2xl bg-ivory">
          <summary className="cursor-pointer px-5 py-4 font-medium text-charcoal">
            + Previous address #2 (optional)
          </summary>
          <div className="space-y-5 px-5 pb-5">
            <input name="prev2Address" placeholder="Street address" className="input" />
            <div className="grid gap-5 sm:grid-cols-2">
              <input name="prev2CityStateZip" placeholder="City, state, ZIP" className="input" />
              <input name="prev2LandlordName" placeholder="Landlord name" className="input" />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="prev2MoveIn">Move-in</label>
                <input id="prev2MoveIn" name="prev2MoveIn" type="date" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="prev2MoveOut">Move-out</label>
                <input id="prev2MoveOut" name="prev2MoveOut" type="date" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="prev2Rent">Monthly rent</label>
                <input id="prev2Rent" name="prev2Rent" inputMode="numeric" placeholder="$" className="input" />
              </div>
            </div>
            <input name="prev2LandlordPhone" type="tel" placeholder="Landlord phone" className="input" />
          </div>
        </details>
      </fieldset>

      {/* ─── EMPLOYMENT ───────────────────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">Employment + income</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="employer">Current employer *</label>
            <input id="employer" name="employer" required className="input" autoComplete="organization" />
          </div>
          <div>
            <label className="label" htmlFor="employerPhone">Employer phone</label>
            <input id="employerPhone" name="employerPhone" type="tel" className="input" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="grossWages">Gross monthly wages *</label>
            <input id="grossWages" name="grossWages" required inputMode="numeric" placeholder="$" className="input" />
            <p className="mt-1 text-xs text-charcoal-muted">
              Our standard: gross monthly income must be at least 3× the monthly rent.
            </p>
          </div>
          <div>
            <label className="label" htmlFor="supervisor">Manager / supervisor</label>
            <input id="supervisor" name="supervisor" className="input" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="hireDate">Hire date</label>
            <input id="hireDate" name="hireDate" type="date" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="otherIncome">Other sources of income</label>
            <input id="otherIncome" name="otherIncome" placeholder="e.g. 1099, investment, etc." className="input" />
          </div>
        </div>
      </fieldset>

      {/* ─── QUESTIONNAIRE ───────────────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">A few quick questions</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="durationOfStay">How long do you plan to live here?</label>
            <input id="durationOfStay" name="durationOfStay" placeholder="e.g. 1 year, indefinitely" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="vehicleCount">How many vehicles?</label>
            <input id="vehicleCount" name="vehicleCount" type="number" min="0" className="input" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="vehicleMake">Vehicle make</label>
            <input id="vehicleMake" name="vehicleMake" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="vehicleModel">Model</label>
            <input id="vehicleModel" name="vehicleModel" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="vehiclePlate">License plate</label>
            <input id="vehiclePlate" name="vehiclePlate" className="input" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="pets">Pets (describe — type, count, breed, weight)</label>
          <input id="pets" name="pets" placeholder="e.g. one 25 lb mixed-breed dog, 4 yrs old, well-behaved" className="input" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <p className="label">Have your pets ever bitten anyone?</p>
            <YesNo name="petsBitten" value={petsBitten} onChange={setPetsBitten} />
          </div>
          <div>
            <p className="label">Trained for attack/guard?</p>
            <YesNo name="petsTrainedAttack" value={petsTrained} onChange={setPetsTrained} />
          </div>
          <div>
            <p className="label">$400 non-refundable pet deposit OK?</p>
            <YesNo name="petsDepositOk" value={petsDepositOk} onChange={setPetsDepositOk} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="evictions">Evictions filed against you</label>
            <input id="evictions" name="evictions" type="number" min="0" placeholder="0" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="brokenLeases">Times broken a lease</label>
            <input id="brokenLeases" name="brokenLeases" type="number" min="0" placeholder="0" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="felonies">Felonies</label>
            <input id="felonies" name="felonies" type="number" min="0" placeholder="0" className="input" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <p className="label">Do you smoke?</p>
            <YesNo name="smokes" value={smokes} onChange={setSmokes} />
          </div>
          <div>
            <p className="label">Do you have a checking account?</p>
            <YesNo name="checkingAccount" value={checkingAccount} onChange={setCheckingAccount} />
          </div>
          <div>
            <p className="label">Move-in funds available now?</p>
            <YesNo name="moveInAmountReady" value={moveInReady} onChange={setMoveInReady} />
            <p className="text-[10px] text-charcoal-muted mt-1.5">1st month + security deposit + pet deposit if applicable.</p>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="rentLimitations">What would limit your ability to pay rent on time?</label>
          <input id="rentLimitations" name="rentLimitations" placeholder="e.g. nothing comes to mind, or describe" className="input" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="emergencyContactName">Emergency contact name</label>
            <input id="emergencyContactName" name="emergencyContactName" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="emergencyContactPhone">Emergency contact phone</label>
            <input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" className="input" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="whyRentToYou">Why should we rent to you?</label>
          <textarea id="whyRentToYou" name="whyRentToYou" rows={3} className="input resize-none" />
        </div>
      </fieldset>

      {/* ─── ADDITIONAL ──────────────────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">Additional information</legend>
        <textarea
          name="additionalInfo"
          rows={4}
          placeholder="Optional — anything else you want us to know (co-applicants, special circumstances, schedule a viewing, etc.)"
          className="input resize-none"
        />
      </fieldset>

      {/* ─── AGREEMENT ───────────────────────────────────────────── */}
      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl text-charcoal mb-2">Agreement</legend>
        <div className="rounded-2xl bg-ivory p-5 text-sm text-charcoal/85 leading-relaxed space-y-3">
          <p>
            By submitting, you agree that the information provided is true and complete to the
            best of your knowledge. You authorize the landlord to verify the information,
            including direct contact with your employer, current and previous landlords, and
            credit/criminal/eviction screening agencies.
          </p>
          <p>
            <strong>Screening:</strong> if we move forward with your application, you&rsquo;ll
            pay $35 directly to TransUnion for the SmartMove background and credit check.
            We&rsquo;ll email instructions after our initial review.
          </p>
          <p>
            <strong>Qualification standards:</strong> each adult occupant must submit a
            separate application; we limit occupancy to 2 per bedroom; gross monthly income
            must be at least 3× the monthly rent; you must have favorable credit history
            and good references from previous landlords.
          </p>
          <p>
            <strong>Deposit:</strong> upon approval, the security deposit must be received
            within 24 hours or the unit may be offered to the next qualified applicant.
          </p>
          <p>
            All properties are offered without regard to race, color, religion, national
            origin, sex, disability, or familial status.
          </p>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="agreed" value="yes" required className="mt-1" />
          <span className="text-sm text-charcoal">
            I have read and agree to the terms above. The information I&rsquo;ve provided is
            true and correct. *
          </span>
        </label>
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
          Submitting the form is free. Most applications reviewed within 48 hours.
        </p>
      </div>
    </form>
  );
}
