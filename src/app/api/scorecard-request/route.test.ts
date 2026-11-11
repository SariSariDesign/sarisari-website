// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const after = vi.fn();
vi.mock("next/server", async (orig) => ({ ...(await orig<typeof import("next/server")>()), after }));
vi.mock("@/lib/scorecard/pipeline", () => ({ runAnalysisAndEmail: vi.fn() }));

const { POST } = await import("./route");
const { runAnalysisAndEmail } = await import("@/lib/scorecard/pipeline");

const good = { name: "Ada Lovelace", company: "Engines", email: "ada@example.com", stage: "Seed", url: "engines.io" };
const post = (body: unknown) =>
  POST(new Request("http://localhost/api/scorecard-request", { method: "POST", body: JSON.stringify(body) }));

describe("POST /api/scorecard-request", () => {
  beforeEach(() => vi.stubEnv("ATTIO_API_KEY", ""));
  afterEach(() => {
    vi.unstubAllEnvs();
    after.mockReset();
  });

  it("drops honeypot submissions without queueing analysis", async () => {
    const res = await post({ ...good, faxNumber: "555" });
    expect(await res.json()).toEqual({ ok: true });
    expect(after).not.toHaveBeenCalled();
  });

  it("rejects missing or invalid fields", async () => {
    expect((await post({ ...good, email: "nope" })).status).toBe(400);
    expect((await post({ ...good, url: "localhost" })).status).toBe(400);
  });

  it("accepts a valid lead and queues the analysis when Attio is unset", async () => {
    const res = await post(good);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, duplicate: false });
    expect(after).toHaveBeenCalledOnce();
  });
});

/* ------------------------------ Attio capture ------------------------------ */

type Call = { method: string; path: string; body: unknown };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

/**
 * Stub global fetch with a tiny Attio router. `companyQuery` controls the
 * response to POST /objects/companies/records/query. `existingPerson` makes the
 * dedupe lookup find a person who already has a scorecard note.
 */
function mockAttio(companyQuery: () => Response, opts: { existingPerson?: boolean } = {}) {
  const calls: Call[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const path = url.pathname.replace(/^\/v2/, "") + url.search;
    const method = init?.method ?? "GET";
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    calls.push({ method, path, body });

    if (method === "POST" && path === "/objects/people/records/query")
      return json({ data: opts.existingPerson ? [{ id: { record_id: "person_1" } }] : [] });
    if (method === "GET" && path.startsWith("/notes?"))
      return json({ data: [{ title: "Free Activation Scorecard request" }] });
    if (method === "POST" && path === "/objects/companies/records/query") return companyQuery();
    if (method === "POST" && path === "/objects/companies/records")
      return json({ data: { id: { record_id: "co_new" } } });
    if (method === "PUT" && path.startsWith("/objects/people/records"))
      return json({ data: { id: { record_id: "person_1" } } });
    if (method === "POST" && path === "/notes") return json({ data: {} });
    return json({ error: "unexpected" }, 404);
  });
  vi.stubGlobal("fetch", fetchMock);
  return calls;
}

const companyWrites = (calls: Call[]) =>
  calls.filter(
    (c) => c.path.startsWith("/objects/companies/records") && !c.path.startsWith("/objects/companies/records/query"),
  );
const personUpsert = (calls: Call[]) =>
  calls.filter((c) => c.method === "PUT" && c.path.startsWith("/objects/people/records"));
const notes = (calls: Call[]) => calls.filter((c) => c.method === "POST" && c.path === "/notes");

function expectNoCompanyPut(calls: Call[]) {
  expect(calls.filter((c) => c.method === "PUT" && c.path.startsWith("/objects/companies/records"))).toEqual([]);
}

function expectPersonAndNote(calls: Call[]) {
  const people = personUpsert(calls);
  expect(people).toHaveLength(1);
  expect(people[0].path).toBe("/objects/people/records?matching_attribute=email_addresses");
  const values = (people[0].body as { data: { values: Record<string, unknown> } }).data.values;
  expect(Object.keys(values).sort()).toEqual(["email_addresses", "name"]);
  expect(values).not.toHaveProperty("company");
  expect(notes(calls)).toHaveLength(1);
}

