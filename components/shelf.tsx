"use client";

import { type ReactNode, useRef } from "react";

function Arrow({ direction }: { direction: "prev" | "next" }) {
	return (
		<svg
			aria-hidden
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
		</svg>
	);
}

/** Product slider: a snap row that swipes on touch; round arrows scroll one card on desktop. */
export function Shelf({ label, children }: { label: string; children: ReactNode }) {
	const track = useRef<HTMLElement>(null);
	const step = (dir: 1 | -1) => {
		const el = track.current;
		if (!el) return;
		const first = el.firstElementChild;
		const width = first instanceof HTMLElement ? first.offsetWidth + 20 : 320;
		el.scrollBy({ left: dir * width, behavior: "smooth" });
	};
	const arrow =
		"absolute top-1/2 hidden -translate-y-1/2 rounded-full border border-border bg-background p-2.5 text-foreground shadow-lg transition hover:border-brass hover:text-brass md:block";

	return (
		<div className="relative mt-6">
			<section
				ref={track}
				aria-label={label}
				className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:scroll-px-0 md:px-0"
			>
				{children}
			</section>
			<button type="button" onClick={() => step(-1)} className={`${arrow} -left-3`} aria-label="Scroll back">
				<Arrow direction="prev" />
			</button>
			<button
				type="button"
				onClick={() => step(1)}
				className={`${arrow} -right-3`}
				aria-label="Scroll forward"
			>
				<Arrow direction="next" />
			</button>
		</div>
	);
}
