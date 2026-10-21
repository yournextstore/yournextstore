"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-entry reveal (IntersectionObserver, transform + opacity only). Server HTML is fully
 * visible; after hydration only blocks still below the fold are armed, so nothing above the
 * fold flashes and nothing is hidden without JavaScript.
 */
export function Reveal({
	children,
	delay = 0,
	className,
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
		el.dataset.reveal = "armed";
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const target = entry.target as HTMLElement;
						target.style.transitionDelay = `${delay}ms`;
						target.dataset.reveal = "in";
						io.unobserve(target);
					}
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [delay]);

	return (
		<div ref={ref} className={cn("aq-reveal", className)}>
			{children}
		</div>
	);
}
