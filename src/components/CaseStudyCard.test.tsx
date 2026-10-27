import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CaseStudy } from "@/content/case-studies";
import { CaseStudyCard } from "./CaseStudyCard";

const base: CaseStudy = {
  slug: "acme",
  status: "coming-soon",
  client: "Acme",
  card: { productType: null, helpedWith: [], outcome: null, image: null },
};

describe("CaseStudyCard", () => {
  it("links a published study to its page", () => {
    render(<CaseStudyCard c={{ ...base, status: "published" }} featured={false} />);
    expect(screen.getByRole("link", { name: "Acme case study" })).toHaveAttribute("href", "/work/acme");
  });

  it("renders a coming-soon study without a link", () => {
    render(<CaseStudyCard c={base} featured={false} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Case study coming soon.")).toBeInTheDocument();
  });
});
