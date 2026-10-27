import type { Metadata } from "next";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = { title: "Terms & Conditions" };

// ⚠️ Placeholder — no T&Cs exist on the live site; legal copy needed before launch.
export default function Terms() {
  return (
    <>
      <Nav />
      <main className="mx-auto min-h-[50vh] max-w-[760px] px-6 py-24">
        <h1 className="mb-8 font-brand text-h1 text-neutral-900">Terms &amp; Conditions</h1>
        <p className="text-body-m text-neutral-700">
          Terms of service for Sari Sari llc engagements. Full legal copy pending — contact{" "}
          <a className="text-primary-400 underline" href="mailto:hello@sarisari.design">
            hello@sarisari.design
          </a>{" "}
          with any questions.
        </p>
      </main>
      <FooterCta />
    </>
  );
}
