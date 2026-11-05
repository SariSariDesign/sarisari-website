// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

const createOperatorRun = vi.fn();
vi.mock("@/lib/scorecard/pipeline", () => ({ createOperatorRun }));
vi.mock("@/lib/scorecard/store.supabase", () => ({ getEvidenceStore: () => ({ put: vi.fn() }), getStore: vi.fn() }));

const { POST } = await import("./route");
const TOKEN = "t".repeat(40);

const post = (body: unknown, auth?: string) =>
  POST(
    new Request("http://localhost/api/scorecard-operator/runs", {
      method: "POST",
      headers: auth ? { authorization: auth } : {},
      body: JSON.stringify(body),
    }),
  );

const body = {
  by: "dwight",
  lead: { name: "Jo", company: "Acme", email: "jo@acme.example", stage: "Seed", url: "https://acme.example/" },
  draft: { findings: [{ image: { key: "consent.png" } }] },
  images: [] as unknown[],
};

describe("POST /api/scorecard-operator/runs", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    createOperatorRun.mockReset();
  });

  it("is disabled when no operator token is configured", async () => {
    vi.stubEnv("SCORECARD_OPERATOR_TOKEN", "");
    expect((await post(body, `Bearer ${TOKEN}`)).status).toBe(401);
  });

  it("rejects a wrong token", async () => {
    vi.stubEnv("SCORECARD_OPERATOR_TOKEN", TOKEN);
    expect((await post(body, "Bearer nope")).status).toBe(401);
    expect(createOperatorRun).not.toHaveBeenCalled();
  });

  it("rejects a run whose referenced evidence image is missing", async () => {
    vi.stubEnv("SCORECARD_OPERATOR_TOKEN", TOKEN);
    const res = await post(body, `Bearer ${TOKEN}`);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ missing: ["consent.png"] });
  });

  it("requires every image to be marked redaction-reviewed", async () => {
    vi.stubEnv("SCORECARD_OPERATOR_TOKEN", TOKEN);
    const res = await post(
      { ...body, images: [{ key: "consent.png", contentType: "image/png", base64: "AA==", redactionReviewed: false }] },
      `Bearer ${TOKEN}`,
    );
    expect(res.status).toBe(400);
    expect(createOperatorRun).not.toHaveBeenCalled();
  });
});
