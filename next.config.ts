import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/reminders',
        permanent: true, // or false for temporary redirect
      },
    ];
  },
};

export default nextConfig;
