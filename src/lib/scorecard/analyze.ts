import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { DIMENSIONS, PROFILES, RUBRIC_VERSION } from "./rubric";
import { RUBRIC_ANCHORS } from "./rubric-anchors.generated";
import { RATINGS, SEVERITIES } from "./types";
import { fixedCopy, type ReportDraft } from "./report";

/**
 * Automated generator for the self-serve kickoff path. Scrapes the submitted URL
 * with FireCrawl, then has Claude rate the URL sub-profile dimensions against the
 * Activation Scoring Rubric's anchors (rubric-anchors.generated.ts, synced from
 * the vault) and propose candidate findings. The score is computed from the
 * ratings by report.ts, never by the model.
 *
 * Evidence rule (shared with the operator skill): never pad. When fewer than five
 * candidates are supported by the captured evidence, the result is marked
 * insufficient and the pipeline holds it for operator review instead of sending.
 */

const FIRECRAWL_SCRAPE = "https://api.firecrawl.dev/v1/scrape";
const MODEL = process.env.SCORECARD_MODEL ?? "claude-sonnet-5";
const URL_CODES = PROFILES.url;

type PageCapture = { markdown: string; screenshotUrl: string | null };

async function scrape(url: string): Promise<PageCapture> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) throw new Error("FIRECRAWL_API_KEY is not set");
  const res = await fetch(FIRECRAWL_SCRAPE, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    // Viewport screenshot: a full-page capture of a long page exceeds the image
    // limit and becomes unreadable once downscaled. Markdown covers the rest.
    body: JSON.stringify({ url, formats: ["markdown", "screenshot"], onlyMainContent: false }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`FireCrawl scrape failed: ${res.status} ${detail}`);
  }
  const json = (await res.json()) as { data?: { markdown?: string; screenshot?: string } };
  return { markdown: json.data?.markdown ?? "", screenshotUrl: json.data?.screenshot ?? null };
}

const dimList = URL_CODES.map((c) => `- ${c}: ${DIMENSIONS[c].name}`).join("\n");

export const SYSTEM_PROMPT = `You score the Sari Sari Design Activation Scorecard Preview for a submitted website, using the Activation Scoring Rubric v${RUBRIC_VERSION} URL sub-profile.

Rate each dimension you can observe from 0 to 10 against the anchors below. Dimensions in scope:
${dimList}

Rules for ratings:
- Rate only dimensions the evidence supports. Omit a dimension you cannot observe (for example FORM when no form is reachable, ONB beyond what is reachable before signup). Never guess.
- ACC is automated-observation only (alt text, labels, obvious contrast in the capture). PERF is perceived weight only; rate it conservatively or omit it.
- Each rating has a one-line note citing checklist criterion IDs (for example CRO-02, COPY-05) and the concrete element observed.
- Findings are evidence for ratings, never point deductions. Set capped=true on a dimension only when a finding in it is Critical (blocks or severely deters users).

Rules for findings:
- Propose up to 8 candidate findings, each tied to a specific visible element, with criterion IDs, an observation, a business consequence, and one to three recommendations.
- Set supported=false on any candidate that depends on something you could not see. Do not invent weaker findings to reach a count. If fewer than five are well supported, say so honestly; a human will review.
- Bound absence claims to what was captured. Distinguish observed friction from inferred business impact.
- Copy is shown to a prospective client: direct, warm, specific, no hedging, no first person, and never use em dashes or en dashes.
- aiBuilderChange: one plain-language instruction per finding for a non-technical founder using an AI website builder. No jargon, no criterion IDs.

Business context fields describe the company from what the page shows. whyThisMatters is three sentences tied to the conversion goal.

ANCHORS (verbatim from the rubric):
${RUBRIC_ANCHORS}`;

const candidateSchema = z.object({
  page: z.string(),
  dimension: z.enum(URL_CODES),
  severity: z.enum(SEVERITIES),
  title: z.string(),
  observation: z.string(),
  whyItMatters: z.string(),
  criteria: z.array(z.string()),
  recommendations: z.array(z.string()),
  effort: z.enum(RATINGS),
  impact: z.enum(RATINGS),
  aiBuilderChange: z.string(),
  supported: z.boolean(),
});

export const generatorOutputSchema = z.object({
  profileFacts: z.object({
    industry: z.string(),
    stage: z.string(),
    gtmModel: z.string(),
    conversionGoal: z.string(),
    customerType: z.string(),
  }),
  whyThisMatters: z.string(),
  evaluationLens: z.string(),
  dimensions: z.array(
    z.object({ code: z.enum(URL_CODES), rating: z.number().int(), capped: z.boolean(), note: z.string() }),
  ),
  candidates: z.array(candidateSchema),
});
export type GeneratorOutput = z.infer<typeof generatorOutputSchema>;

