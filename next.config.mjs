/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Old Webflow-era URLs → one-pager anchors / new case-study routes.
    return [
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/portfolio", destination: "/#work", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: true },
      { source: "/kenchan-ramen-case-study", destination: "/work/kenchan-ramen", permanent: true },
    ];
  },
};

export default nextConfig;
