"use client";

import { useEffect } from "react";

/**
 * Flips `data-sticky` on the header once the page has scrolled 50px, as the original does: the
 * header turns solid over the home slideshow and gains its shadow everywhere else. Reads the
 * DOM, never the pathname, so the header itself stays in the prerendered shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;

		const update = () => {
			header.dataset.sticky = window.scrollY >= 50 ? "true" : "false";
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
