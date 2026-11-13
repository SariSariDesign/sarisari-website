// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { bandFor, computeScore, RUBRIC_VERSION } from "./rubric";
import { RUBRIC_SOURCE_VERSION } from "./rubric-anchors.generated";
import { finalizeReport } from "./report";
import { SAMPLE_DRAFT } from "./fixtures";
import { buildDraftFromGenerator, type GeneratorOutput } from "./analyze";
import { approveAndSend, createOperatorRun, reviseOperatorRun, runAnalysisAndEmail } from "./pipeline";
import { createInMemoryStore } from "./store.memory";

const lead = { name: "Jo Prospect", company: "Acme Health", email: "jo@acme-health.example", stage: "Seed", url: "https://acme-health.example/", domain: "acme-health.example" };
const sendOk = () => vi.fn().mockResolvedValue({ id: "em_1" });

describe("rubric scoring", () => {
  it("pins the generated anchors to the same rubric version", () => {
    expect(RUBRIC_SOURCE_VERSION).toBe(RUBRIC_VERSION);
  });

  it("reproduces Bearable's recorded 54 (rubric v1.0 video profile, 479/88)", () => {
    const dims = (
      [["ONB", 4], ["FORM", 5], ["N", 6], ["MOB", 7], ["IXD", 6], ["CRO", 5], ["COPY", 6], ["VD", 6], ["IA", 5]] as const
    ).map(([code, rating]) => ({ code, rating, capped: false }));
    expect(computeScore(dims)).toBe(54);
    expect(bandFor(54).name).toBe("Friction-Heavy, but Fixable");
  });

  it("applies the Critical cap at 4", () => {
    expect(computeScore([{ code: "ONB", rating: 9, capped: true }])).toBe(40);
  });

  it("maps band boundaries", () => {
    expect(bandFor(80).name).toBe("Activation-Ready");
    expect(bandFor(79).name).toBe("Solid Foundation");
    expect(bandFor(40).name).toBe("Friction-Heavy, but Fixable");
    expect(bandFor(39).name).toBe("Blockers, but Fixable");
  });
});

describe("finalizeReport (shared by both kickoff paths)", () => {
  it("allows one to five findings, with one AI-builder change each", () => {
    expect(() =>
      finalizeReport({ ...SAMPLE_DRAFT, findings: SAMPLE_DRAFT.findings.slice(0, 2), aiBuilderChanges: SAMPLE_DRAFT.aiBuilderChanges.slice(0, 2) }),
    ).not.toThrow();
    expect(() => finalizeReport({ ...SAMPLE_DRAFT, findings: SAMPLE_DRAFT.findings.slice(0, 4) })).toThrow();
    expect(() => finalizeReport({ ...SAMPLE_DRAFT, findings: [], aiBuilderChanges: [] })).toThrow();
    expect(() =>
      finalizeReport({ ...SAMPLE_DRAFT, findings: [...SAMPLE_DRAFT.findings, SAMPLE_DRAFT.findings[0]] }),
    ).toThrow();
  });

  it("rejects dimensions outside the profile (no ACC, PERF or QA from video)", () => {
    const bad = { ...SAMPLE_DRAFT, dimensions: [...SAMPLE_DRAFT.dimensions, { code: "ACC" as const, rating: 5, capped: false, note: "x" }] };
    expect(() => finalizeReport(bad)).toThrow(/not rated in the video profile/);
  });

  it("rejects em and en dashes in client copy", () => {
    expect(() => finalizeReport({ ...SAMPLE_DRAFT, whyThisMatters: "Fast \u2014 and clear." })).toThrow(/dashes/);
  });

  it("requires the cap on a dimension with a Critical finding", () => {
    const f = [...SAMPLE_DRAFT.findings];
    f[0] = { ...f[0], severity: "critical" };
    expect(() => finalizeReport({ ...SAMPLE_DRAFT, findings: f })).toThrow(/requires the dimension cap/);
  });

  it("refuses a draft scored on a different rubric version", () => {
    expect(() => finalizeReport({ ...SAMPLE_DRAFT, rubricVersion: "0.2-DRAFT" })).toThrow(/Re-score/);
  });

  it("sorts dimensions heaviest weight first and pins the version", () => {
    const { report } = finalizeReport(SAMPLE_DRAFT);
    expect(report.dimensions.map((d) => d.code)).toEqual(["ONB", "FORM", "CRO", "IA"]);
    expect(report.rubricVersion).toBe(RUBRIC_VERSION);
  });
});

