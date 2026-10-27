import type { Metadata } from "next";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = { title: "Privacy Policy" };

// ⚠️ Placeholder — no privacy policy exists on the live site; legal copy needed before launch.
export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="measure min-h-[50vh] py-24 [&>*]:max-w-[760px]">
        <h1 className="mb-8 font-brand text-display-m text-neutral-900">Privacy Policy</h1>
        <p className="text-body text-neutral-700">
          Sari Sari llc collects only what the site needs to function. Full policy copy pending —
          contact{" "}
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
