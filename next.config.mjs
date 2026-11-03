/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Old Webflow-era URLs → one-pager anchors / new case-study routes.
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: true },
      { source: "/kenchan-ramen-case-study", destination: "/work/kenchan-ramen", permanent: true },
    ];
  },
  async headers() {
    // Per-lead scorecard reports: unguessable URLs that must stay out of search.
    return [{ source: "/s/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
