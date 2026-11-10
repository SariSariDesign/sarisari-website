import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

const EMAIL = "hello@sarisari.design";
const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      effectiveDate="November 9, 2026"
      intro={
        <p>
          These terms cover your use of sarisari.design, operated by Sari Sari Design LLC (&ldquo;Sari
          Sari,&rdquo; &ldquo;we&rdquo;). By using the site, you agree to them. Our{" "}
          <Link href="/privacy">Privacy Policy</Link> explains how we handle your information.
        </p>
      }
      sections={[
        {
          heading: "Using the site",
          body: (
            <p>
              Use the site for lawful purposes only. Don&rsquo;t scrape it, send spam through it, submit
              someone else&rsquo;s information, or abuse the Scorecard tool.
            </p>
          ),
        },
        {
          heading: "Prices and engagements",
          body: (
            <p>
              Prices on the site are for reference and may change. Each engagement is governed by its own
              signed agreement, which sets payment terms, scope, revisions and confidentiality. If the signed
              agreement and these terms differ, the signed agreement wins.
            </p>
          ),
        },
        {
          heading: "Engagement terms",
          body: (
            <ul>
              <li>
                <strong>Design+:</strong> 3-month minimum, billed monthly.
              </li>
              <li>
                <strong>Design Partner:</strong> cancel anytime with 30 days notice, no fees.
              </li>
              <li>
                <strong>Design Partner pause:</strong> we hold your slot for 30 days. After that we may fill
                it, and you&rsquo;d restart when one opens.
              </li>
              <li>
                <strong>Diagnostic credit:</strong> the Diagnostic fee is credited toward Design+ if you sign
                within 30 days of your Diagnostic delivery.
              </li>
            </ul>
          ),
        },
        {
          heading: "Design+ money-back guarantee",
          body: (
            <ul>
              <li>The guarantee applies to Month 1 of Design+ only.</li>
              <li>
                If you&rsquo;re not satisfied by the end of Month 1, tell us before Month 1 ends. Sari Sari
                Design LLC refunds your Month 1 payment in full and the engagement ends. Neither side owes the
                other anything further.
              </li>
              <li>
                All Month 1 work stays with Sari Sari Design LLC. You may not use it after a refund.
              </li>
              <li>The guarantee expires at the end of Month 1. After that, the 3-month minimum applies.</li>
            </ul>
          ),
        },
        {
          heading: "Ownership of work",
          body: (
            <ul>
              <li>You own the design files, code and research we make for you once each invoice is paid.</li>
              <li>
                Sari Sari Design LLC owns all unpaid or refunded work. You may not use it.
              </li>
              <li>
                We may show completed, paid work in our portfolio and case studies unless your signed agreement
                says otherwise.
              </li>
              <li>The site&rsquo;s own content, design and branding belong to Sari Sari Design LLC.</li>
            </ul>
          ),
        },
        {
          heading: "The Activation Scorecard",
          body: (
            <p>
              The Scorecard is automated and provided as is. It&rsquo;s a starting point, not professional
              advice, and we don&rsquo;t guarantee any results from acting on it.
            </p>
          ),
        },
        {
          heading: "Third-party tools and links",
          body: (
            <p>
              The site links to and uses third-party services such as Calendly. Their own terms and policies
              apply, and we aren&rsquo;t responsible for them.
            </p>
          ),
        },
        {
          heading: "No warranties",
          body: (
            <p>
              The site and everything on it are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
              without warranties of any kind, to the fullest extent the law allows.
            </p>
          ),
        },
        {
          heading: "Limitation of liability",
          body: (
            <p>
              To the fullest extent the law allows, Sari Sari Design LLC isn&rsquo;t liable for indirect,
              incidental, special or consequential damages from your use of the site. Our total liability for
              any claim related to the site is limited to $100.
            </p>
          ),
        },
        {
          heading: "Indemnification",
          body: (
            <p>
              You agree to cover any claims, losses or costs that arise from your misuse of the site or your
              breach of these terms.
            </p>
          ),
        },
        {
          heading: "Governing law",
          body: (
            <p>
              These terms are governed by California law. Any dispute will be handled in the state or federal
              courts in Los Angeles County, California.
            </p>
          ),
        },
        {
          heading: "Changes to these terms",
          body: (
            <p>
              We may update these terms. When we do, we&rsquo;ll change the effective date at the top of this
              page. Continued use of the site means you accept the updated terms.
            </p>
          ),
        },
        {
          heading: "General",
          body: (
            <p>
              If any part of these terms is found unenforceable, the rest stays in effect. These terms, our
              Privacy Policy and any signed agreement make up the full agreement about your use of the site.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Sari Sari Design LLC, Los Angeles, California. {mail}
            </p>
          ),
        },
      ]}
    />
  );
}