describe("POST /api/scorecard-request → Attio company handling", () => {
  beforeEach(() => {
    vi.stubEnv("ATTIO_API_KEY", "test-key");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    after.mockReset();
  });

  it("does not write to an existing company found by email domain (no rename)", async () => {
    const calls = mockAttio(() => json({ data: [{ id: { record_id: "co_existing" } }] }));
    const res = await post({ ...good, company: "test1" });

    expect(res.status).toBe(200);
    const query = calls.find((c) => c.path === "/objects/companies/records/query");
    expect(query?.method).toBe("POST");
    expect(query?.body).toEqual({ filter: { domains: "example.com" }, limit: 1 });
    expect(companyWrites(calls)).toEqual([]);
    expect(calls.some((c) => c.method === "PATCH")).toBe(false);
    expectNoCompanyPut(calls);
    expectPersonAndNote(calls);
  });

  it("creates the company exactly once when none exists for the domain", async () => {
    const calls = mockAttio(() => json({ data: [] }));
    const res = await post(good);

    expect(res.status).toBe(200);
    const writes = companyWrites(calls);
    expect(writes).toHaveLength(1);
    expect(writes[0].method).toBe("POST");
    expect(writes[0].path).toBe("/objects/companies/records");
    expect(writes[0].body).toEqual({ data: { values: { name: "Engines", domains: ["example.com"] } } });
    expectNoCompanyPut(calls);
    expectPersonAndNote(calls);
  });

  it("identifies the company by the work email domain, never the submitted URL", async () => {
    const calls = mockAttio(() => json({ data: [] }));
    const res = await post({ ...good, email: "jane@Acme.io", url: "https://client.com" });

    expect(res.status).toBe(200);
    const query = calls.find((c) => c.path === "/objects/companies/records/query");
    expect(query?.body).toEqual({ filter: { domains: "acme.io" }, limit: 1 });
    const writes = companyWrites(calls);
    expect(writes).toHaveLength(1);
    expect(writes[0].body).toEqual({ data: { values: { name: "Engines", domains: ["acme.io"] } } });
    expect(JSON.stringify(calls.filter((c) => c.path.startsWith("/objects/companies")))).not.toContain(
      "client.com",
    );
    // The submitted URL still flows to the note (and analysis) unchanged.
    expect(JSON.stringify(notes(calls)[0].body)).toContain("URL submitted: https://client.com/");
    (after.mock.calls[0][0] as () => void)();
    expect(runAnalysisAndEmail).toHaveBeenLastCalledWith(
      expect.objectContaining({ url: "https://client.com/", domain: "client.com" }),
    );
  });

  it("makes no companies request for a personal email, even with a company URL", async () => {
    const calls = mockAttio(() => json({ data: [] }));
    const res = await post({ ...good, email: "jane@gmail.com", url: "https://acme.io" });

    expect(res.status).toBe(200);
    expect(calls.filter((c) => c.path.startsWith("/objects/companies"))).toEqual([]);
    expectPersonAndNote(calls);
    // The submitted URL still flows to the note and analysis unchanged.
    expect(JSON.stringify(notes(calls)[0].body)).toContain("URL submitted: https://acme.io/");
    (after.mock.calls[0][0] as () => void)();
    expect(runAnalysisAndEmail).toHaveBeenLastCalledWith(
      expect.objectContaining({ url: "https://acme.io/", domain: "acme.io" }),
    );
  });

  it("leaves an existing personal-email contact's company link untouched on resubmit", async () => {
    // Jane (gmail) already exists in Attio, linked to a company, and already has
    // a scorecard note. Every request the route makes is asserted below.
    const calls = mockAttio(() => json({ data: [] }), { existingPerson: true });
    const res = await post({ ...good, email: "jane@gmail.com", url: "https://acme.io" });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, duplicate: true });
    expect(calls.map((c) => `${c.method} ${c.path}`)).toEqual([
      "POST /objects/people/records/query",
      "GET /notes?parent_object=people&parent_record_id=person_1&limit=50",
      "PUT /objects/people/records?matching_attribute=email_addresses",
    ]);
    expect(calls.some((c) => c.path.startsWith("/objects/companies"))).toBe(false);
    expect(calls.some((c) => c.method === "PATCH")).toBe(false);
    const people = personUpsert(calls);
    expect(people).toHaveLength(1);
    const values = (people[0].body as { data: { values: Record<string, unknown> } }).data.values;
    expect(Object.keys(values).sort()).toEqual(["email_addresses", "name"]);
    expect(values).not.toHaveProperty("company");
  });

  it("skips the company write when the lookup fails, and still captures the lead", async () => {
    const calls = mockAttio(() => json({ error: "boom" }, 500));
    const res = await post(good);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, duplicate: false });
    expect(companyWrites(calls)).toEqual([]);
    expectNoCompanyPut(calls);
    expectPersonAndNote(calls);
    expect(after).toHaveBeenCalledOnce();
  });

  it.each(["jane@gmail.com", "jane@mail.yahoo.com", "Jane@Outlook.COM"])(
    "makes no companies request for personal email %s",
    async (email) => {
      const calls = mockAttio(() => json({ data: [] }));
      const res = await post({ ...good, email });

      expect(res.status).toBe(200);
      expect(calls.filter((c) => c.path.startsWith("/objects/companies"))).toEqual([]);
      expectPersonAndNote(calls);
    },
  );
});
