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
  if (!value) return '';
  return `<tr><td style="padding: 6px 14px 6px 0; color: #6F6862; vertical-align: top; white-space: nowrap;">${escape(label)}</td><td style="padding: 6px 0;">${escape(value)}</td></tr>`;
}

const REQUIRED: (keyof ApplicationPayload)[] = [
  'name',
  'email',
  'phone',
  'employer',
  'monthlyIncome',
  'unitNumber',
  'leaseTerm',
  'moveInDate',
];

export async function POST(request: Request) {
  let body: ApplicationPayload;
  try {
    body = (await request.json()) as ApplicationPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  for (const field of REQUIRED) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }
  if (!isEmail(body.email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipients = (process.env.NOTIFY_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.NOTIFY_FROM || `${SITE_DEFAULTS.name} <noreply@trouthousetahoe.com>`;

  if (!apiKey || recipients.length === 0) {
    console.warn('[applications] Resend not configured. Payload was:', body);
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);

  const subject = `New application — Unit ${body.unitNumber} (${body.name})`;
  const petLine = body.pets === 'yes'
    ? body.petsDescription || 'Yes (no description provided)'
    : 'No pets';

  const html = `
    <div style="font-family: -apple-system, system-ui, 'Segoe UI', sans-serif; line-height: 1.55; color: #1F1D1A; max-width: 640px;">
      <h2 style="font-family: Georgia, serif; margin: 0 0 6px;">${escape(subject)}</h2>
      <p style="color: #6F6862; margin: 0 0 22px;">Submitted via trouthousetahoe.com</p>

      <h3 style="font-family: Georgia, serif; margin: 22px 0 8px; font-size: 16px;">Applicant</h3>
      <table style="border-collapse: collapse; font-size: 14px;">
        ${row('Name', body.name)}
        ${row('Email', body.email)}
        ${row('Phone', body.phone)}
        ${row('Current city', body.currentCity)}
        ${row('Current address', body.currentAddress)}
      </table>

      <h3 style="font-family: Georgia, serif; margin: 22px 0 8px; font-size: 16px;">Employment</h3>
      <table style="border-collapse: collapse; font-size: 14px;">
        ${row('Employer', body.employer)}
        ${row('Job title', body.jobTitle)}
        ${row('Monthly income', body.monthlyIncome ? `$${body.monthlyIncome}` : undefined)}
      </table>

      <h3 style="font-family: Georgia, serif; margin: 22px 0 8px; font-size: 16px;">What they want</h3>
      <table style="border-collapse: collapse; font-size: 14px;">
        ${row('Unit', body.unitNumber === 'any' ? 'Any available' : `Unit ${body.unitNumber}`)}
        ${row('Lease term', body.leaseTerm)}
        ${row('Move-in', body.moveInDate)}
        ${row('Pets', petLine)}
      </table>

      ${body.previousLandlord || body.professionalReference ? `
        <h3 style="font-family: Georgia, serif; margin: 22px 0 8px; font-size: 16px;">References</h3>
        <table style="border-collapse: collapse; font-size: 14px;">
          ${row('Previous landlord', body.previousLandlord)}
          ${row('Landlord phone', body.previousLandlordPhone)}
          ${row('Professional ref', body.professionalReference)}
          ${row('Reference phone', body.professionalReferencePhone)}
        </table>
      ` : ''}

      ${body.message ? `
        <h3 style="font-family: Georgia, serif; margin: 22px 0 8px; font-size: 16px;">Notes</h3>
        <p style="white-space: pre-wrap; font-size: 14px; padding: 12px; background: #F4EFE6; border-radius: 8px;">${escape(body.message)}</p>
      ` : ''}

      <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #6F6862; font-size: 12px;">
        Reply to this email to respond to the applicant directly.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: recipients,
      replyTo: body.email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[applications] Resend error:', err);
    return NextResponse.json(
      { error: 'Could not send your application. Please email trouthousellc@gmail.com directly.' },
      { status: 500 },
    );
  }
}
