"use client";

import { useEffect } from "react";

const ON = 50;

/**
 * The original's header behaviour, driven through the DOM so the header stays in the prerendered
 * shell: `data-sticky` once the page leaves the top (solid, compact, topbar tucked away), and
 * `data-hidden` while scrolling down, so the header slides back in as soon as the shopper scrolls up.
 */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.getElementById("site-header");
		if (!header) return;
		let last = window.scrollY;
		const update = () => {
			const y = window.scrollY;
			header.dataset.sticky = String(y >= ON);
			header.dataset.hidden = String(y > last && y > 400);
			last = y;
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return null;
}
