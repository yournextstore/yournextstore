"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * FRNTR's product slider: a snapping row of tiles with the big black round arrow that sits on
 * the right edge of the row (and its twin on the left once the row has moved).
 */
export function ProductRail({ items, label }: { items: ReactNode[]; label: string }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [edges, setEdges] = useState({ start: true, end: true });

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => {
			const max = track.scrollWidth - track.clientWidth;
			setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft >= max - 4 });
		};
		update();
		track.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			track.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	const move = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
	};

	const arrow =
		"absolute top-[calc(50%-2.5rem)] z-10 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-2xl text-white transition-transform hover:scale-105 md:flex lg:size-20";

	return (
		<section aria-label={label} className="relative">
			<div
				ref={trackRef}
				className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:scroll-px-0 lg:px-0"
			>
				{items.map((item, index) => (
					<div key={index} className="w-[44%] shrink-0 snap-start sm:w-[31%] lg:w-[calc((100%-0.75rem)/3)]">
						{item}
					</div>
				))}
			</div>
			<button
				type="button"
				aria-label="See the previous item"
				onClick={() => move(-1)}
				className={cn(arrow, "left-2 rotate-180 xl:-left-5", edges.start && "md:hidden")}
			>
				<span aria-hidden="true">➞</span>
			</button>
			<button
				type="button"
				aria-label="See the next item"
				onClick={() => move(1)}
				className={cn(arrow, "right-2 xl:-right-5", edges.end && "md:hidden")}
			>
				<span aria-hidden="true">➞</span>
			</button>
		</section>
	);
}
