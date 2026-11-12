import { describe, expect, it } from "vitest";
import { PERSONAL_DOMAINS, companyDomainFor, isPersonalDomain } from "./personal-domains";

describe("companyDomainFor", () => {
  it("returns the lowercased work email domain", () => {
    expect(companyDomainFor("jane@acme.io")).toBe("acme.io");
    expect(companyDomainFor("Jane@ACME.IO")).toBe("acme.io");
    expect(companyDomainFor("jane@eu.acme.io")).toBe("eu.acme.io");
  });

  it("returns null for a personal email domain (no URL fallback)", () => {
    expect(companyDomainFor("jane@gmail.com")).toBeNull();
    expect(companyDomainFor("jane@GMAIL.COM")).toBeNull();
    expect(companyDomainFor("jane@mail.yahoo.com")).toBeNull();
    expect(companyDomainFor("jane@icloud.com")).toBeNull();
  });

  it("returns null when the email has no domain", () => {
    expect(companyDomainFor("jane")).toBeNull();
    expect(companyDomainFor("jane@")).toBeNull();
    expect(companyDomainFor("")).toBeNull();
  });
});

describe("isPersonalDomain", () => {
  it("covers the required free-email domains", () => {
    for (const d of [
      "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com", "msn.com",
      "yahoo.com", "ymail.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me",
      "protonmail.com", "pm.me", "gmx.com", "gmx.net", "mail.com", "zoho.com", "yandex.com",
      "hey.com", "fastmail.com", "qq.com", "163.com",
    ]) {
      expect(PERSONAL_DOMAINS.has(d)).toBe(true);
      expect(isPersonalDomain(d)).toBe(true);
    }
  });

  it("matches subdomains and is case-insensitive", () => {
    expect(isPersonalDomain("mail.yahoo.com")).toBe(true);
    expect(isPersonalDomain("Mail.Yahoo.COM")).toBe(true);
    expect(isPersonalDomain("GMAIL.COM")).toBe(true);
    expect(isPersonalDomain("www.gmail.com")).toBe(true);
  });

  it("does not match company domains that merely contain a personal domain", () => {
    expect(isPersonalDomain("engines.io")).toBe(false);
    expect(isPersonalDomain("sarisari.design")).toBe(false);
    expect(isPersonalDomain("notgmail.com")).toBe(false);
    expect(isPersonalDomain("gmail.com.evil.io")).toBe(false);
    expect(isPersonalDomain("hotmail.co")).toBe(false);
    expect(isPersonalDomain("")).toBe(false);
  });
});
