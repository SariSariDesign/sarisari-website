import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PricingTabs } from "./PricingTabs";

const labels = { retainer: "Ongoing partnership", diagnostic: "Want a taste first?" };

describe("PricingTabs", () => {
  it("shows the retainer panel by default with the tab selected", () => {
    render(
      <PricingTabs labels={labels} retainer={<p>Retainer panel</p>} diagnostic={<p>Diagnostic panel</p>} />,
    );
    expect(screen.getByText("Retainer panel")).toBeInTheDocument();
    expect(screen.queryByText("Diagnostic panel")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: labels.retainer })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("switches to the diagnostic panel on tab click", async () => {
    const user = userEvent.setup();
    render(
      <PricingTabs labels={labels} retainer={<p>Retainer panel</p>} diagnostic={<p>Diagnostic panel</p>} />,
    );
    await user.click(screen.getByRole("tab", { name: labels.diagnostic }));
    expect(screen.getByText("Diagnostic panel")).toBeInTheDocument();
    expect(screen.queryByText("Retainer panel")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: labels.diagnostic })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
