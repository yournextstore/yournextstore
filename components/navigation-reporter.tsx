"use client";

import Script from "next/script";

export function NavigationReporter() {
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
