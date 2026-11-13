import { describe, it, expect, vi, afterEach } from "vitest";
import { renderScorecardEmailHtml, renderUnreadableEmailHtml, sendScorecardEmail, sendUnreadableEmail } from "./email";
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

  it("says five findings and no follow-up note when all five are present", () => {
    const html = renderScorecardEmailHtml(lead, SAMPLE_SCORECARD);
    expect(html).toContain("five findings that matter most");
    expect(html).not.toMatch(/What happens next/);
  });

  it("with fewer findings: states the real count and the human follow-up", () => {
    const two = { ...SAMPLE_SCORECARD, findings: SAMPLE_SCORECARD.findings.slice(0, 2), aiBuilderChanges: SAMPLE_SCORECARD.aiBuilderChanges.slice(0, 2) };
    const html = renderScorecardEmailHtml(lead, two);
    expect(html).toContain("found two issues");
    expect(html).toMatch(/meets most best practices/);
    expect(html).toMatch(/What happens next/);
    expect(html).not.toContain("five findings");
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

describe("unreadable email", () => {
  it("explains, sets next steps, invites a reply, and has no report link", () => {
    const html = renderUnreadableEmailHtml(lead);
    expect(html).toMatch(/couldn&#39;t read|couldn't read/);
    expect(html).toContain("https://acme.com/");
    expect(html).toMatch(/What happens next/);
    expect(html).toMatch(/Reply to this email/);
    expect(html).not.toMatch(/\/s\//);
    expect(html).not.toMatch(/\u2014|&mdash;/);
  });

  it("sends with reply-to the team inbox", async () => {
    vi.stubEnv("RESEND_API_KEY", "k");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "u1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await sendUnreadableEmail(lead, "admin@sarisari.design");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({ to: ["jane@acme.com"], reply_to: "admin@sarisari.design" });
    expect(body.subject).toMatch(/couldn't read your page/);
    vi.unstubAllEnvs();
  });
});
