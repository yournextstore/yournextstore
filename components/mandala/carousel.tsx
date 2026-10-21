"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Children, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's Embla carousel as a native scroll-snap row: two cards per view on phones, three on
 * tablets, four from xl, with the small round arrows sitting just outside the content column.
 */
export function Carousel({
	children,
	label,
	className,
}: {
	children: ReactNode;
	label: string;
	className?: string;
}) {
	const trackRef = useRef<HTMLDivElement>(null);

	const scrollByPage = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		track.scrollBy({ left: direction * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
	};

	return (
		<section aria-label={label} className={cn("relative", className)}>
			<div
				ref={trackRef}
				className="-mx-4 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
			>
				{Children.toArray(children).map((child, index) => (
					<div
						key={index}
						className="relative w-1/2 shrink-0 snap-start pr-4 md:w-1/3 xl:w-1/4 [&:last-child]:pr-0"
					>
						{child}
					</div>
				))}
			</div>
			<button
				type="button"
				onClick={() => scrollByPage(-1)}
				aria-label="Previous products"
				className="absolute -left-4 top-[37%] wide:-left-12 hidden size-8 items-center justify-center rounded-full border border-border bg-white text-[#111827] shadow-sm transition-colors hover:bg-secondary lg:flex"
			>
				<ArrowLeft aria-hidden className="size-4" />
			</button>
			<button
				type="button"
				onClick={() => scrollByPage(1)}
				aria-label="Next products"
				className="absolute -right-4 top-[37%] wide:-right-12 hidden size-8 items-center justify-center rounded-full border border-border bg-white text-[#111827] shadow-sm transition-colors hover:bg-secondary lg:flex"
			>
				<ArrowRight aria-hidden className="size-4" />
			</button>
		</section>
	);
}
