import { MAX_LEAD_CONTACT_CHARS, MAX_LEAD_NAME_CHARS } from '@/lib/chat-config';
import { escapeHtml, sendEmail } from '@/lib/send-email';

/**
 * The details a visitor gives before the chat starts. The widget checks them
 * as a courtesy; this module's server-side check is the real boundary.
 */
export type LeadField = 'name' | 'contact' | 'consent';

export interface NormalisedLead {
  name: string;
  /** Empty when the visitor gave a phone number instead. */
  email: string;
  /** Empty when the visitor gave an email address instead. */
  phone: string;
}

export type LeadValidation =
  | { ok: true; lead: NormalisedLead }
  | { ok: false; field: LeadField; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 15;

const str = (value: unknown, max: number) =>
  typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : '';

/** Permissive about shape; the digit count is the only real test. */
function looksLikePhone(value: string): boolean {
  if (!/^[+(\d][\d\s().+\-x]*$/i.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS;
}

export function validateLead(input: unknown): LeadValidation {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, field: 'name', error: 'Please fill in your details.' };
  }
  const raw = input as Record<string, unknown>;
  const name = str(raw.name, MAX_LEAD_NAME_CHARS);
  const contact = str(raw.contact, MAX_LEAD_CONTACT_CHARS);

  if (!name) return { ok: false, field: 'name', error: 'Please enter your name.' };
  if (!contact) {
    return { ok: false, field: 'contact', error: 'Please enter an email address or phone number.' };
  }
  const isEmail = EMAIL_RE.test(contact);
  const isPhone = !isEmail && looksLikePhone(contact);
  if (!isEmail && !isPhone) {
    return {
      ok: false,
      field: 'contact',
      error: 'That does not look like an email address or a phone number.',
    };
  }
  // Consent is the basis for contacting them, so only a literal true counts.
  if (raw.consent !== true) {
    return { ok: false, field: 'consent', error: 'Please agree to be contacted so we can reply.' };
  }
  return { ok: true, lead: { name, email: isEmail ? contact : '', phone: isPhone ? contact : '' } };
}

/**
 * The consent wording, recorded in the email. The widget's checkbox label in
 * site/index.html must say the same thing.
 */
export const CONSENT_STATEMENT =
  'I agree that Corie Anne del Carmen may contact me about this enquiry.';

/**
 * Emails the lead with the visitor's first question. Returns rather than
 * throws: a delivery failure must not cost the visitor their answer.
 */
export async function deliverLead(
  lead: NormalisedLead,
  question: string,
  at: Date,
): Promise<{ ok: boolean }> {
  const contact = lead.email || lead.phone;
  try {
    await sendEmail({
      subject: `New website chat enquiry from ${lead.name}`,
      replyTo: lead.email || undefined,
      html: `
        <h2>New enquiry from the website chat assistant</h2>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
        <p><strong>First question:</strong></p>
        <p>${escapeHtml(question).replace(/\n/g, '<br>')}</p>
        <p style="color:#666;font-size:12px">${escapeHtml(CONSENT_STATEMENT)} (agreed ${at.toISOString()})</p>`,
      text: `Name: ${lead.name}\nContact: ${contact}\n\nFirst question:\n${question}\n\n${CONSENT_STATEMENT} (agreed ${at.toISOString()})`,
    });
    return { ok: true };
  } catch (error) {
    console.error('[chat] lead delivery failed', error instanceof Error ? error.message : error);
    return { ok: false };
  }
}
