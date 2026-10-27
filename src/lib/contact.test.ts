import { describe, expect, it } from "vitest";
import { parseContact } from "./contact";

const good = { name: "Ada Lovelace", email: "ada@example.com", company: "Engines", message: "Hi there" };

describe("parseContact", () => {
  it("accepts a valid submission and trims fields", () => {
    expect(parseContact({ ...good, name: "  Ada Lovelace " })).toEqual({ ok: true, data: good });
  });
  it("allows an empty company", () => {
    expect(parseContact({ ...good, company: "" })).toEqual({ ok: true, data: { ...good, company: "" } });
  });
  it("rejects a bad email", () => {
    expect(parseContact({ ...good, email: "nope" })).toEqual({ ok: false, error: "Enter a valid email." });
  });
  it("rejects a missing name or message", () => {
    expect(parseContact({ ...good, name: "" }).ok).toBe(false);
    expect(parseContact({ ...good, message: " " }).ok).toBe(false);
  });
  it("flags the honeypot as spam", () => {
    expect(parseContact({ ...good, website: "http://spam" })).toEqual({ ok: "spam" });
  });
  it("rejects non-objects", () => {
    expect(parseContact(null).ok).toBe(false);
  });
});
