"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, type ReactNode, useRef } from "react";

/**
 * The original's ProductCarousel: title and subtitle with an inline "View all" on the left, two
 * small round arrows on the right, and a snap-scrolling row of cards (four across on desktop).
 */
export function Carousel({
	title,
	subtitle,
	action,
	label,
	children,
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	action?: ReactNode;
	label: string;
	children: ReactNode;
}) {
	const listRef = useRef<HTMLUListElement>(null);

	const scroll = (direction: 1 | -1) => {
		const list = listRef.current;
		if (!list) return;
		const first = list.firstElementChild;
		const step = first ? first.getBoundingClientRect().width + 24 : list.clientWidth * 0.8;
		list.scrollBy({ left: step * direction, behavior: "smooth" });
	};

	const arrow =
		"flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-secondary";

	return (
		<div>
			<div className="flex items-end justify-between gap-6">
				<div>
					<h2 className="text-3xl leading-tight text-foreground md:text-4xl">{title}</h2>
					<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
						{subtitle && <p className="text-base text-muted-foreground md:text-lg">{subtitle}</p>}
						{action}
					</div>
				</div>
				<div className="hidden shrink-0 gap-2 sm:flex">
					<button type="button" onClick={() => scroll(-1)} aria-label={`Previous ${label}`} className={arrow}>
						<ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
					</button>
					<button type="button" onClick={() => scroll(1)} aria-label={`Next ${label}`} className={arrow}>
						<ChevronRight className="h-4 w-4" strokeWidth={1.5} />
					</button>
				</div>
			</div>
			<ul
				ref={listRef}
				aria-label={label}
				className="scrollbar-none -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mt-12 md:gap-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
			>
				{Children.map(children, (child) => (
					<li className="w-[calc((100%-1rem)/1.6)] shrink-0 snap-start sm:w-[calc((100%-1rem)/2.4)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]">
						{child}
					</li>
				))}
			</ul>
		</div>
	);
}
