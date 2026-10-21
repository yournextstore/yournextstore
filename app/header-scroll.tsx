"use client";

import { useEffect } from "react";

/**
 * Flips `data-sticky` on the fixed header once the page scrolls past 10px, which turns the
 * transparent hero header white with a black rule (the original's `.invert`). Reads the DOM,
 * never the pathname, so the header itself stays in the prerendered shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;

		const update = () => {
			header.dataset.sticky = window.scrollY > 10 ? "true" : "false";
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
