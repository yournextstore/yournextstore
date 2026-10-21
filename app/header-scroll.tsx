"use client";

import { useEffect } from "react";

/**
 * Fades in the header's frosted white ground once the page has scrolled 100px, like the
 * original. Reads the DOM instead of the pathname, so the header stays in the prerendered shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;
		const update = () => {
			header.dataset.scrolled = window.scrollY > 100 ? "true" : "false";
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
