"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/content/site";
import { Button } from "./Button";
import { Wordmark } from "./Wordmark";

/**
 * Sticky top nav: full 1200px measure, square, paper background, 1px bottom border.
 * No pill, shadow, blur or resize on scroll. Links change color + underline at 150ms.
 * Below `lg` the links collapse behind a Menu/Close toggle.
 */
export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-300 bg-neutral-100">
      <div className="measure flex items-center justify-between py-4">
        <Link href="/" aria-label="Sari Sari Design home" className="py-2">
          <Wordmark className="text-title-l text-neutral-1000" />
        </Link>

        <nav aria-label="Main" className="ds-label hidden items-center gap-8 text-label-m lg:flex">
          {nav.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-neutral-800 underline-offset-[6px] transition-colors duration-150 ease-out hover:text-neutral-1000 hover:underline"
            >
              {l.label}
            </Link>
          ))}
          <Button href={nav.cta.href} size="medium" external>
            {nav.cta.label}
          </Button>
        </nav>

        <button
          type="button"
          className="ds-label -mr-2 min-h-11 px-2 text-label-m text-neutral-800 lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          aria-label="Main"
          className="ds-label flex flex-col gap-4 border-t border-neutral-300 bg-neutral-100 px-4 py-6 text-label-m md:pl-16 lg:hidden"
        >
          {nav.links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-neutral-800">
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
