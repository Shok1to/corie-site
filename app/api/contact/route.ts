// Receives the consultation form and emails it to Corie through Resend.
// Needs RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL in the environment.
import { escapeHtml, sendEmail } from "@/lib/send-email";

export const runtime = "nodejs";

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const focus = clean(body.focus, 200);
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 4000) : "";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Please enter your name and a valid email." }, { status: 400 });
  }

  const html = `
    <h2>New discovery consultation request</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Focus:</strong> ${escapeHtml(focus || "Not specified")}</p>
    <p><strong>Goals / questions:</strong></p>
    <p>${escapeHtml(notes || "—").replace(/\n/g, "<br>")}</p>`;

  try {
    await sendEmail({
      subject: `New consultation request from ${name}`,
      replyTo: email,
      html,
      text: `Name: ${name}\nEmail: ${email}\nFocus: ${focus}\n\n${notes}`,
    });
  } catch (error) {
    console.error("Contact form: send failed:", error instanceof Error ? error.message : error);
    return Response.json({ ok: false, error: "Could not send your request. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
