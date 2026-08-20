"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

// Only the YNS builder/toolbar hosts may drive or observe navigation when the
// storefront is embedded in an iframe (matches `allowedDevOrigins` and the
// toolbar hosts in instrumentation-client.ts).
const TRUSTED_PARENT_HOSTNAME = /(^|\.)(yns\.store|yns\.cx|yournextstore\.com|vercel\.run|localhost)$/;

const isTrustedParentOrigin = (origin: string) => {
	try {
		return TRUSTED_PARENT_HOSTNAME.test(new URL(origin).hostname);
	} catch {
		return false;
	}
};

export function NavigationReporter() {
	const router = useRouter();

	useEffect(() => {
		if (typeof window === "undefined" || window.parent === window) return;

		const handleMessage = (event: MessageEvent) => {
			if (!isTrustedParentOrigin(event.origin)) return;
			if (event.data?.type === "navigate" && typeof event.data.pathname === "string") {
				router.push(event.data.pathname);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return (
		<Script id="navigation-reporter" strategy="afterInteractive">
			{
				/* js */ `
(function() {
  if (window.parent === window) return;

  // Report only to the embedding origin, and only when it's a trusted YNS host.
  var parentOrigin = "";
  try { parentOrigin = new URL(document.referrer).origin; } catch (e) {}
  if (!parentOrigin) return;
  try {
    if (!${TRUSTED_PARENT_HOSTNAME.toString()}.test(new URL(parentOrigin).hostname)) return;
  } catch (e) { return; }

  function reportNavigation() {
    window.parent.postMessage({ type: "navigation", pathname: window.location.pathname }, parentOrigin);
  }

  reportNavigation();

  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function(...args) {
    pushState.apply(this, args);
    reportNavigation();
  };

  history.replaceState = function(...args) {
    replaceState.apply(this, args);
    reportNavigation();
  };

  window.addEventListener("popstate", reportNavigation);
})();
      `
			}
		</Script>
	);
}

export function ErrorOverlayRemover() {
	useEffect(() => {
		if (window.parent === window) return;

		// Merchants see this dev server through the builder iframe, so none of the Next.js dev
		// chrome belongs to them: the error dialog covers the preview, and the indicator chip
		// ("N Insights" / "N Issues") opens a panel that locks scrolling inside the frame.
		// The chip is `[data-next-badge-root]`; naming both it and the `[data-nextjs-toast]`
		// container it currently sits in keeps this working if either one is restructured.
		const hiddenSelectors = ["[data-nextjs-dialog-overlay]", "[data-next-badge-root]", "[data-nextjs-toast]"];

		const inject = () => {
			const shadowRoot = document.querySelector("nextjs-portal")?.shadowRoot;
			if (!shadowRoot) return false;
			if (shadowRoot.querySelector("style[data-yns-hide-dev-chrome]")) return true;

			const style = document.createElement("style");
			style.setAttribute("data-yns-hide-dev-chrome", "");
			style.textContent = `${hiddenSelectors.join(",\n")} { display: none !important; }`;
			shadowRoot.appendChild(style);

			// A Next.js upgrade that renames these would otherwise degrade silently, into
			// merchants seeing dev chrome over their storefront preview.
			if (!hiddenSelectors.some((selector) => shadowRoot.querySelector(selector))) {
				console.warn("Next.js dev overlay found, but none of its chrome selectors matched:", hiddenSelectors);
			}
			return true;
		};

		if (inject()) return;

		// The overlay portal mounts after hydration, so watch for it instead of giving up. It is
		// appended to <body> directly, so no subtree, and the watch is bounded — a portal that
		// never arrives must not leave a live observer on the page the merchant is editing.
		const observer = new MutationObserver(() => {
			if (inject()) observer.disconnect();
		});
		observer.observe(document.body, { childList: true });
		const stopWatching = setTimeout(() => observer.disconnect(), 10_000);

		return () => {
			clearTimeout(stopWatching);
			observer.disconnect();
		};
	}, []);

	return null;
}
