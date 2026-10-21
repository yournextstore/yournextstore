"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_BUTTON =
	"absolute top-[calc(50%-3rem)] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-[colors,opacity] hover:bg-gray-100 hover:text-gray-900";

/**
 * Scroll-snap row: one card per view on phones, then 2/3/4 at sm/md/lg with 24px gaps, the
 * same steps as the original's Swiper. Arrows page by one card and hide at either end.
 */
export function ProductCarousel({ children, label }: { children: ReactNode; label: string }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [atStart, setAtStart] = useState(true);
	const [atEnd, setAtEnd] = useState(false);

	const update = () => {
		const el = trackRef.current;
		if (!el) return;
		setAtStart(el.scrollLeft <= 4);
		setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
	};

	useEffect(() => {
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	});

	const page = (direction: 1 | -1) => {
		const el = trackRef.current;
		const slide = el?.firstElementChild;
		if (!el || !(slide instanceof HTMLElement)) return;
		el.scrollBy({ left: direction * (slide.offsetWidth + 24), behavior: "smooth" });
	};

	return (
		<div className="relative">
			<button
				type="button"
				aria-label="Previous products"
				onClick={() => page(-1)}
				disabled={atStart}
				className={cn(NAV_BUTTON, "-left-2 sm:-left-5", atStart && "pointer-events-none opacity-0")}
			>
				<ChevronLeft className="size-5" aria-hidden />
			</button>
			<button
				type="button"
				aria-label="Next products"
				onClick={() => page(1)}
				disabled={atEnd}
				className={cn(NAV_BUTTON, "-right-2 sm:-right-5", atEnd && "pointer-events-none opacity-0")}
			>
				<ChevronRight className="size-5" aria-hidden />
			</button>
			<section
				ref={trackRef}
				onScroll={update}
				aria-label={label}
				className="no-scrollbar -m-1 flex snap-x snap-mandatory gap-6 overflow-x-auto p-1"
			>
				{Children.map(children, (child) => (
					<div className="w-full shrink-0 snap-start sm:w-[calc((100%-24px)/2)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)]">
						{child}
					</div>
				))}
			</section>
		</div>
	);
}
