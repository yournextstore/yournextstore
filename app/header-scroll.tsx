"use client";

import { useEffect } from "react";

/**
 * The original's header fades in a plate and a hairline after ~100px of scroll. Flipping
 * `data-sticky` from the DOM (never the pathname) keeps the header in the prerendered shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;
		const update = () => {
			header.dataset.sticky = String(window.scrollY > 40);
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
