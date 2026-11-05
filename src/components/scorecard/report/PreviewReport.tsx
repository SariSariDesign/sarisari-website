import { REPORT_CSS } from "./LegacyScorecardReport";
import { DIMENSIONS, bandFor, computeScore, effectiveRating } from "@/lib/scorecard/rubric";
import type { PreviewReport as PreviewReportData } from "@/lib/scorecard/types";

/**
 * Hosted Activation Scorecard Preview, format v1. One renderer for every preview,
 * whichever path kicked it off. Faithful to the vault template
 * (03_Resources/skills/activation-scorecard-preview/assets/report-template.html):
 * profile grid, Preview Score with the weighted dimension breakdown, exactly five
 * finding cards with evidence, optional research, methodology, AI-builder prompt,
 * the fixed CTA, and a source-accurate disclaimer.
 *
 * The score and band are always recomputed from the ratings here, so a stored
 * report can never display a number its ratings do not support.
 */

const EXTRA_CSS = `
.research { margin: 0 0 48px; }
.rp { background: var(--grey-200); border-radius: 4px; padding: 28px 32px; margin-bottom: 16px; }
.rp-title { font-size: 17px; font-weight: 700; color: var(--grey-1000); line-height: 1.3; margin-bottom: 10px; }
.rp-stat { font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif; font-size: 26px; font-weight: 600; color: var(--blue-500); line-height: 1.2; margin-bottom: 10px; }
.rp-body { font-size: 14px; color: var(--grey-1000); line-height: 1.75; margin-bottom: 14px; }
.rp-source { font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: var(--grey-600); letter-spacing: 0.5px; border-top: 1px solid var(--grey-300); padding-top: 10px; }
@media (max-width: 640px) { .rp { padding: 24px; } }
`;

const SEVERITY = {
  critical: { className: "badge bc", label: "Critical" },
  major: { className: "badge bm", label: "Major" },
  minor: { className: "badge bn", label: "Minor" },
} as const;
const EFFORT = {
  low: { className: "tag te-low", label: "Effort: Low" },
  medium: { className: "tag te-med", label: "Effort: Medium" },
  high: { className: "tag te-high", label: "Effort: High" },
} as const;
const IMPACT = {
  high: { className: "tag ti-high", label: "Impact: High" },
  medium: { className: "tag ti-med", label: "Impact: Medium" },
  low: { className: "tag ti-low", label: "Impact: Low" },
} as const;

function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}

