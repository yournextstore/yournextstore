import type { NextConfig } from "next";
import { listingRewrites } from "./lib/listing-routes";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ["*.vercel.run", "*.yns.store", "*.yns.cx"],
	devIndicators: false,
	reactCompiler: true,
	cacheComponents: true,
	// Instant Navigations (16.3): every <Link> prefetches the route's shared App Shell.
	partialPrefetching: true,
	experimental: {
		// Run the React Compiler natively in Turbopack instead of through Babel (16.3 experimental).
		turbopackRustReactCompiler: true,
		typedEnv: true,
		serverComponentsHmrCache: false,
	},
	images: {
		// Blob media URLs carry a random suffix, so a new photo is a new URL: optimized copies can live a year instead
		// of being regenerated (a first visit to a page without a ready copy waited ~0.3 s per image).
		minimumCacheTTL: 31536000,
		// Store media lives on Vercel Blob (per-store subdomain) and the YNS platform hosts.
		// A "**" wildcard would make the image optimizer an open proxy for any https URL.
		remotePatterns: [
			{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
			{ protocol: "https", hostname: "yns.store" },
			{ protocol: "https", hostname: "**.yns.store" },
			{ protocol: "https", hostname: "yns.cx" },
			{ protocol: "https", hostname: "**.yns.cx" },
		],
	},
	// Filtered, sorted and paginated listings render per request on their own routes, so the default views stay
	// static (lib/listing-routes.ts).
	async rewrites() {
		return { beforeFiles: listingRewrites(), afterFiles: [], fallback: [] };
	},
	async headers() {
		if (isProd) return [];
		// Dev-only: AI Builder renders this app in an iframe, and Chrome's HTTP cache
		// holds stale sub-resources inside iframes — HMR fires but the preview never
		// sees it. See https://github.com/vercel/next.js/issues/90143.
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Cache-Control", value: "no-store, must-revalidate" },
					{ key: "Pragma", value: "no-cache" },
				],
			},
		];
	},
};

export default nextConfig;
