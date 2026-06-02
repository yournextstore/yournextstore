"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

// NOTE: We intentionally do NOT hide the Next.js error overlay here. In the app
// router the overlay never auto-opens — it only appears when the user clicks the
// dev tools error badge — so suppressing it just swallowed the error description.

export function NavigationReporter() {
	const router = useRouter();

	useEffect(() => {
		if (typeof window === "undefined" || window.parent === window) return;

		const handleMessage = (event: MessageEvent) => {
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

  function reportNavigation() {
    window.parent.postMessage({ type: "navigation", pathname: window.location.pathname }, "*");
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
