import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ad-hook-grader",
        destination: "/tools/ad-hook-grader",
        permanent: true,
      },
      {
        source: "/ad-hook-grader/:path*",
        destination: "/tools/ad-hook-grader/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
