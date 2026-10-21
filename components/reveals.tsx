"use client";

import { useEffect } from "react";

/**
 * The original's scroll reveals: `.reveal` blocks fade up once they enter the viewport. Renders
 * nothing; watches <body> for blocks that arrive with client navigation. Without scripts the
 * `.js` class is never set and everything shows at once.
 */
export function Reveals() {
	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-in");
						io.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
		);
		const scan = () => {
			for (const el of document.querySelectorAll(".reveal:not(.is-in)")) io.observe(el);
		};
		scan();
		const mo = new MutationObserver(scan);
		mo.observe(document.body, { childList: true, subtree: true });
		return () => {
			io.disconnect();
			mo.disconnect();
		};
	}, []);

	return null;
}
