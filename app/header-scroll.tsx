"use client";

import { useEffect } from "react";

/** Turns the header white with a soft shadow once the page scrolls, as the original does. */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) return;
		const update = () => {
			header.dataset.scrolled = window.scrollY > 50 ? "true" : "false";
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
