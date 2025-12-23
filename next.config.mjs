// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		typedEnv: true,
	},
	images: {
		remotePatterns: [{ protocol: "https", hostname: "*.blob.vercel-storage.com" }],
	},
};

export default nextConfig;
