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

		const host = document.querySelector("nextjs-portal");
		if (host?.shadowRoot) {
			const style = document.createElement("style");
			style.textContent = /* css */ `[data-nextjs-dialog-overlay] { display: none !important; }`;
			host.shadowRoot.appendChild(style);
		} else {
			console.warn("Could not find Next.js error overlay host element.");
		}
	}, []);

	return null;
}
