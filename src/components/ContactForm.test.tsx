import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

afterEach(() => vi.unstubAllGlobals());

async function fill() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
  await user.type(screen.getByLabelText(/email/i), "ada@example.com");
  await user.type(screen.getByLabelText(/message/i), "Hello");
  await user.click(screen.getByRole("button", { name: /send/i }));
}

describe("ContactForm", () => {
  it("posts the fields and shows the success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    await fill();
    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body)).toMatchObject({ name: "Ada Lovelace", email: "ada@example.com", message: "Hello" });
  });

  it("shows the server error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "Enter a valid email." }, { status: 400 })));
    render(<ContactForm />);
    await fill();
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email.");
  });
});
