// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInMemoryStore } from "@/lib/scorecard/store.memory";

const getStore = vi.fn();
vi.mock("@/lib/scorecard/store.supabase", () => ({ getStore }));

const { GET, dynamic } = await import("./route");

// Stand-in for a real database error: it names a host and a key-like value,
// neither of which may ever reach the response.
const INTERNAL_ERROR = "[scorecard-store] ping: connect to db.internal-host.example failed (key=sb_secret_do_not_leak)";

describe("GET /api/cron/supabase-keepalive", () => {
  afterEach(() => {
    getStore.mockReset();
    vi.restoreAllMocks();
  });

  it("is never cached or prerendered", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("returns only ok:true when the read works", async () => {
    const store = createInMemoryStore();
    const ping = vi.spyOn(store, "ping");
    getStore.mockReturnValue(store);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(ping).toHaveBeenCalledTimes(1);
    expect(ping).toHaveBeenCalledWith();
  });

  it("never writes to the store", async () => {
    const store = createInMemoryStore();
    const insert = vi.spyOn(store, "insert");
    const update = vi.spyOn(store, "update");
    getStore.mockReturnValue(store);

    await GET();

    expect(insert).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(store.rows).toEqual([]);
  });

  it("returns a non-200 generic error when the read fails, with no internals", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    getStore.mockReturnValue({ ...createInMemoryStore(), ping: () => Promise.reject(new Error(INTERNAL_ERROR)) });

    const res = await GET();
    const text = await res.text();

    expect(res.status).toBe(503);
    expect(JSON.parse(text)).toEqual({ ok: false, error: "keepalive_failed" });
    expect(text).not.toContain("internal-host");
    expect(text).not.toContain("sb_secret");
    expect(text).not.toContain("scorecard-store");
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(log).toHaveBeenCalledTimes(1);
  });

  it("returns the same generic error when the store is not configured", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getStore.mockImplementation(() => {
      throw new Error("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) / SUPABASE_SERVICE_ROLE_KEY are not set");
    });

    const res = await GET();
    const text = await res.text();

    expect(res.status).toBe(503);
    expect(JSON.parse(text)).toEqual({ ok: false, error: "keepalive_failed" });
    expect(text).not.toContain("SUPABASE");
  });
});
