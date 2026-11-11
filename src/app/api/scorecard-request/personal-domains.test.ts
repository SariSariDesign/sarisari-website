import { describe, expect, it } from "vitest";
import { PERSONAL_DOMAINS, companyDomainFor, isPersonalDomain } from "./personal-domains";

describe("companyDomainFor", () => {
  it("uses the work email domain, ignoring the URL", () => {
    expect(companyDomainFor("jane@acme.io", "client.com")).toBe("acme.io");
    expect(companyDomainFor("Jane@ACME.IO", "client.com")).toBe("acme.io");
    expect(companyDomainFor("jane@acme.io", "gmail.com")).toBe("acme.io");
  });

  it("falls back to the URL domain when the email is personal", () => {
    expect(companyDomainFor("jane@gmail.com", "acme.io")).toBe("acme.io");
    expect(companyDomainFor("jane@mail.yahoo.com", "Acme.IO")).toBe("acme.io");
  });

  it("returns null when both the email and URL domains are personal", () => {
    expect(companyDomainFor("jane@gmail.com", "gmail.com")).toBeNull();
    expect(companyDomainFor("jane@icloud.com", "mail.yahoo.com")).toBeNull();
  });

  it("falls back to the URL when the email has no usable domain", () => {
    expect(companyDomainFor("jane", "acme.io")).toBe("acme.io");
    expect(companyDomainFor("", "")).toBeNull();
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
