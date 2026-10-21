"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Amerta's carousel section: heading left, a short paragraph in the middle, round arrows on
 * the right, and a snap-scrolling row of cards below (4 across on desktop).
 */
export function Rail({
	heading,
	description,
	action,
	label,
	children,
	itemClassName,
}: {
	heading: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	label: string;
	children: ReactNode;
	itemClassName?: string;
}) {
	const listRef = useRef<HTMLUListElement>(null);

	const scroll = (direction: 1 | -1) => {
		const list = listRef.current;
		if (!list) return;
		const first = list.firstElementChild;
		const step = first ? first.getBoundingClientRect().width + 20 : list.clientWidth * 0.8;
		list.scrollBy({ left: step * direction, behavior: "smooth" });
	};

	return (
		<div>
			<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-12">
					{heading}
					{action}
				</div>
				<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:flex-1 lg:justify-end lg:gap-16">
					{description && <p className="max-w-sm text-sm/6 text-muted-foreground">{description}</p>}
					<div className="flex shrink-0 justify-end gap-2">
						<button
							type="button"
							onClick={() => scroll(-1)}
							aria-label={`Previous ${label}`}
							className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground transition-colors hover:bg-secondary"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => scroll(1)}
							aria-label={`Next ${label}`}
							className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground transition-colors hover:bg-secondary"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
			<ul
				ref={listRef}
				aria-label={label}
				className="rail -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 sm:mx-0 sm:mt-12 sm:scroll-px-0 sm:px-0"
			>
				{Children.map(children, (child) => (
					<li
						className={cn(
							"w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]",
							itemClassName,
						)}
					>
						{child}
					</li>
				))}
			</ul>
		</div>
	);
}
