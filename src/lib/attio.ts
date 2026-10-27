import type { ContactInput } from "./contact";

const API = "https://api.attio.com/v2";

/**
 * Writes a Say Hello submission to Attio: upserts the Person (matched on email), then
 * attaches the message as a Note on that record. Throws on any non-2xx response.
 */
export async function createAttioLead(input: ContactInput, apiKey: string, fetchImpl: typeof fetch = fetch) {
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const [first, ...rest] = input.name.split(/\s+/);

  const personRes = await fetchImpl(`${API}/objects/people/records?matching_attribute=email_addresses`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      data: {
        values: {
          email_addresses: [input.email],
          name: [{ first_name: first, last_name: rest.join(" "), full_name: input.name }],
        },
      },
    }),
  });
  if (!personRes.ok) throw new Error(`Attio person upsert failed: ${personRes.status}`);
  const recordId: string = (await personRes.json()).data.id.record_id;

  const noteRes = await fetchImpl(`${API}/notes`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: {
        parent_object: "people",
        parent_record_id: recordId,
        title: "Website: Say Hello",
        format: "plaintext",
        content: [input.company && `Company: ${input.company}`, input.message].filter(Boolean).join("\n\n"),
      },
    }),
  });
  if (!noteRes.ok) throw new Error(`Attio note failed: ${noteRes.status}`);
}
