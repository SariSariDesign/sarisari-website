import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion } from "./Accordion";

const items = [
  { label: "First question", body: "First answer" },
  { label: "Second question", body: "Second answer" },
];

describe("Accordion", () => {
  it("opens the defaultOpen item on render", () => {
    render(<Accordion items={items} defaultOpen={0} />);
    expect(screen.getByText("First answer")).toBeInTheDocument();
    expect(screen.queryByText("Second answer")).not.toBeInTheDocument();
  });

  it("opens one item at a time (single-open)", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpen={0} />);
    await user.click(screen.getByRole("button", { name: /second question/i }));
    expect(screen.getByText("Second answer")).toBeInTheDocument();
    expect(screen.queryByText("First answer")).not.toBeInTheDocument();
  });

  it("toggles an open item closed", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpen={0} />);
    await user.click(screen.getByRole("button", { name: /first question/i }));
    expect(screen.queryByText("First answer")).not.toBeInTheDocument();
  });
});