export function PreviewReport({ slug, report }: { slug: string; report: PreviewReportData }) {
  const score = computeScore(report.dimensions);
  const band = bandFor(score);
  const scoreArcDash = ((score / 100) * 527.79).toFixed(2);
  const domain = new URL(report.companyUrl).hostname.replace(/^www\./i, "");
  const auditDate = fmtDate(report.auditDate, { month: "long", day: "numeric", year: "numeric" });
  const auditMonthYear = fmtDate(report.auditDate, { month: "long", year: "numeric" });
  const changes = report.aiBuilderChanges.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const surface = report.source === "recording" ? "app" : "website";
  const p = report.profileFacts;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: REPORT_CSS + EXTRA_CSS }} />

      <div className="report-root" data-format={report.format} data-rubric={report.rubricVersion}>
        <div className="container">
          <header className="report-header">
            <div className="logo-lockup">
              <img src="/sarisari-logo.svg" alt="Sari Sari Design" width={148} height={33} />
            </div>
            <span className="ovl">Activation Scorecard Preview</span>
            <h1 className="report-title">{report.company}</h1>
            <p className="report-caption">
              <a href={report.companyUrl}>{domain}</a>
              {"  ·  "}
              {auditDate}
            </p>
            <div className="why-block">
              <span className="ovl">Why This Matters</span>
              <p>{report.whyThisMatters}</p>
            </div>
            <hr className="rule" />
            <div className="profile-grid">
              {(
                [
                  ["Industry", p.industry],
                  ["Stage", p.stage],
                  ["GTM Model", p.gtmModel],
                  ["Conversion Goal", p.conversionGoal],
                  ["Customer Type", p.customerType],
                  ["Competitors", "Not benchmarked in the free preview"],
                ] as const
              ).map(([label, value]) => (
                <div className="profile-item" key={label}>
                  <span className="profile-label">{label}</span>
                  <span className="profile-value">{value}</span>
                </div>
              ))}
            </div>
          </header>

          <section className="score-section">
            <div className="sec-head">
              <span className="ovl">Preview Score</span>
              <h2>How {report.company} scores today</h2>
              <p>A criterion-referenced 0 to 100 score. A preview of the full Activation Scorecard.</p>
            </div>
            <div className="score-hero">
              <div className="score-meter">
                <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label={`Preview Score: ${score} out of 100`}>
                  <circle cx="100" cy="100" r="84" fill="none" stroke="#D5D2CA" strokeWidth="12" />
                  <circle
                    cx="100" cy="100" r="84" fill="none" stroke="#1F5FA6" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${scoreArcDash} 527.79`} transform="rotate(-90 100 100)"
                  />
                  <text x="100" y="98" textAnchor="middle" fontFamily="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif" fontSize="52" fontWeight="600" fill="#292826">
                    {score}
                  </text>
                  <text x="100" y="126" textAnchor="middle" fontFamily="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif" fontSize="13" fontWeight="600" letterSpacing="1.5" fill="#8A8884">
                    OUT OF 100
                  </text>
                </svg>
              </div>
              <div className="score-copy">
                <div className="score-band-name">{band.name}</div>
                <p className="score-framing">{band.framing}</p>
                <p className="score-scope-note">{report.scopeNote}</p>
              </div>
            </div>

            <details className="score-details">
              <summary>
                <span className="fc-toggle" />
              </summary>
              <div className="score-dims">
                <p className="score-dims-intro">
                  Every in-scope dimension, rated 0 to 10 against its section of our reference checklist, then weighted.
                  Findings are evidence for the ratings, not point deductions.
                </p>
                {report.dimensions.map((d) => {
                  const r = effectiveRating(d);
                  return (
                    <div className="dim-row" key={d.code}>
                      <div className="dim-name-cell">
                        <span className="dim-name">{DIMENSIONS[d.code].name}</span>
                        <span className="dim-weight">Weight {DIMENSIONS[d.code].weight}</span>
                        {d.capped && <span className="cap-mark">Capped by Critical finding</span>}
                      </div>
                      <div className="dim-bar-track">
                        <div className={d.capped ? "dim-bar-fill capped" : "dim-bar-fill"} style={{ width: `${r * 10}%` }} />
                      </div>
                      <div className="dim-rating">{r}</div>
                      <p className="dim-note">{d.note}</p>
                    </div>
                  );
                })}
              </div>
            </details>
          </section>

          <section className="findings-section">
            <div className="findings-header">
              <span className="ovl">Findings</span>
              <h2>Top 5 Findings</h2>
              <p>
                The 5 highest-impact friction points, in the order a user hits them, grouped by page across the flow.
                Selected from a {report.totalFindings}-finding evaluation across {report.dimensions.length} UX dimensions.
                Select &ldquo;See more details&rdquo; on any finding for the evidence and fix.
              </p>
            </div>
            {report.findings.map((f, i) => {
              const showHead = i === 0 || report.findings[i - 1].page !== f.page;
              return (
                <div key={i}>
                  {showHead && <h3 className="page-head">{f.page}</h3>}
                  <details className="fc">
                    <summary>
                      <div className="fc-meta">
                        <div className="fc-num">{i + 1}</div>
                        <span className="fdim">{DIMENSIONS[f.dimension].name}</span>
                        <span className={SEVERITY[f.severity].className}>{SEVERITY[f.severity].label}</span>
                      </div>
                      <h3 className="fc-title">{f.title}</h3>
                      <p className="fc-lead">{f.observation}</p>
                      <div className="fc-why">
                        <span className="fc-why-label">Why This Finding Matters</span>
                        <p>{f.whyItMatters}</p>
                      </div>
                      <span className="fc-toggle" />
                    </summary>
                    <div className="fc-detail">
                      {f.image && (
                        <figure className="fc-evidence">
                          <a href={`/s/${slug}/evidence/${f.image.key}`} target="_blank" rel="noopener">
                            <img src={`/s/${slug}/evidence/${f.image.key}`} alt={f.image.alt} />
                          </a>
                          <figcaption>{f.image.caption} Tap the image to view it full size.</figcaption>
                        </figure>
                      )}
                      <div className="cids">
                        {f.criteria.map((c) => (
                          <span className="cid" key={c}>{c}</span>
                        ))}
                      </div>
                      <div className="fc-rec">
                        <span className="fc-rec-label">Recommendation</span>
                        <ul>
                          {f.recommendations.map((r, j) => (
                            <li key={j}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="tags-row">
                        <span className={EFFORT[f.effort].className}>{EFFORT[f.effort].label}</span>
                        <span className={IMPACT[f.impact].className}>{IMPACT[f.impact].label}</span>
                      </div>
                    </div>
                  </details>
                </div>
              );
            })}
          </section>

          {report.research.length > 0 && (
            <section className="research">
              <div className="sec-head">
                <span className="ovl">What The Research Says</span>
                <h2>Patterns that bear on this flow</h2>
                <p>
                  Documented research and case studies matched to the weakest areas of this flow: what moved the numbers
                  for comparable products.
                </p>
              </div>
              {report.research.map((r, i) => (
                <div className="rp" key={i}>
                  <h3 className="rp-title">{r.title}</h3>
                  <div className="rp-stat">{r.stat}</div>
                  <p className="rp-body">{r.body}</p>
                  <p className="rp-source">Source: {r.source}</p>
                </div>
              ))}
            </section>
          )}

          <div className="mb">
            <div className="mb-section">
              <span className="ovl">Methodology</span>
              <p>{report.methodology}</p>
            </div>
            <div className="mb-section">
              <span className="ovl">Evaluation Lens</span>
              <p>{report.evaluationLens}</p>
            </div>
          </div>

          <section className="aiprompt">
            <div className="sec-head">
              <span className="ovl">Building with AI?</span>
              <h2>Pass this to your AI builder</h2>
              <p>
                Editing your {surface} with Lovable, v0, Cursor, Claude, or a similar AI builder? Paste the prompt below to
                make a first pass at the five fixes above. It works in any of them.
              </p>
            </div>
            <div className="aiprompt-warn">
              <span className="aiprompt-warn-label">Read this first</span>
              <p>
                Read the whole prompt before you paste it, and review every change the AI proposes before you publish. AI
                builders can make mistakes and unintended edits. This is a starting point, not a hands-off fix.
              </p>
            </div>
            <details className="aiprompt-details">
              <summary>
                <span className="fc-toggle" />
              </summary>
              <div className="aiprompt-box">{`You are helping improve ${report.company}'s ${surface} (${domain}), which is built with an AI builder. Make only the specific changes listed here.