const str = { type: "string" } as const;
const JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["profileFacts", "whyThisMatters", "evaluationLens", "dimensions", "candidates"],
  properties: {
    profileFacts: {
      type: "object",
      additionalProperties: false,
      required: ["industry", "stage", "gtmModel", "conversionGoal", "customerType"],
      properties: { industry: str, stage: str, gtmModel: str, conversionGoal: str, customerType: str },
    },
    whyThisMatters: str,
    evaluationLens: str,
    dimensions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["code", "rating", "capped", "note"],
        properties: {
          code: { type: "string", enum: [...URL_CODES] },
          rating: { type: "integer" },
          capped: { type: "boolean" },
          note: str,
        },
      },
    },
    candidates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "page", "dimension", "severity", "title", "observation", "whyItMatters", "criteria",
          "recommendations", "effort", "impact", "aiBuilderChange", "supported",
        ],
        properties: {
          page: str,
          dimension: { type: "string", enum: [...URL_CODES] },
          severity: { type: "string", enum: [...SEVERITIES] },
          title: str,
          observation: str,
          whyItMatters: str,
          criteria: { type: "array", items: str },
          recommendations: { type: "array", items: str },
          effort: { type: "string", enum: [...RATINGS] },
          impact: { type: "string", enum: [...RATINGS] },
          aiBuilderChange: str,
          supported: { type: "boolean" },
        },
      },
    },
  },
} as const;

/** Replace dashes the model may still emit; the schema rejects them in client copy. */
const undash = (s: string) => s.replace(/\s*[\u2013\u2014]\s*/g, ", ");

export type GeneratedPreview =
  | { ok: true; draft: ReportDraft; internal: Record<string, unknown> }
  | { ok: false; reason: string; internal: Record<string, unknown> };

/**
 * Turn raw generator output into a preview draft, or an insufficient-evidence
 * result. Pure, so it is unit-tested without the API.
 */
export function buildDraftFromGenerator(
  out: GeneratorOutput,
  lead: { company: string; url: string },
  today = new Date().toISOString().slice(0, 10),
): GeneratedPreview {
  const supported = out.candidates.filter((c) => c.supported);
  const internal = {
    generator: { model: MODEL, rubricVersion: RUBRIC_VERSION },
    candidates: out.candidates,
    ratings: out.dimensions,
  };
  const dims = out.dimensions
    .filter((d, i, a) => a.findIndex((x) => x.code === d.code) === i)
    .map((d) => ({ ...d, rating: Math.max(0, Math.min(10, d.rating)), note: undash(d.note) }));
  if (supported.length < 5) {
    return { ok: false, reason: `Only ${supported.length} findings cleared the evidence threshold.`, internal };
  }
  // Pick five by business relevance (impact, then severity); keep page order of the picks.
  const rank = (c: (typeof supported)[number]) =>
    ({ high: 0, medium: 1, low: 2 })[c.impact] * 3 + ({ critical: 0, major: 1, minor: 2 })[c.severity];
  const picked = new Set([...supported].sort((a, b) => rank(a) - rank(b)).slice(0, 5));
  const five = supported.filter((c) => picked.has(c));
  const rated = new Set(dims.map((d) => d.code));
  if (five.some((f) => !rated.has(f.dimension))) {
    return { ok: false, reason: "A selected finding cites a dimension that was not rated.", internal };
  }
  for (const f of five) {
    const d = dims.find((x) => x.code === f.dimension);
    if (f.severity === "critical" && d) d.capped = true;
  }
  const copy = fixedCopy("url", lead.company, dims.length);
  const draft: ReportDraft = {
    source: "url",
    profile: "url",
    company: lead.company,
    companyUrl: lead.url,
    auditDate: today,
    profileFacts: {
      industry: undash(out.profileFacts.industry),
      stage: undash(out.profileFacts.stage),
      gtmModel: undash(out.profileFacts.gtmModel),
      conversionGoal: undash(out.profileFacts.conversionGoal),
      customerType: undash(out.profileFacts.customerType),
    },
    whyThisMatters: undash(out.whyThisMatters),
    evaluationLens: undash(out.evaluationLens),
    ...copy,
    dimensions: dims,
    totalFindings: supported.length,
    findings: five.map((c) => {
      const criteria = c.criteria.filter((x) => /^[A-Z]{1,4}-\d{2}$/.test(x)).slice(0, 4);
      return {
        page: undash(c.page),
        dimension: c.dimension,
        severity: c.severity,
        title: undash(c.title),
        observation: undash(c.observation),
        whyItMatters: undash(c.whyItMatters),
        criteria: criteria.length ? criteria : [`${c.dimension}-01`],
        recommendations: c.recommendations.slice(0, 3).map(undash),
        effort: c.effort,
        impact: c.impact,
        image: null,
      };
    }),
    research: [],
    aiBuilderChanges: five.map((c) => undash(c.aiBuilderChange)),
  };
  return { ok: true, draft, internal };
}

export async function analyzeUrl(lead: { company: string; url: string }): Promise<GeneratedPreview> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");
  const { markdown, screenshotUrl } = await scrape(lead.url);
  const client = new Anthropic();
  const content: Anthropic.ContentBlockParam[] = [];
  if (screenshotUrl) content.push({ type: "image", source: { type: "url", url: screenshotUrl } });
  content.push({
    type: "text",
    text: `Company: ${lead.company}\nEvaluate this page: ${lead.url}\n\nCaptured page content (markdown):\n\n${markdown.slice(0, 60_000)}`,
  });

  // Adaptive thinking shares max_tokens with the output; stream to avoid SDK timeouts.
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 48_000,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium", format: { type: "json_schema", schema: JSON_SCHEMA } },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  } as unknown as Anthropic.MessageStreamParams);
  const response = await stream.finalMessage();
  if (response.stop_reason === "max_tokens") console.warn("[scorecard] hit max_tokens; output may be truncated");
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("Claude returned no text output for the scorecard");
  return buildDraftFromGenerator(generatorOutputSchema.parse(JSON.parse(textBlock.text)), lead);
}
