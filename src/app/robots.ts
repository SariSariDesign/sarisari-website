import type { MetadataRoute } from "next";

/** Generated at /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/s/", "/thank-you/"] },
    sitemap: "https://www.sarisari.design/sitemap.xml",
  };
}
