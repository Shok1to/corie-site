// Receives the consultation form and emails it to Corie through Resend.
// Needs RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL in the environment.
export const runtime = "nodejs";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact form: missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL");
    return Response.json({ ok: false, error: "Email is not configured." }, { status: 500 });
  }

  const html = `
    <h2>New discovery consultation request</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Focus:</strong> ${escapeHtml(focus || "Not specified")}</p>
    <p><strong>Goals / questions:</strong></p>
    <p>${escapeHtml(notes || "—").replace(/\n/g, "<br>")}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: from.includes("<") ? from : `delcarmen.ca Website <${from}>`,
      to: [to],
      reply_to: email,
      subject: `New consultation request from ${name}`,
      html,
      text: `Name: ${name}\nEmail: ${email}\nFocus: ${focus}\n\n${notes}`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return Response.json({ ok: false, error: "Could not send your request. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
