"use client";

import { useEffect } from "react";

/** Marks the header as stuck once the page scrolls, without pulling it out of the prerendered shell. */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) return;
		const onScroll = () => {
			header.dataset.stuck = window.scrollY > 12 ? "true" : "false";
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return null;
}
