// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const good = { name: "Ada Lovelace", email: "ada@example.com", company: "Engines", message: "Hi" };
const post = (body: unknown) =>
  POST(new Request("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body) }));

describe("POST /api/contact", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("ATTIO_API_KEY", "test-key");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock
      .mockResolvedValueOnce(Response.json({ data: { id: { record_id: "rec_1" } } }))
      .mockResolvedValueOnce(Response.json({ data: {} }));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    fetchMock.mockReset();
  });

  it("upserts the person by email, then attaches the message as a note", async () => {
    const res = await post(good);
    expect(res.status).toBe(200);

    const [personUrl, personInit] = fetchMock.mock.calls[0];
    expect(personUrl).toBe("https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses");
    expect(personInit.method).toBe("PUT");
    expect(personInit.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(personInit.body).data.values.email_addresses).toEqual(["ada@example.com"]);

    const [noteUrl, noteInit] = fetchMock.mock.calls[1];
    expect(noteUrl).toBe("https://api.attio.com/v2/notes");
    const note = JSON.parse(noteInit.body).data;
    expect(note).toMatchObject({ parent_object: "people", parent_record_id: "rec_1", format: "plaintext" });
    expect(note.content).toContain("Hi");
    expect(note.content).toContain("Engines");
  });

  it("returns 400 without calling Attio on invalid input", async () => {
    const res = await post({ ...good, email: "bad" });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pretends success for honeypot submissions", async () => {
    const res = await post({ ...good, website: "x" });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 500 when the key is missing", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("ATTIO_API_KEY", "");
    const res = await post(good);
    expect(res.status).toBe(500);
    expect(spy).toHaveBeenCalled();
  });

  it("returns 500 when Attio fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockReset().mockResolvedValueOnce(new Response("nope", { status: 401 }));
    const res = await post(good);
    expect(res.status).toBe(500);
    expect(spy).toHaveBeenCalled();
  });
});
