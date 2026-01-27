// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		typedEnv: true,
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-alert-dialog",
			"@radix-ui/react-avatar",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-collapsible",
			"@radix-ui/react-context-menu",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-hover-card",
			"@radix-ui/react-label",
			"@radix-ui/react-menubar",
			"@radix-ui/react-navigation-menu",
			"@radix-ui/react-popover",
			"@radix-ui/react-progress",
			"@radix-ui/react-radio-group",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-select",
			"@radix-ui/react-separator",
			"@radix-ui/react-slider",
			"@radix-ui/react-slot",
			"@radix-ui/react-switch",
			"@radix-ui/react-tabs",
			"@radix-ui/react-toggle",
			"@radix-ui/react-toggle-group",
			"@radix-ui/react-tooltip",
			"date-fns",
			"class-variance-authority",
		],
	},
	images: {
		remotePatterns: [{ protocol: "https", hostname: "*.blob.vercel-storage.com" }],
	},
	async rewrites() {
		// const storeSubdomain = process.env.STORE_SUBDOMAIN;
		// const ynsBaseUrl = process.env.YNS_BASE_URL || "https://yns.cx";
		const storeSubdomain = "iyi-siyere";
		// const ynsBaseUrl = "https://yns.cx";
		const ynsBaseUrl = "http://localhost:3000";

		return [
			{
				source: "/checkout",
				destination: `${ynsBaseUrl}/${storeSubdomain}/checkout`,
			},
			{
				source: "/checkout/:path*",
				destination: `${ynsBaseUrl}/${storeSubdomain}/checkout/:path*`,
			},
		];
	},
};

export default nextConfig;
