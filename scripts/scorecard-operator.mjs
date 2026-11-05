#!/usr/bin/env node
// Operator client for the Activation Scorecard Preview (operator kickoff path).
// Talks to the same www pipeline as the public form. Requires SCORECARD_OPERATOR_TOKEN
// (never printed) and optionally SCORECARD_BASE_URL (default https://www.sarisari.design).
//
//   create  <payload.json> --name N --email E --stage S --by WHO
//           payload: { draft, internal, images: [{ key, file }] } (images must be
//           redacted, element-cropped evidence; the flag below is the operator's attestation)
//           --redaction-reviewed is required.
//   get     <slug>
//   revise  <slug> <payload.json> --by WHO --reason "..." --change "..." [--change ...]
//   approve <slug> --approved-by zach   (ONLY after Zach approves this report and recipient)
//   list    [--since YYYY-MM-DD]        (calibration export, both kickoff paths)
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const base = (process.env.SCORECARD_BASE_URL || "https://www.sarisari.design").replace(/\/+$/, "");
const token = process.env.SCORECARD_OPERATOR_TOKEN;
if (!token) { console.error(JSON.stringify({ status: "error", error: "SCORECARD_OPERATOR_TOKEN is not set" })); process.exit(2); }

const [cmd, ...rest] = process.argv.slice(2);
const flags = {}; const pos = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith("--")) {
    const k = rest[i].slice(2); const v = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : true;
    if (k === "change") (flags.change ??= []).push(v); else flags[k] = v;
  } else pos.push(rest[i]);
}
const types = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

async function call(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  console.log(JSON.stringify({ httpStatus: res.status, ...json }, null, 2));
  process.exit(res.ok ? 0 : 1);
}

if (cmd === "create") {
  if (flags["redaction-reviewed"] !== true) { console.error("refusing: pass --redaction-reviewed after checking every image"); process.exit(2); }
  const p = JSON.parse(readFileSync(pos[0], "utf8"));
  const d = p.draft;
  await call("POST", "/api/scorecard-operator/runs", {
    by: flags.by,
    lead: { name: flags.name, company: d.company, email: flags.email, stage: flags.stage, url: d.companyUrl },
    draft: d,
    internal: p.internal ?? {},
    images: (p.images ?? []).map((i) => ({
      key: i.key, contentType: types[extname(i.file).toLowerCase()],
      base64: readFileSync(i.file).toString("base64"), redactionReviewed: true,
    })),
  });
} else if (cmd === "get") {
  await call("GET", `/api/scorecard-operator/runs/${pos[0]}`);
} else if (cmd === "revise") {
  const p = JSON.parse(readFileSync(pos[1], "utf8"));
  await call("PATCH", `/api/scorecard-operator/runs/${pos[0]}`, { by: flags.by, reason: flags.reason, changes: flags.change ?? [], draft: p.draft, internal: p.internal });
} else if (cmd === "approve") {
  await call("POST", `/api/scorecard-operator/runs/${pos[0]}/approve`, { approvedBy: flags["approved-by"], confirmSlug: pos[0], note: flags.note });
} else if (cmd === "list") {
  await call("GET", `/api/scorecard-operator/runs?since=${encodeURIComponent(flags.since ?? "1970-01-01")}`);
} else {
  console.error("usage: scorecard-operator.mjs create|get|revise|approve|list ..."); process.exit(2);
}
