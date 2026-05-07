import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { SubscribePayload } from '@/lib/types';
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
  let body: SubscribePayload;
  try {
    body = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
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
    console.warn('[subscribe] Resend not configured. Payload was:', body);
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);

  // TODO: replace with audiences.contacts.create({ audienceId: '...', email })
  try {
    await resend.emails.send({
      from,
      to: recipients,
      subject: `New email subscriber — ${SITE_DEFAULTS.name}`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif;">
          <p><strong>${escape(body.email)}</strong> joined the list${body.zip ? ` (ZIP ${escape(body.zip)})` : ''}.</p>
        </div>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscribe] Resend error:', err);
    return NextResponse.json({ error: 'Could not subscribe right now. Please try again.' }, { status: 500 });
  }
}
