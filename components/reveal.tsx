"use client";

import { useEffect } from "react";

/**
 * Scroll reveals: every `[data-reveal]` target gets `is-in` once it enters the viewport and is
 * unobserved after firing. New targets from client navigations are picked up by watching
 * `<main>`. Does nothing unless the head script turned motion on (not with reduced motion).
 */
export function Reveal() {
	useEffect(() => {
		if (document.documentElement.dataset.motion !== "on") return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add("is-in");
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0 },
		);
		const observeAll = () => {
			for (const node of document.querySelectorAll("[data-reveal]:not(.is-in)")) {
				observer.observe(node);
			}
		};
		observeAll();
		const main = document.getElementById("main-content");
		const mutations = new MutationObserver(observeAll);
		if (main) mutations.observe(main, { childList: true, subtree: true });
		const footer = document.querySelector("footer");
		if (footer) mutations.observe(footer, { childList: true, subtree: true });
		return () => {
			observer.disconnect();
			mutations.disconnect();
		};
	}, []);
	return null;
}
