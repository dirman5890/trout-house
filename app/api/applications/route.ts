import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { ApplicationPayload } from '@/lib/types';
import { SITE_DEFAULTS } from '@/lib/constants';

export const runtime = 'nodejs';

function isEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label: string, value: string | undefined): string {
  if (!value || !String(value).trim()) return '';
  return `<tr><td style="padding: 6px 14px 6px 0; color: #6F6862; vertical-align: top; white-space: nowrap;">${escape(label)}</td><td style="padding: 6px 0; vertical-align: top;">${escape(value)}</td></tr>`;
}

function section(title: string, rows: string[]): string {
  const filled = rows.filter(Boolean);
  if (filled.length === 0) return '';
  return `
    <h3 style="font-family: Georgia, serif; margin: 24px 0 8px; font-size: 16px;">${escape(title)}</h3>
    <table style="border-collapse: collapse; font-size: 14px;">
      ${filled.join('')}
    </table>
  `;
}

const REQUIRED: (keyof ApplicationPayload)[] = [
  'unitNumber',
  'moveInDate',
  'leaseTerm',
  'occupants',
  'firstName',
  'lastName',
  'dateOfBirth',
  'driversLicense',
  'phone',
  'email',
  'currentAddress',
  'currentCityStateZip',
  'employer',
  'grossWages',
  'agreed',
];

export async function POST(request: Request) {
  let b: ApplicationPayload;
  try {
    b = (await request.json()) as ApplicationPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  for (const field of REQUIRED) {
    if (!b[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }
  if (!isEmail(b.email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }
  if (b.agreed !== 'yes') {
    return NextResponse.json({ error: 'You must agree to the terms.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipients = (process.env.NOTIFY_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.NOTIFY_FROM || `${SITE_DEFAULTS.name} <noreply@trouthousetahoe.com>`;

  if (!apiKey || recipients.length === 0) {
    console.warn('[applications] Resend not configured. Payload was:', b);
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);

  const fullName = [b.firstName, b.middleInitial, b.lastName].filter(Boolean).join(' ');
  const subject = `New application — Unit ${b.unitNumber} (${fullName})`;

  const html = `
    <div style="font-family: -apple-system, system-ui, 'Segoe UI', sans-serif; line-height: 1.55; color: #1F1D1A; max-width: 720px;">
      <h2 style="font-family: Georgia, serif; margin: 0 0 6px;">${escape(subject)}</h2>
      <p style="color: #6F6862; margin: 0 0 22px;">Submitted via trouthousetahoe.com — reply directly to this email to respond to the applicant.</p>

      ${section('About the unit', [
        row('Unit', b.unitNumber === 'any' ? 'Any available' : `Unit ${b.unitNumber}`),
        row('Lease term', b.leaseTerm),
        row('Desired move-in', b.moveInDate),
        row('Occupants', b.occupants),
      ])}

      ${section('Personal', [
        row('Name', fullName),
        row('Date of birth', b.dateOfBirth),
        row("Driver's license", b.driversLicense),
        row('Phone', b.phone),
        row('Alt phone', b.altPhone),
        row('Email', b.email),
      ])}

      ${section('Current address', [
        row('Street', b.currentAddress),
        row('City/state/zip', b.currentCityStateZip),
        row('Move-in', b.currentMoveIn),
        row('Landlord', b.currentLandlordName),
        row('Landlord phone', b.currentLandlordPhone),
        row('Monthly rent', b.currentRent ? `$${b.currentRent}` : undefined),
        row('Reason for moving', b.reasonForMoving),
      ])}

      ${section('Previous address #1', [
        row('Street', b.prev1Address),
        row('City/state/zip', b.prev1CityStateZip),
        row('Move-in', b.prev1MoveIn),
        row('Move-out', b.prev1MoveOut),
        row('Landlord', b.prev1LandlordName),
        row('Landlord phone', b.prev1LandlordPhone),
        row('Monthly rent', b.prev1Rent ? `$${b.prev1Rent}` : undefined),
      ])}

      ${section('Previous address #2', [
        row('Street', b.prev2Address),
        row('City/state/zip', b.prev2CityStateZip),
        row('Move-in', b.prev2MoveIn),
        row('Move-out', b.prev2MoveOut),
        row('Landlord', b.prev2LandlordName),
        row('Landlord phone', b.prev2LandlordPhone),
        row('Monthly rent', b.prev2Rent ? `$${b.prev2Rent}` : undefined),
      ])}

      ${section('Employment', [
        row('Employer', b.employer),
        row('Employer phone', b.employerPhone),
        row('Gross monthly wages', b.grossWages ? `$${b.grossWages}` : undefined),
        row('Supervisor', b.supervisor),
        row('Hire date', b.hireDate),
        row('Other income', b.otherIncome),
      ])}

      ${section('Questionnaire', [
        row('How long planning to stay', b.durationOfStay),
        row('Vehicles', b.vehicleCount),
        row('Vehicle', [b.vehicleMake, b.vehicleModel, b.vehiclePlate].filter(Boolean).join(' · ')),
        row('Pets', b.pets),
        row('Pets bitten anyone', b.petsBitten),
        row('Trained for attack/guard', b.petsTrainedAttack),
        row('OK with $400 pet deposit', b.petsDepositOk),
        row('Evictions', b.evictions),
        row('Broken leases', b.brokenLeases),
        row('Felonies', b.felonies),
        row('Smokes', b.smokes),
        row('Checking account', b.checkingAccount),
        row('Move-in funds ready', b.moveInAmountReady),
        row('Rent limitations', b.rentLimitations),
        row('Emergency contact', b.emergencyContactName),
        row('Emergency phone', b.emergencyContactPhone),
        row('Why rent to them', b.whyRentToYou),
      ])}

      ${b.additionalInfo ? `
        <h3 style="font-family: Georgia, serif; margin: 24px 0 8px; font-size: 16px;">Additional info</h3>
        <p style="white-space: pre-wrap; font-size: 14px; padding: 12px; background: #F4EFE6; border-radius: 8px;">${escape(b.additionalInfo)}</p>
      ` : ''}

      <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #6F6862; font-size: 12px;">
        Next step: review, then email the TransUnion SmartMove link if proceeding ($35 paid by applicant).
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: recipients,
      replyTo: b.email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[applications] Resend error:', err);
    return NextResponse.json(
      { error: 'Could not send your application. Please email melindacohen.a@gmail.com directly.' },
      { status: 500 },
    );
  }
}
