// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { reportBaseUrl } from "./pipeline";

describe("reportBaseUrl", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("defaults to the www domain", () => {
    vi.stubEnv("SCORECARD_PUBLIC_BASE_URL", undefined as unknown as string);
    expect(reportBaseUrl()).toBe("https://www.sarisari.design");
  });
  it("falls back to the www default when the env var is an empty string", () => {
    vi.stubEnv("SCORECARD_PUBLIC_BASE_URL", "");
    expect(reportBaseUrl()).toBe("https://www.sarisari.design");
  });
  it("honors the env override and strips trailing slashes", () => {
    vi.stubEnv("SCORECARD_PUBLIC_BASE_URL", "https://example.com//");
    expect(reportBaseUrl()).toBe("https://example.com");
  });
});
