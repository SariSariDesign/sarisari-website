import { describe, it, expect } from "vitest";
import { createInMemoryStore } from "./store.memory";
import type { NewScorecard } from "./store";
import { sampleRow } from "./fixtures";

function row(over: Partial<NewScorecard> = {}): NewScorecard {
  return sampleRow(over);
}

describe("in-memory store", () => {
  it("returns null when no rows exist for a url", async () => {
    const store = createInMemoryStore();
    expect(await store.latestForUrl("https://acme.com/")).toBeNull();
  });

  it("latestForUrl returns the most recently inserted row for that url", async () => {
    const store = createInMemoryStore();
    await store.insert(row({ overallScore: 60 }));
    await store.insert(row({ overallScore: 72 }));
    await store.insert(row({ url: "https://other.com/", overallScore: 10 }));
    const latest = await store.latestForUrl("https://acme.com/");
    expect(latest?.overallScore).toBe(72);
  });

  it("hasRowForUrlEmail matches on url + email", async () => {
    const store = createInMemoryStore();
    await store.insert(row({ email: "a@acme.com" }));
    expect(await store.hasRowForUrlEmail("https://acme.com/", "a@acme.com")).toBe(true);
    expect(await store.hasRowForUrlEmail("https://acme.com/", "b@acme.com")).toBe(false);
    expect(await store.hasRowForUrlEmail("https://other.com/", "a@acme.com")).toBe(false);
  });

  it("insert returns a row with id and createdAt", async () => {
    const store = createInMemoryStore();
    const saved = await store.insert(row());
    expect(saved.id).toBeTruthy();
    expect(saved.createdAt).toBeTruthy();
  });
});
