"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

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
	}, [router]);

	return (
		<Script id="navigation-reporter" strategy="afterInteractive">
			{`
(function() {
  if (window.parent === window) return;

  function reportNavigation() {
    window.parent.postMessage({ type: "navigation", pathname: window.location.pathname }, "*");
  }

  reportNavigation();

  var pushState = history.pushState;
  var replaceState = history.replaceState;

  history.pushState = function() {
    pushState.apply(this, arguments);
    reportNavigation();
  };

  history.replaceState = function() {
    replaceState.apply(this, arguments);
    reportNavigation();
  };

  window.addEventListener("popstate", reportNavigation);
})();
      `}
		</Script>
	);
}
