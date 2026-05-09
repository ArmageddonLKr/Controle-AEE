import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Controle-AEE",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
