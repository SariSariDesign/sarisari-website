// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const after = vi.fn();
vi.mock("next/server", async (orig) => ({ ...(await orig<typeof import("next/server")>()), after }));
vi.mock("@/lib/scorecard/pipeline", () => ({ runAnalysisAndEmail: vi.fn() }));

const { POST } = await import("./route");

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
 * response to POST /objects/companies/records/query.
 */
function mockAttio(companyQuery: () => Response) {
  const calls: Call[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const path = url.pathname.replace(/^\/v2/, "") + url.search;
    const method = init?.method ?? "GET";
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    calls.push({ method, path, body });

    if (method === "POST" && path === "/objects/people/records/query") return json({ data: [] });
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

  it("does not write to an existing company found by domain (no rename)", async () => {
    const calls = mockAttio(() => json({ data: [{ id: { record_id: "co_existing" } }] }));
    const res = await post({ ...good, company: "test1" });

    expect(res.status).toBe(200);
    const query = calls.find((c) => c.path === "/objects/companies/records/query");
    expect(query?.method).toBe("POST");
    expect(query?.body).toEqual({ filter: { domains: "engines.io" }, limit: 1 });
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
    expect(writes[0].body).toEqual({ data: { values: { name: "Engines", domains: ["engines.io"] } } });
    expectNoCompanyPut(calls);
    expectPersonAndNote(calls);
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

  it.each(["gmail.com", "https://mail.yahoo.com", "WWW.Outlook.COM"])(
    "makes no companies request for personal domain %s",
    async (url) => {
      const calls = mockAttio(() => json({ data: [] }));
      const res = await post({ ...good, url });

      expect(res.status).toBe(200);
      expect(calls.filter((c) => c.path.startsWith("/objects/companies"))).toEqual([]);
      expectPersonAndNote(calls);
    },
  );
});
