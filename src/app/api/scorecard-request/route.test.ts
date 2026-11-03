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
