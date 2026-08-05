"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Button } from "./Button";
import { Wordmark } from "./Wordmark";

/** Sticky nav: transparent over the hero, gaining a paper background + hairline on scroll. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-neutral-300 bg-neutral-100/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" aria-label="Sari Sari Design home" className="py-2">
          <Wordmark className="text-title-l text-neutral-1000" />
        </Link>

        <nav className="ds-label hidden items-center gap-8 text-label-m md:flex">
          {nav.links.map((l) => (
            <Link key={l.label} href={l.href} className="text-neutral-800 hover:text-primary-400">
              {l.label}
            </Link>
          ))}
          <Button href={nav.cta.href} size="medium" external>
            {nav.cta.label}
          </Button>
        </nav>

        <button
          type="button"
          className="ds-label -mr-2 min-h-11 px-2 text-label-m text-neutral-800 md:hidden"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="ds-label flex flex-col gap-4 border-t border-neutral-300 bg-neutral-100 px-6 py-6 text-label-m md:hidden">
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
