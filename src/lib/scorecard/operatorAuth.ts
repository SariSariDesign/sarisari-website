import { timingSafeEqual } from "node:crypto";

/**
 * Bearer-token guard for operator endpoints (/api/scorecard-operator/*).
 * SCORECARD_OPERATOR_TOKEN lives only in the www Vercel env and the operator's
 * protected environment. Missing config disables the endpoints entirely.
 */
export function operatorAuthorized(req: Request): boolean {
  const expected = process.env.SCORECARD_OPERATOR_TOKEN;
  if (!expected || expected.length < 32) return false;
  const header = req.headers.get("authorization") ?? "";
  const got = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
