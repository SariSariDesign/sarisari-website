import type { EvidenceStore, NewScorecard, ScorecardStore, StoredScorecard } from "./store";

/**
 * Test double for ScorecardStore. Deterministic ordering: rows carry an
 * incrementing counter so `latestForUrl` doesn't depend on wall-clock time.
 */
export function createInMemoryStore(
  seed: StoredScorecard[] = [],
): ScorecardStore & { rows: StoredScorecard[] } {
  const rows: StoredScorecard[] = [...seed];
  let seq = rows.length;

  return {
    rows,
    async latestForUrl(url) {
      const matches = rows.filter((r) => r.url === url);
      return matches.length ? matches[matches.length - 1] : null;
    },
    async hasRowForUrlEmail(url, email) {
      return rows.some((r) => r.url === url && r.email === email);
    },
    async insert(row: NewScorecard) {
      const n = ++seq;
      const saved: StoredScorecard = {
        ...row,
        id: `mem-${n}`,
        slug: `mem-slug-${n}`,
        createdAt: new Date(2026, 0, 1, 0, 0, n).toISOString(),
      };
      rows.push(saved);
      return saved;
    },
    async getBySlug(slug) {
      return rows.find((r) => r.slug === slug) ?? null;
    },
    async update(slug, patch) {
      const i = rows.findIndex((r) => r.slug === slug);
      if (i === -1) throw new Error(`[scorecard-store] update: no row for ${slug}`);
      rows[i] = { ...rows[i], ...patch };
      return rows[i];
    },
    async listSince(since) {
      return rows.filter((r) => r.createdAt >= since).reverse();
    },
  };
}

export function createInMemoryEvidence(): EvidenceStore & { files: Map<string, { bytes: Uint8Array; contentType: string }> } {
  const files = new Map<string, { bytes: Uint8Array; contentType: string }>();
  return {
    files,
    async put(slug, key, bytes, contentType) {
      files.set(`${slug}/${key}`, { bytes, contentType });
    },
    async get(slug, key) {
      return files.get(`${slug}/${key}`) ?? null;
    },
  };
}
