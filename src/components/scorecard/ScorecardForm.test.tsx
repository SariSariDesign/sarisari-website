import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScorecardForm } from "./ScorecardForm";

async function fill() {
  const u = userEvent.setup();
  await u.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await u.type(screen.getByLabelText("Company"), "Engines");
  await u.type(screen.getByLabelText("Work email"), "ada@example.com");
  await u.selectOptions(screen.getByLabelText("Funding stage"), "Seed");
  await u.type(screen.getByLabelText(/company website/i), "engines.io");
  await u.click(screen.getByRole("button", { name: /get your free activation scorecard/i }));
}

describe("ScorecardForm", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows validation errors instead of submitting an empty form", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ScorecardForm />);
    await userEvent.click(screen.getByRole("button", { name: /get your free activation scorecard/i }));
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to /api/scorecard-request and shows the confirmation", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true, duplicate: false }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ScorecardForm />);
    await fill();
    expect(await screen.findByRole("heading", { name: "Your scorecard is on its way." })).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/scorecard-request");
  });

  it("shows the duplicate state when the API reports one", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ ok: true, duplicate: true })));
    render(<ScorecardForm />);
    await fill();
    expect(await screen.findByRole("heading", { name: "You've already got one on the way." })).toBeInTheDocument();
  });

  it("shows the error state on a failed request and lets the user try again", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 500 })));
    render(<ScorecardForm />);
    await fill();
    expect(await screen.findByRole("heading", { name: "Something went wrong." })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByRole("button", { name: /get your free activation scorecard/i })).toBeInTheDocument();
  });
});
