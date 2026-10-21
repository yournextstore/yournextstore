"use client";

import { useEffect } from "react";

const ON = 48;
const OFF = 16;

/**
 * Compacts the fixed header once the page scrolls (with hysteresis, as the original), by
 * flipping `data-sticky` on it. Reads the DOM, never the pathname, so the header stays in the
 * prerendered shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;
		const update = () => {
			const sticky = header.dataset.sticky === "true";
			const y = window.scrollY;
			header.dataset.sticky = String(sticky ? y > OFF : y > ON);
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
