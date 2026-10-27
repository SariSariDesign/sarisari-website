import { createAttioLead } from "@/lib/attio";
import { parseContact } from "@/lib/contact";

/** Say Hello form → Attio. Generic errors only; details go to the server log. */
export async function POST(req: Request) {
  const parsed = parseContact(await req.json().catch(() => null));
  if (parsed.ok === "spam") return Response.json({ ok: true });
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const apiKey = process.env.ATTIO_API_KEY;
  if (!apiKey) {
    console.error("contact: ATTIO_API_KEY is not set");
    return Response.json({ error: "Something went wrong. Email us instead." }, { status: 500 });
  }
  try {
    await createAttioLead(parsed.data, apiKey);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("contact:", err);
    return Response.json({ error: "Something went wrong. Email us instead." }, { status: 500 });
  }
}
