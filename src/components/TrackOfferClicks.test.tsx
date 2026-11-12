import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TrackOfferClicks } from "./TrackOfferClicks";

/** Stops jsdom from attempting navigation; registered after the tracker's capture listener. */
function preventNav(e: React.MouseEvent) {
  e.preventDefault();
}

function Page() {
  return (
    <>
      <TrackOfferClicks />
      <a
        href="https://calendly.com/sarisari/audit"
        data-offer-cta=""
        data-offer-id="offer-audit"
        data-offer-name="The Audit"
        data-cta-placement="home_pricing"
        onClick={preventNav}
      >
        <span data-testid="label">Book a call</span>
        <svg data-testid="arrow" aria-hidden>
          <path d="M0 0" />
        </svg>
      </a>
      <a href="/terms" onClick={preventNav}>
        Terms
      </a>
    </>
  );
}

const expected = {
  event: "offer_cta_click",
  offer_id: "offer-audit",
  offer_name: "The Audit",
  cta_label: "Book a call",
  cta_destination: "https://calendly.com/sarisari/audit",
  cta_placement: "home_pricing",
};

afterEach(() => {
  delete window.dataLayer;
});

describe("TrackOfferClicks", () => {
  it("pushes exactly one event per click, including clicks on children", () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("link", { name: "Book a call" }));
    expect(window.dataLayer).toEqual([expected]);

    fireEvent.click(screen.getByTestId("label"));
    expect(window.dataLayer).toHaveLength(2);

    fireEvent.click(screen.getByTestId("arrow"));
    expect(window.dataLayer).toHaveLength(3);
    expect(window.dataLayer).toEqual([expected, expected, expected]);
  });

  it("ignores links without data-offer-cta", () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("link", { name: "Terms" }));
    expect(window.dataLayer).toBeUndefined();
  });

  it("removes the listener on unmount", () => {
    const { unmount } = render(<Page />);
    const link = screen.getByRole("link", { name: "Book a call" });
    unmount();
    // The anchor is detached now; re-attach a copy to the document and click it.
    document.body.appendChild(link);
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);
    expect(window.dataLayer).toBeUndefined();
    link.remove();
  });
});
