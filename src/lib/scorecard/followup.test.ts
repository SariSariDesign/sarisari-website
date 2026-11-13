// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { FOLLOW_UP_TITLES, flagScorecardFollowUp } from "./followup";

const lead = { name: "Jo", company: "Acme", email: "jo@acme.com", stage: "Seed", url: "https://acme.com/", domain: "acme.com" };
const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe("flagScorecardFollowUp", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("adds a follow-up note on the person found by email", async () => {
    vi.stubEnv("ATTIO_API_KEY", "k");
    const f = vi.fn()
      .mockResolvedValueOnce(ok({ data: [{ id: { record_id: "p1" } }] }))
      .mockResolvedValueOnce(ok({ data: {} }));
    await flagScorecardFollowUp(lead, "unreadable", ["Reason: 403"], f as unknown as typeof fetch);
    const note = JSON.parse(f.mock.calls[1][1].body).data;
    expect(note).toMatchObject({ parent_record_id: "p1", title: FOLLOW_UP_TITLES.unreadable });
    expect(note.content).toContain("Reason: 403");
    expect(note.title).not.toBe("Free Activation Scorecard request");
  });

  it("uses the person id from the submit route when given (no lookup)", async () => {
    vi.stubEnv("ATTIO_API_KEY", "k");
    const f = vi.fn().mockResolvedValue(ok({ data: {} }));
    await flagScorecardFollowUp({ ...lead, attioPersonId: "p9" }, "badEmail", ["x"], f as unknown as typeof fetch);
    expect(f).toHaveBeenCalledOnce();
    expect(JSON.parse(f.mock.calls[0][1].body).data.parent_record_id).toBe("p9");
  });

  it("never throws when Attio fails", async () => {
    vi.stubEnv("ATTIO_API_KEY", "k");
    const f = vi.fn().mockRejectedValue(new Error("down"));
    await expect(flagScorecardFollowUp(lead, "fewFindings", [], f as unknown as typeof fetch)).resolves.toBeUndefined();
  });
});
