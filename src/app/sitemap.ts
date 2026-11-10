import type { MetadataRoute } from "next";
import { publishedCaseStudies } from "@/content/case-studies";

const BASE = "https://www.sarisari.design";

/** Generated at /sitemap.xml. Thank-you pages, scorecard share links (/s/*) and the ads squeeze page stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/services",
    "/services/retainers",
    "/services/activation-diagnostic",
    "/work",
    "/scorecard-preview",
    "/contact",
    "/privacy",
    "/terms",
  ];
  const work = publishedCaseStudies.map((c) => `/work/${c.slug}`);
  return [...pages, ...work].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    priority: path === "" ? 1 : 0.7,
  }));
}
