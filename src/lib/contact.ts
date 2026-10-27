export type ContactInput = { name: string; email: string; company: string; message: string };

type Parsed = { ok: true; data: ContactInput } | { ok: false; error: string } | { ok: "spam" };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validates the Say Hello form. `website` is a hidden honeypot: bots fill it, people don't. */
export function parseContact(body: unknown): Parsed {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid submission." };
  const b = body as Record<string, unknown>;
  if (str(b.website)) return { ok: "spam" };
  const data = { name: str(b.name), email: str(b.email), company: str(b.company), message: str(b.message) };
  if (!data.name) return { ok: false, error: "Enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, error: "Enter a valid email." };
  if (!data.message) return { ok: false, error: "Add a message." };
  if (data.message.length > 5000) return { ok: false, error: "Message is too long." };
  return { ok: true, data };
}
