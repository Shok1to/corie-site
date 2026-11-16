/**
 * Sends one email to Corie through Resend. Shared by the contact form and the
 * chat lead, so both use the same sender, recipient and failure handling.
 * Throws when the environment is incomplete or Resend rejects the message.
 */
export interface OutgoingEmail {
  subject: string;
  html: string;
  text: string;
  /** The visitor's address, when they gave one, so Corie can hit Reply. */
  replyTo?: string;
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function sendEmail(email: OutgoingEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    throw new Error('missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from.includes('<') ? from : `delcarmen.ca Website <${from}>`,
      to: to.split(',').map((a) => a.trim()).filter(Boolean),
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      subject: email.subject.replace(/[\r\n]+/g, ' '),
      html: email.html,
      text: email.text,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}
