import { describe, expect, it } from "vitest";
import { caseStudyTemplate } from "./_template";
import { caseStudies, publishedCaseStudies } from "./index";

describe("case study registry", () => {
  it("lists the sitemap's studies in order", () => {
    expect(caseStudies.map((c) => c.slug)).toEqual([
      "kenchan-ramen",
      "funding-solutions",
      "lendzi",
      "disco",
      "nutrisnap",
    ]);
  });

  it("never registers the template", () => {
    expect(caseStudies).not.toContain(caseStudyTemplate);
    expect(caseStudies.map((c) => c.slug)).not.toContain(caseStudyTemplate.slug);
  });

  it("gives every published study a page", () => {
    for (const c of publishedCaseStudies) expect(c.page, c.slug).toBeDefined();
  });

  it("has unique slugs", () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
