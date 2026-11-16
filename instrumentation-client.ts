import { startTracking } from "commerce-kit/tracking";

// Sandbox inspectors (dev-only, self-gated on NODE_ENV). Next.js inlines
// NEXT_PUBLIC_* at build time, so production builds DCE this branch.
if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
	void import("commerce-kit/sandbox-inspectors");
}
// ─── Platform tracking and storefront kit (do not modify) ───────────────────
// startTracking() runs the page's event bus and loads the platform runtime
// (/_public/tracking/v1/runtime.js), which reports views, cart changes and
// purchases from the page's structured data and the cart, and sends them to the
// store's trackers once consent allows. /_public/kit.js adds attribution and
// carrier widgets. Storefront code never reports an event and never adds a
// tracker snippet (fbq, gtag, GTM, …).
//
// Production only: the /design sandbox preview and Vercel preview deploys run
// this same code, and builder/preview traffic must never pollute the
// merchant's real ad and analytics data.
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
	startTracking();
	const kit = document.createElement("script");
	kit.src = "/_public/kit.js";
	kit.async = true;
	document.head.appendChild(kit);
}
// Feedback toolbar — loaded at runtime from the central CDN on preview deploys,
// so toolbar fixes ship without rebuilding the store. The toolbar host mirrors
// the preview's domain (yns.store / yns.cx) so it stays on the same registrable
// domain; non-yns hosts fall back to yns.cx.
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
	const base = location.hostname.endsWith(".yns.store")
		? "https://toolbar.yns.store"
		: "https://toolbar.yns.cx";
	const s = document.createElement("script");
	s.src = base + "/toolbar.js";
	s.async = true;
	document.head.appendChild(s);
}
