import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion } from "./Accordion";

const items = [
  { label: "First question", body: "First answer" },
  { label: "Second question", body: "Second answer" },
];

// Answers stay in the DOM so they can animate open/closed; `aria-expanded` is the state.
const expanded = (name: RegExp) => screen.getByRole("button", { name }).getAttribute("aria-expanded");

describe("Accordion", () => {
  it("opens the defaultOpen item on render", () => {
    render(<Accordion items={items} defaultOpen={0} />);
    expect(expanded(/first question/i)).toBe("true");
    expect(expanded(/second question/i)).toBe("false");
  });

  it("opens one item at a time (single-open)", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpen={0} />);
    await user.click(screen.getByRole("button", { name: /second question/i }));
    expect(expanded(/second question/i)).toBe("true");
    expect(expanded(/first question/i)).toBe("false");
  });

  it("toggles an open item closed", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpen={0} />);
    await user.click(screen.getByRole("button", { name: /first question/i }));
    expect(expanded(/first question/i)).toBe("false");
  });
});
