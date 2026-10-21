"use client";

import { useEffect } from "react";

/**
 * Renders nothing: flags the header once the page scrolls, so the CSS can turn the transparent
 * hero header into glass. Reading the DOM instead of the pathname keeps the header in the shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) return;
		const sync = () => {
			header.dataset.scrolled = String(window.scrollY > 8);
		};
		sync();
		window.addEventListener("scroll", sync, { passive: true });
		return () => window.removeEventListener("scroll", sync);
	}, []);

	return null;
}
