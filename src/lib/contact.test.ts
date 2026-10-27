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
  it.each([
    ["name", 200, "Name is too long."],
    ["company", 200, "Company is too long."],
  ])("caps %s at %i chars", (field, max, error) => {
    expect(parseContact({ ...good, [field]: "a".repeat(max) }).ok).toBe(true);
    expect(parseContact({ ...good, [field]: "a".repeat(max + 1) })).toEqual({ ok: false, error });
  });
  it("caps email at 254 chars", () => {
    const email = (n: number) => `${"a".repeat(n - "@example.com".length)}@example.com`;
    expect(parseContact({ ...good, email: email(254) }).ok).toBe(true);
    expect(parseContact({ ...good, email: email(255) })).toEqual({ ok: false, error: "Email is too long." });
  });
  it("rejects over-length messages", () => {
    expect(parseContact({ ...good, message: "a".repeat(5001) })).toEqual({ ok: false, error: "Message is too long." });
  });
  it("rejects non-objects", () => {
    expect(parseContact(null).ok).toBe(false);
  });
});
