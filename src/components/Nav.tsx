"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Button } from "./Button";
import { Wordmark } from "./Wordmark";

/**
 * Sticky nav. Over the hero it spans the 1200px measure, wordmark left and links right.
 * Once the hero has scrolled away it condenses into a smaller centered pill (paper,
 * hairline, soft shadow) so it stays out of the content's way. Links show at ≥1024px;
 * below that they sit behind the Menu toggle so nothing crowds at tablet width.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const threshold = hero ? hero.offsetTop + hero.offsetHeight - 80 : 24;
      setCompact(window.scrollY > threshold);
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[padding,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        compact
          ? "border-transparent px-3 pt-3 md:px-4"
          : scrolled
            ? "border-neutral-300 bg-neutral-100/90 pt-0 backdrop-blur-md"
            : "border-transparent pt-0"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between border transition-[max-width,padding,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          compact
            ? "max-w-[860px] rounded border-neutral-300 bg-neutral-100/90 py-2 pl-6 pr-2 shadow-[0_10px_30px_-18px_rgba(31,29,28,0.45)] backdrop-blur-md"
            : "measure border-transparent py-4"
        }`}
      >
        <Link href="/" aria-label="Sari Sari Design home" className="py-2">
          <Wordmark
            className={`text-neutral-1000 transition-[font-size] duration-300 ${
              compact ? "text-[18px]" : "text-[24px]"
            }`}
          />
        </Link>

        <nav
          className={`ds-label hidden items-center transition-[gap,font-size] duration-300 lg:flex ${
            compact ? "gap-6 text-label" : "gap-8 text-label"
          }`}
        >
          {nav.links.map((l) => (
            <Link key={l.label} href={l.href} className="text-neutral-800 transition-colors duration-150 ease-out hover:text-primary-400">
              {l.label}
            </Link>
          ))}
          <Button
            href={nav.cta.href}
            size="medium"
            external
            className={compact ? "px-4! py-2! text-label!" : ""}
          >
            {nav.cta.label}
          </Button>
        </nav>

        <button
          type="button"
          className="ds-label -mr-2 min-h-11 px-2 text-label text-neutral-800 lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="ds-label mx-auto mt-2 flex max-w-[760px] flex-col gap-4 rounded border border-neutral-300 bg-neutral-100 px-6 py-6 text-label lg:hidden">
          {nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-neutral-800"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={nav.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="text-primary-400"
          >
            {nav.cta.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
