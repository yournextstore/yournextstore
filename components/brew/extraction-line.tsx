"use client";

import { useEffect, useRef } from "react";

/** The original's scroll-linked copper fill down the left edge, with a vertical percentage readout. */
export function ExtractionLine() {
	const fill = useRef<HTMLSpanElement>(null);
	const pct = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		let ticking = false;
		const update = () => {
			ticking = false;
			const max = document.documentElement.scrollHeight - innerHeight;
			const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
			if (fill.current) fill.current.style.transform = `scaleY(${p})`;
			if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
		};
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		};
		addEventListener("scroll", onScroll, { passive: true });
		addEventListener("resize", onScroll);
		update();
		return () => {
			removeEventListener("scroll", onScroll);
			removeEventListener("resize", onScroll);
		};
	}, []);

	return (
		<div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 z-[45] w-0.5 bg-line">
			<span
				ref={fill}
				className="absolute inset-0 origin-top scale-y-0 bg-[linear-gradient(180deg,var(--md-hot),var(--md-accent)_40%,var(--md-oxide))] shadow-[0_0_10px_rgba(200,98,44,.5)]"
			/>
			<span
				ref={pct}
				className="font-readout absolute bottom-3 left-[9px] hidden rotate-180 text-[0.6rem] tracking-[0.14em] text-faint [writing-mode:vertical-rl] md:block"
			>
				0%
			</span>
		</div>
	);
}
