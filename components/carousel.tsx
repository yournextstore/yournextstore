"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's product swimlane: a snap-scrolling row (three across on desktop, a peeking
 * second card on phones) with two small square chips centred underneath.
 */
export function Carousel({
	label,
	children,
	itemClassName,
}: {
	label: string;
	children: ReactNode;
	itemClassName?: string;
}) {
	const listRef = useRef<HTMLUListElement>(null);

	const scroll = (direction: 1 | -1) => {
		const list = listRef.current;
		if (!list) return;
		const first = list.firstElementChild;
		const step = first ? first.getBoundingClientRect().width + 12 : list.clientWidth * 0.8;
		list.scrollBy({ left: step * direction, behavior: "smooth" });
	};

	const arrow =
		"flex h-10 w-10 items-center justify-center rounded-md bg-chip text-muted-foreground transition-colors hover:bg-chip-hover";

	return (
		<div>
			<ul
				ref={listRef}
				aria-label={label}
				className="scrollbar-none -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:mx-0 md:scroll-px-0 md:px-0"
			>
				{Children.map(children, (child) => (
					<li
						className={cn(
							"w-[calc((100%-0.75rem)/1.3)] shrink-0 snap-start sm:w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-1.5rem)/3)]",
							itemClassName,
						)}
					>
						{child}
					</li>
				))}
			</ul>
			<div className="mt-8 flex justify-center gap-2">
				<button type="button" onClick={() => scroll(-1)} aria-label={`Previous ${label}`} className={arrow}>
					<ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
				</button>
				<button type="button" onClick={() => scroll(1)} aria-label={`Next ${label}`} className={arrow}>
					<ChevronRight className="h-4 w-4" strokeWidth={1.5} />
				</button>
			</div>
		</div>
	);
}
