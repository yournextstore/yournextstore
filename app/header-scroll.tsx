"use client";

import { useEffect } from "react";

/**
 * The original's headroom header: it slides away while the shopper scrolls down and comes back
 * as a floating card (shadow and hairline ring) on the way up. Writes data attributes on the
 * header instead of rendering it, so the header itself stays in the prerendered shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;
		let lastY = window.scrollY;

		const update = () => {
			const y = Math.max(window.scrollY, 0);
			const pastHeader = y > header.offsetHeight;
			// Keep the header put while a dialog (cart, menu) has locked the page scroll.
			if (document.body.hasAttribute("data-scroll-locked")) {
				lastY = y;
				return;
			}
			if (!pastHeader || y < lastY - 2) {
				header.dataset.hidden = "false";
			} else if (y > lastY + 2) {
				header.dataset.hidden = "true";
			}
			header.dataset.floating = y > 0 ? "true" : "false";
			lastY = y;
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		// A focused control inside a hidden header must be visible again.
		const reveal = () => {
			header.dataset.hidden = "false";
		};
		header.addEventListener("focusin", reveal);
		return () => {
			window.removeEventListener("scroll", update);
			header.removeEventListener("focusin", reveal);
		};
	}, []);

	return null;
}
