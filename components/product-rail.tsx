"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RailTab = { key: string; label: string; items: ReactNode[] };

const arrowClass =
	"flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:bg-secondary disabled:cursor-default disabled:opacity-40";

/**
 * The original's slick carousels ("Best of …", "Highly recommended"): optional pill tabs on the
 * left, round prev/next on the right, three cards per view on desktop and a swipe row on phones.
 */
export function ProductRail({
	tabs,
	label,
	heading,
}: {
	tabs: RailTab[];
	label: string;
	heading?: ReactNode;
}) {
	const [active, setActive] = useState(tabs[0]?.key);
	const trackRef = useRef<HTMLDivElement>(null);
	const current = tabs.find((t) => t.key === active) ?? tabs[0];

	const scroll = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
	};

	if (!current) return null;

	return (
		<div>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				{heading}
				{tabs.length > 1 ? (
					<div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								type="button"
								role="tab"
								aria-selected={tab.key === current.key}
								onClick={() => {
									setActive(tab.key);
									trackRef.current?.scrollTo({ left: 0 });
								}}
								className={cn(
									"h-10 cursor-pointer rounded-md px-5 text-sm uppercase transition-colors",
									tab.key === current.key ? "bg-ink text-page" : "bg-[#e8ecf2] text-ink hover:bg-[#dbe2ec]",
								)}
							>
								{tab.label}
							</button>
						))}
					</div>
				) : (
					<span />
				)}
				<div className="ml-auto hidden gap-3 sm:flex">
					<button
						type="button"
						aria-label="Previous products"
						onClick={() => scroll(-1)}
						className={arrowClass}
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button type="button" aria-label="Next products" onClick={() => scroll(1)} className={arrowClass}>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>
			<div
				ref={trackRef}
				className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pt-1 pb-6 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
			>
				{current.items.map((item, index) => (
					<div
						key={index}
						className="w-[78%] shrink-0 snap-start xs:w-[62%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}
