"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveals for `[data-reveal]` children. Whatever is already on screen is marked visible
 * before the hiding rule is armed, so nothing above the fold flashes and nothing hides without JS.
 */
export function Reveals({ children, className }: { children: React.ReactNode; className?: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const root = ref.current;
		if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const nodes = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
		for (const node of nodes) {
			if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add("is-in");
		}
		root.dataset.revealArmed = "";
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add("is-in");
					io.unobserve(entry.target);
				}
			},
			{ threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
		);
		for (const node of nodes) {
			if (!node.classList.contains("is-in")) io.observe(node);
		}
		return () => io.disconnect();
	}, []);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}
