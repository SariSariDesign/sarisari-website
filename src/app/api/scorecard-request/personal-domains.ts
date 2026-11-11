/**
 * Free / personal email and free-hosting domains. A lead whose submitted URL is
 * on one of these is not a company we should create or touch in the CRM.
 */
export const PERSONAL_DOMAINS: ReadonlySet<string> = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "hey.com",
  "fastmail.com",
  "qq.com",
  "163.com",
]);

/**
 * True if `domain` is a personal/free domain, matched exactly or as a subdomain
 * (e.g. "mail.yahoo.com"). Case-insensitive; ignores a leading "www." and a
 * trailing dot.
 */
export function isPersonalDomain(domain: string): boolean {
  const d = domain.trim().toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  if (!d) return false;
  if (PERSONAL_DOMAINS.has(d)) return true;
  for (const p of PERSONAL_DOMAINS) {
    if (d.endsWith(`.${p}`)) return true;
  }
  return false;
}
