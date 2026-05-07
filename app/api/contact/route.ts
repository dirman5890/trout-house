import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { ContactFormPayload } from '@/lib/types';
import { SITE_DEFAULTS } from '@/lib/constants';

export const runtime = 'nodejs';

function isEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  let body: ContactFormPayload;
  try {
    body = (await request.json()) as ContactFormPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!body.name || !isEmail(body.email)) {
    return NextResponse.json({ error: 'Name and a valid email are required.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipients = (process.env.NOTIFY_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.NOTIFY_FROM || `${SITE_DEFAULTS.name} <noreply@trouthousetahoe.com>`;

  if (!apiKey || recipients.length === 0) {
    console.warn('[contact] Resend not configured. Payload was:', body);
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);

  const subject = body.unitNumber
    ? `New inquiry — Unit ${body.unitNumber}`
    : `New inquiry — ${SITE_DEFAULTS.name}`;

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.55; color: #1F1D1A;">
      <h2 style="font-family: Georgia, serif; margin: 0 0 16px;">${escape(subject)}</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0; color: #6F6862;">Name</td><td>${escape(body.name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #6F6862;">Email</td><td><a href="mailto:${escape(body.email)}">${escape(body.email)}</a></td></tr>
        ${body.phone ? `<tr><td style="padding: 4px 12px 4px 0; color: #6F6862;">Phone</td><td>${escape(body.phone)}</td></tr>` : ''}
        ${body.unitNumber ? `<tr><td style="padding: 4px 12px 4px 0; color: #6F6862;">Unit</td><td>${escape(body.unitNumber)}</td></tr>` : ''}
        ${body.moveInDate ? `<tr><td style="padding: 4px 12px 4px 0; color: #6F6862;">Move-in</td><td>${escape(body.moveInDate)}</td></tr>` : ''}
        ${body.leaseTerm ? `<tr><td style="padding: 4px 12px 4px 0; color: #6F6862;">Lease term</td><td>${escape(body.leaseTerm)}</td></tr>` : ''}
      </table>
      ${body.message ? `<div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee;"><strong>Message</strong><p style="white-space: pre-wrap;">${escape(body.message)}</p></div>` : ''}
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
    console.error('[contact] Resend error:', err);
    return NextResponse.json({ error: 'Could not send your message. Please email us directly.' }, { status: 500 });
  }
}
