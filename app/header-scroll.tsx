"use client";

import { useEffect } from "react";

/**
 * Flips `data-sticky` on the fixed header once the page scrolls: past the hero photograph on
 * pages that mark one with `[data-hero]`, past the first pixel everywhere else. Reads the DOM,
 * never the pathname, so the header itself stays in the prerendered shell; route changes are
 * caught by watching `<main>` for a hero arriving or leaving.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		const main = document.getElementById("main");
		if (!header) return;

		const update = () => {
			const hero = document.querySelector<HTMLElement>("[data-hero]");
			const trigger = hero ? Math.max(hero.offsetHeight - header.offsetHeight, 1) : 1;
			header.dataset.sticky = window.scrollY >= trigger ? "true" : "false";
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update, { passive: true });
		const observer = new MutationObserver(update);
		if (main) observer.observe(main, { childList: true, subtree: true });

		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
			observer.disconnect();
		};
	}, []);

	return null;
}
