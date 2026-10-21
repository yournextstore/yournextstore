"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Blueprint's product/tiles slider: a scroll-snap row with round white arrow buttons over the
 * photos. The items are server-rendered; this only moves the row.
 */
export function Slider({
	children,
	label,
	className,
	arrowTop = "38%",
}: {
	children: ReactNode;
	label: string;
	className?: string;
	/** Where the arrows sit vertically: the middle of the photo, not of the whole card. */
	arrowTop?: string;
}) {
	const rowRef = useRef<HTMLUListElement>(null);
	const [edges, setEdges] = useState({ start: true, end: false });

	useEffect(() => {
		const row = rowRef.current;
		if (!row) return;
		const update = () => {
			setEdges({
				start: row.scrollLeft <= 4,
				end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 4,
			});
		};
		update();
		row.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			row.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	const move = (direction: 1 | -1) => {
		const row = rowRef.current;
		if (!row) return;
		row.scrollBy({ left: direction * row.clientWidth * 0.9, behavior: "smooth" });
	};

	const arrow =
		"absolute z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_1px_4px_rgb(0_0_0/0.2)] transition-opacity disabled:opacity-0 md:flex";

	return (
		<section aria-label={label} className={cn("relative", className)}>
			<ul
				ref={rowRef}
				className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 md:mx-0 md:scroll-px-0 md:gap-5 md:px-0"
			>
				{children}
			</ul>
			<button
				type="button"
				aria-label="Previous slide"
				disabled={edges.start}
				onClick={() => move(-1)}
				className={cn(arrow, "-left-3 xl:-left-5")}
				style={{ top: arrowTop }}
			>
				<ArrowLeft className="size-5" strokeWidth={1.5} aria-hidden />
			</button>
			<button
				type="button"
				aria-label="Next slide"
				disabled={edges.end}
				onClick={() => move(1)}
				className={cn(arrow, "-right-3 xl:-right-5")}
				style={{ top: arrowTop }}
			>
				<ArrowRight className="size-5" strokeWidth={1.5} aria-hidden />
			</button>
		</section>
	);
}