function gen(n: number): GeneratorOutput {
  return {
    profileFacts: { industry: "Health", stage: "Seed", gtmModel: "B2C", conversionGoal: "Signup", customerType: "Adults" },
    whyThisMatters: "Why \u2014 it matters.",
    evaluationLens: "Lens.",
    dimensions: [
      { code: "CRO", rating: 6, capped: false, note: "CRO note" },
      { code: "COPY", rating: 5, capped: false, note: "COPY note" },
      { code: "N", rating: 6, capped: false, note: "N note" },
    ],
    candidates: Array.from({ length: 7 }, (_, i) => ({
      page: "Home",
      dimension: i % 2 ? ("COPY" as const) : ("CRO" as const),
      severity: "major" as const,
      title: `Finding ${i}`,
      observation: "Obs.",
      whyItMatters: "Why.",
      criteria: ["CRO-02", "bogus"],
      recommendations: ["Do it."],
      effort: "low" as const,
      impact: "high" as const,
      aiBuilderChange: "Change it.",
      supported: i < n,
    })),
  };
}

describe("self-serve generator: never pad", () => {
  it("returns no report when nothing is supported", () => {
    expect(buildDraftFromGenerator(gen(0), lead).ok).toBe(false);
  });

  it("reports only the supported findings when fewer than five, never padding", () => {
    const r = buildDraftFromGenerator(gen(3), lead);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const { report } = finalizeReport(r.draft);
    expect(report.findings).toHaveLength(3);
    expect(report.aiBuilderChanges).toHaveLength(3);
    expect(report.totalFindings).toBe(3);
  });

  it("builds a valid five-finding preview from supported candidates only", () => {
    const r = buildDraftFromGenerator(gen(6), lead);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const { report } = finalizeReport(r.draft);
    expect(report.findings).toHaveLength(5);
    expect(report.totalFindings).toBe(6);
    expect(report.whyThisMatters).not.toMatch(/\u2014/);
    expect(report.findings[0].criteria).toEqual(["CRO-02"]);
  });

  it("with no findings: stores failed, sends the unreadable email, flags a follow-up", async () => {
    const store = createInMemoryStore();
    const send = sendOk();
    const sendUnreadable = sendOk();
    const flag = vi.fn().mockResolvedValue(undefined);
    const analyze = vi.fn().mockResolvedValue(buildDraftFromGenerator(gen(0), lead));
    expect(await runAnalysisAndEmail(lead, { store, analyze, send, sendUnreadable, flag })).toBeNull();
    expect(send).not.toHaveBeenCalled();
    expect(sendUnreadable).toHaveBeenCalledOnce();
    expect(flag).toHaveBeenCalledWith(lead, "unreadable", expect.any(Array));
    expect(store.rows[0]).toMatchObject({ status: "failed", kickoff: "self_serve" });
  });

  it("when the page can't be read: sends the unreadable email and flags a follow-up", async () => {
    const store = createInMemoryStore();
    const sendUnreadable = sendOk();
    const flag = vi.fn().mockResolvedValue(undefined);
    const analyze = vi.fn().mockRejectedValue(new Error("FireCrawl scrape failed: 403"));
    expect(await runAnalysisAndEmail(lead, { store, analyze, send: sendOk(), sendUnreadable, flag })).toBeNull();
    expect(sendUnreadable).toHaveBeenCalledOnce();
    expect(flag.mock.calls[0][1]).toBe("unreadable");
    expect(flag.mock.calls[0][2].join("\n")).toContain("403");
  });

  it("with 1 to 4 findings: sends that scorecard and flags a follow-up", async () => {
    const store = createInMemoryStore();
    const send = sendOk();
    const flag = vi.fn().mockResolvedValue(undefined);
    const analyze = vi.fn().mockResolvedValue(buildDraftFromGenerator(gen(2), lead));
    const row = await runAnalysisAndEmail(lead, { store, analyze, send, sendUnreadable: sendOk(), flag });
    expect(send).toHaveBeenCalledOnce();
    expect(row).toMatchObject({ status: "sent" });
    expect(flag).toHaveBeenCalledWith(lead, "fewFindings", expect.any(Array));
  });

  it("flags a follow-up when the report exists but the email fails", async () => {
    const store = createInMemoryStore();
    const flag = vi.fn().mockResolvedValue(undefined);
    const send = vi.fn().mockRejectedValue(new Error("Resend send failed: 500"));
    const analyze = vi.fn().mockResolvedValue(buildDraftFromGenerator(gen(6), lead));
    expect(await runAnalysisAndEmail(lead, { store, analyze, send, sendUnreadable: sendOk(), flag })).toBeNull();
    expect(flag.mock.calls[0][1]).toBe("sendFailed");
    expect(store.rows[0].status).toBe("failed");
  });

  it("sends a supported run to the requester and records it, no follow-up", async () => {
    const store = createInMemoryStore();
    const send = sendOk();
    const flag = vi.fn().mockResolvedValue(undefined);
    const analyze = vi.fn().mockResolvedValue(buildDraftFromGenerator(gen(6), lead));
    const row = await runAnalysisAndEmail(lead, { store, analyze, send, flag });
    expect(flag).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][2].to).toBeUndefined(); // requester's own address
    expect(row).toMatchObject({ status: "sent", kickoff: "self_serve", rubricVersion: RUBRIC_VERSION });
  });
});

