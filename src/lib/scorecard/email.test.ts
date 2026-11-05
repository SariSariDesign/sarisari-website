import { describe, it, expect, vi, afterEach } from "vitest";
import { renderScorecardEmailHtml, sendScorecardEmail } from "./email";
import type { ScorecardLead } from "./pipeline";
import { SAMPLE_REPORT as SAMPLE_SCORECARD } from "./fixtures";
import { scoreOf } from "./report";
const SCORE = scoreOf(SAMPLE_SCORECARD).score;

const lead: ScorecardLead = {
  name: "Jane Doe", company: "Acme", email: "jane@acme.com",
  stage: "Seed", url: "https://acme.com/", domain: "acme.com",
};

afterEach(() => vi.unstubAllGlobals());

describe("renderScorecardEmailHtml", () => {
  it("includes the score and all five findings", () => {
    const html = renderScorecardEmailHtml(lead, SAMPLE_SCORECARD);
    expect(html).toContain(`${SCORE}/100`);
    for (const f of SAMPLE_SCORECARD.findings) expect(html).toContain(f.title);
    expect(html).toMatch(/Preview Score/);
    expect(html).not.toMatch(/\u2014|&mdash;/);
  });

  it("shows an improvement banner only when delta > 0", () => {
    const up = renderScorecardEmailHtml(lead, SAMPLE_SCORECARD, { delta: 12 });
    expect(up).toMatch(/improved/i);
    expect(up).toContain(`from ${SCORE - 12} to ${SCORE}`);
    const down = renderScorecardEmailHtml(lead, SAMPLE_SCORECARD, { delta: -7 });
    expect(down).not.toMatch(/improved/i);
    const none = renderScorecardEmailHtml(lead, SAMPLE_SCORECARD, { delta: null });
    expect(none).not.toMatch(/improved/i);
  });
});

describe("sendScorecardEmail", () => {
  it("posts to Resend with the right from/to/subject", async () => {
    process.env.RESEND_API_KEY = "re_test";
    delete process.env.RESEND_FROM;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    await sendScorecardEmail(lead, SAMPLE_SCORECARD);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(init.body);
    expect(body.from).toBe("Sari Sari Design <scorecard@sarisari.design>");
    expect(body.to).toEqual(["jane@acme.com"]);
    expect(body.subject).toContain(`Preview: ${SCORE}/100`);
  });

  it("throws when Resend returns a non-2xx (so the pipeline logs it)", async () => {
    process.env.RESEND_API_KEY = "re_test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => "domain not verified" }));
    await expect(sendScorecardEmail(lead, SAMPLE_SCORECARD)).rejects.toThrow(/Resend send failed: 403/);
  });
});
