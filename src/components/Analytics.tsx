import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { CLARITY_PROJECT_ID, GA_MEASUREMENT_ID } from "@/content/site";

/**
 * GA4 + Microsoft Clarity, production deploys only, so local dev, previews and CI
 * never send traffic. NEXT_PUBLIC_VERCEL_ENV is a Vercel system env var, inlined at build.
 */
export function Analytics() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") return null;
  return (
    <>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      <Script id="clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`}
      </Script>
    </>
  );
}
