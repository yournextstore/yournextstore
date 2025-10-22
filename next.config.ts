import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		typedEnv: true,
	},
	images: {
		remotePatterns: [{ hostname: "*.blob.vercel-storage.com" }],
	},
};

export default nextConfig;
