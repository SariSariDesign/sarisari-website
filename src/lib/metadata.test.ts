import { describe, expect, it } from "vitest";
import { openGraphBase, pageMetadata } from "./metadata";

describe("pageMetadata", () => {
  const m = pageMetadata({ title: "Services", description: "What we do.", path: "/services" });

  it("sets the page's own title, description and canonical", () => {
    expect(m.title).toBe("Services");
    expect(m.description).toBe("What we do.");
    expect(m.alternates).toEqual({ canonical: "/services" });
  });

  it("overrides Open Graph and Twitter so pages don't unfurl as the homepage", () => {
    expect(m.openGraph).toMatchObject({ title: "Services", description: "What we do.", url: "/services" });
    expect(m.twitter).toMatchObject({ title: "Services", description: "What we do." });
  });

  it("references the generated link-preview image, which Next only auto-attaches at the root", () => {
    expect(m.openGraph).toMatchObject({ images: [{ url: "/opengraph-image" }] });
    expect(m.twitter).toMatchObject({ images: [{ url: "/opengraph-image" }] });
  });

  it("keeps the shared Open Graph base (siteName, type) since Next replaces the object", () => {
    expect(m.openGraph).toMatchObject({ siteName: openGraphBase.siteName, type: "website" });
  });
});
