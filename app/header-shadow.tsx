"use client";

import { useEffect } from "react";

/** The original drops a soft shadow under the bar once the page has scrolled 80px. */
export function HeaderShadow() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) return;
		const onScroll = () => {
			header.dataset.scrolled = window.scrollY >= 80 ? "true" : "false";
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return null;
}
