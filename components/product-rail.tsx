"use client";

import { type ReactNode, useRef } from "react";
import { ChevronIcon } from "@/components/icons";

/** A horizontally scrolling row of cards with round arrow buttons over its edges. */
export function ProductRail({ children, label }: { children: ReactNode; label: string }) {
	const ref = useRef<HTMLElement>(null);
	const scroll = (direction: 1 | -1) => {
		const el = ref.current;
		if (!el) return;
		el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: "smooth" });
	};

	return (
		<div className="relative">
			<section
				ref={ref}
				aria-label={label}
				className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:px-0"
			>
				{children}
			</section>
			<button
				type="button"
				onClick={() => scroll(-1)}
				aria-label="Scroll left"
				className="absolute top-1/2 -left-4 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-colors hover:bg-secondary md:flex"
			>
				<ChevronIcon className="size-4 rotate-90" />
			</button>
			<button
				type="button"
				onClick={() => scroll(1)}
				aria-label="Scroll right"
				className="absolute top-1/2 -right-4 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-colors hover:bg-secondary md:flex"
			>
				<ChevronIcon className="size-4 -rotate-90" />
			</button>
		</div>
	);
}