Changes to make:
${changes}

Rules you must follow:
- Do not change any existing code, styles, or the design system beyond the changes listed above.
- Keep the current brand, fonts, colors, and layout exactly as they are.
- Make only changes that can be undone, and show me a preview or diff of each one before you apply it.
- Do not publish, deploy, or push anything live. I will review and publish it myself.
- If anything is unclear, or a change would touch something not listed above, stop and ask me before doing it.`}</div>
            </details>
          </section>

          <div className="fcta">
            <span className="ovl">Ready to go deeper?</span>
            <h3>Get the full 21-Day Activation Diagnostic.</h3>
            <p>
              This preview scored what we can reach from outside. The 21-Day Activation Diagnostic scores the core flow of
              your actual product, with test-environment access, a senior-designer walkthrough, and your analytics folded
              in. You also get the screen-by-screen Annotated User Journey Map, an end-to-end prototype of the fixed flow,
              and a 90-day product roadmap.
            </p>
            <a href="https://activation-diagnostic.sarisari.design" className="cta-btn">
              Book an Intro Call
            </a>
          </div>

          <footer className="report-footer">
            <p className="disclaimer">{report.disclaimer}</p>
            <div className="brand-footer">
              <span>Sari Sari Design</span>
              {"  ·  Activation Scorecard Preview  ·  "}
              {auditMonthYear}
              {"  ·  Rubric v"}
              {report.rubricVersion}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
