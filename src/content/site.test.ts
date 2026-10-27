import { describe, expect, it } from "vitest";
import { BOOKING_URL, nav } from "./site";

describe("nav", () => {
  it("follows the sitemap order", () => {
    expect(nav.links.map((l) => [l.label, l.href])).toEqual([
      ["Home", "/"],
      ["Work", "/work"],
      ["Services", "/services"],
      ["Process", "/#process"],
      ["About", "/#about"],
    ]);
    expect(nav.cta.href).toBe(BOOKING_URL);
  });
});
