import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

const EMAIL = "hello@sarisari.design";
const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="November 9, 2026"
      intro={
        <p>
          This policy explains what Sari Sari Design LLC (&ldquo;Sari Sari,&rdquo; &ldquo;we&rdquo;)
          collects when you visit sarisari.design, how we use it and the choices you have. Questions? Email{" "}
          {mail}.
        </p>
      }
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>Information you give us:</p>
              <ul>
                <li>
                  <strong>Scorecard form:</strong> name, company, work email, funding stage and the website or
                  product URL you submit.
                </li>
                <li>
                  <strong>Call bookings:</strong> the details you enter when booking through Calendly.
                </li>
                <li>
                  <strong>Emails:</strong> anything you send us directly.
                </li>
              </ul>
              <p>
                Information collected automatically: cookies and similar technologies, pages visited, clicks,
                device and browser information, approximate location and IP address.
              </p>
            </>
          ),
        },
        {
          heading: "Tools that collect data",
          body: (
            <>
              <p>We use these third-party services. Each handles data under its own privacy policy.</p>
              <ul>
                <li>
                  <strong>Google Analytics:</strong> measures how people use the site. See{" "}
                  <a href="https://policies.google.com/technologies/partner-sites">
                    how Google uses information from sites or apps that use its services
                  </a>
                  .
                </li>
                <li>
                  <strong>Google Ads:</strong> measures which ads lead to visits and bookings.
                </li>
                <li>
                  <strong>Google Tag Manager:</strong> loads the tools on this list.
                </li>
                <li>
                  <strong>Contentsquare:</strong> records anonymized sessions and heatmaps so we can see where
                  pages are confusing. Typed text, email addresses and card numbers are masked.
                </li>
                <li>
                  <strong>CallRail:</strong> tracks which pages or ads lead to phone calls.
                </li>
                <li>
                  <strong>Calendly:</strong> schedules calls.
                </li>
                <li>
                  <strong>Vercel:</strong> hosts the site.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "Cookies",
          body: (
            <p>
              We use analytics cookies (to understand site usage) and advertising cookies (to measure ads). You
              can block or delete cookies in your browser settings. Some parts of the site may not work as
              expected without them.
            </p>
          ),
        },
        {
          heading: "How we use your information",
          body: (
            <ul>
              <li>Send your Activation Scorecard and follow up about our services.</li>
              <li>Schedule and prepare for calls.</li>
              <li>Measure our ads and improve the site.</li>
              <li>Respond to your questions.</li>
            </ul>
          ),
        },
        {
          heading: "Sharing",
          body: (
            <p>
              We share information only with the service providers listed above, to run the site and our
              business, or when the law requires it. We don&rsquo;t sell personal information.
            </p>
          ),
        },
        {
          heading: "How long we keep it",
          body: (
            <p>
              We keep form and booking information for as long as we need it to work with you or follow up,
              typically up to 24 months after our last contact, unless you ask us to delete it sooner.
            </p>
          ),
        },
        {
          heading: "Security",
          body: (
            <p>
              We use reasonable safeguards to protect your information. No system is completely secure, so we
              can&rsquo;t guarantee absolute security.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <ul>
              <li>
                Opt out of Google Analytics with Google&rsquo;s{" "}
                <a href="https://tools.google.com/dlpage/gaoptout">browser add-on</a>.
              </li>
              <li>
                Manage ad personalization in{" "}
                <a href="https://adssettings.google.com">Google&rsquo;s ad settings</a>.
              </li>
              <li>Unsubscribe from our emails anytime using the link in the email.</li>
              <li>Email {mail} to see, correct or delete the information we hold about you.</li>
            </ul>
          ),
        },
        {
          heading: "Your California privacy rights",
          body: (
            <p>
              California residents can use the choices above to review, correct or delete their information,
              and can email {mail} with any request. We respond within 45 days.
            </p>
          ),
        },
        {
          heading: "Do Not Track",
          body: (
            <p>
              Our site does not currently respond to browser Do Not Track signals. You can still limit
              tracking using the choices above.
            </p>
          ),
        },
        {
          heading: "Children",
          body: (
            <p>
              This site is for businesses and isn&rsquo;t meant for anyone under 13. We don&rsquo;t knowingly
              collect information from children.
            </p>
          ),
        },
        {
          heading: "Visitors outside the US",
          body: <p>We&rsquo;re based in the United States, and information is processed in the US.</p>,
        },
        {
          heading: "Changes to this policy",
          body: (
            <p>
              We may update this policy. When we do, we&rsquo;ll change the effective date at the top of this
              page. Material changes will be noted on this page.
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
