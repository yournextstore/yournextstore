import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";
import { listingRewrites } from "./lib/listing-routes";

const isProd = process.env.NODE_ENV === "production";

const positiveIntOr = (value: string | undefined, fallback: number) => {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

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
		// Every prerendered page calls the Store API, and the build renders workers × pages-per-worker pages at once.
		// Next's default is one worker per host core minus one (11 on a 12-core build host, whatever the container's
		// CPU quota) × 8 pages, so a large store sent ~88 API calls at a time and could slow every other store down.
		// The build host can override both with NEXT_BUILD_WORKERS and NEXT_BUILD_PAGE_CONCURRENCY.
		cpus: positiveIntOr(process.env.NEXT_BUILD_WORKERS, 4),
		staticGenerationMaxConcurrency: positiveIntOr(process.env.NEXT_BUILD_PAGE_CONCURRENCY, 8),
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

// BotID's browser challenge and its proxy are served from this domain through the rewrites withBotId adds;
// without them <BotIdClient> gets no token, and checkBotId() treats every signup as a bot's.
export default withBotId(nextConfig);
