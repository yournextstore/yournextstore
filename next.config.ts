import type { NextConfig } from "next";

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
		useTypeScriptCli: true,
		typedEnv: true,
		serverComponentsHmrCache: false,
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-label",
			"@radix-ui/react-popover",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-select",
			"@radix-ui/react-slider",
			"@radix-ui/react-slot",
			"@radix-ui/react-tooltip",
			"class-variance-authority",
		],
	},
	images: {
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
