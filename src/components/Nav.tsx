"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";

/** Sticky translucent nav per comp (`color/neutral/light-50` glass bar). */
export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "#faf8f880" }}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 lg:px-4">
        <Link href="/" aria-label="Sari Sari Design home" className="py-2">
          <Wordmark className="text-[26px] text-neutral-1000" />
        </Link>

        <nav className="ds-label hidden items-center gap-10 text-label-l md:flex">
          {nav.links.map((l) => (
            <Link key={l.label} href={l.href} className="text-neutral-700 hover:text-neutral-900">
              {l.label}
            </Link>
          ))}
          <Link href={nav.cta.href} className="text-neutral-700 underline underline-offset-4 hover:text-neutral-900">
            {nav.cta.label}
          </Link>
        </nav>

        <button
          type="button"
          className="ds-label text-label-l text-neutral-700 md:hidden"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="ds-label flex flex-col gap-4 border-t border-neutral-300 bg-neutral-100 px-6 py-6 text-label-l md:hidden">
          {[...nav.links, nav.cta].map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-neutral-700">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