describe("operator kickoff: same pipeline, approval-gated", () => {
  it("holds the run, emails only the review copy to admin", async () => {
    const store = createInMemoryStore();
    const send = sendOk();
    const { row } = await createOperatorRun({ lead, draft: SAMPLE_DRAFT, internal: { rating: "record" }, by: "dwight" }, { store, send });
    expect(row).toMatchObject({ status: "pending_approval", kickoff: "operator" });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][2].to).toBe("admin@sarisari.design");
    expect(send.mock.calls[0][2].subjectPrefix).toContain("REVIEW");
  });

  it("logs founder revisions as review events", async () => {
    const store = createInMemoryStore();
    const { row } = await createOperatorRun({ lead, draft: SAMPLE_DRAFT, internal: {}, by: "dwight" }, { store, send: sendOk() });
    const f = [...SAMPLE_DRAFT.findings];
    f[2] = { ...f[2], title: "The triggers step has no Skip" };
    const revised = await reviseOperatorRun(
      row.slug,
      { draft: { ...SAMPLE_DRAFT, findings: f }, by: "zach", reason: "tighter title", changes: ["finding 3 title"] },
      { store },
    );
    expect(revised.reviewEvents.at(-1)).toMatchObject({ action: "revised", by: "zach", changes: ["finding 3 title"] });
  });

  it("sends the identical email to the prospect only on approval, once", async () => {
    const store = createInMemoryStore();
    const send = sendOk();
    const { row } = await createOperatorRun({ lead, draft: SAMPLE_DRAFT, internal: {}, by: "dwight" }, { store, send });
    const { row: sent } = await approveAndSend(row.slug, { approvedBy: "zach" }, { store, send });
    expect(sent.status).toBe("sent");
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][2].to).toBeUndefined(); // prospect's address from the lead
    expect(send.mock.calls[1][1]).toEqual(send.mock.calls[0][1]); // same report body
    await expect(approveAndSend(row.slug, { approvedBy: "zach" }, { store, send })).rejects.toThrow(/refusing/);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("refuses to approve a self-serve run or without an approver", async () => {
    const store = createInMemoryStore();
    const { row } = await createOperatorRun({ lead, draft: SAMPLE_DRAFT, internal: {}, by: "dwight" }, { store, send: sendOk() });
    await expect(approveAndSend(row.slug, { approvedBy: " " }, { store, send: sendOk() })).rejects.toThrow(/approvedBy/);
  });

  it("does not let the self-serve cache serve an unapproved operator run", async () => {
    const store = createInMemoryStore();
    await createOperatorRun({ lead, draft: SAMPLE_DRAFT, internal: {}, by: "dwight" }, { store, send: sendOk() });
    const analyze = vi.fn().mockResolvedValue(buildDraftFromGenerator(gen(6), lead));
    await runAnalysisAndEmail({ ...lead, email: "someone@else.example" }, { store, analyze, send: sendOk() });
    expect(analyze).toHaveBeenCalledOnce();
  });
});
