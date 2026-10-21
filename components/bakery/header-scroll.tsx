"use client";

import { useEffect } from "react";

/**
 * Fades the header's sand backdrop in and tightens its padding once the page scrolls (the
 * original's scroll effect). Renders nothing: it only flips `data-scrolled` on the header, so the
 * header itself stays a server component in the prerendered shell.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;
		const update = () => {
			header.dataset.scrolled = window.scrollY > 16 ? "true" : "false";
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
