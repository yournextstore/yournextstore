"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Pilot's product rail: a heading (centred with its intro, or left-aligned), bare chevron arrows
 * on the right, and a native scroll-snap track of cards that peeks the next one in.
 */
export function Carousel({
	heading,
	intro,
	align = "center",
	label,
	children,
	className,
}: {
	heading: ReactNode;
	intro?: ReactNode;
	align?: "center" | "start";
	label: string;
	children: ReactNode;
	className?: string;
}) {
	const trackRef = useRef<HTMLUListElement>(null);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(true);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => {
			setCanPrev(track.scrollLeft > 1);
			setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
		};
		update();
		track.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update, { passive: true });
		return () => {
			track.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	const scrollByPage = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: "smooth" });
	};

	const arrows = (
		<div className="flex shrink-0 gap-1 max-md:hidden">
			<button
				type="button"
				onClick={() => scrollByPage(-1)}
				disabled={!canPrev}
				aria-label="Previous products"
				className="inline-flex size-9 items-center justify-center transition-opacity disabled:opacity-30"
			>
				<ChevronLeftIcon aria-hidden className="size-5" strokeWidth={1.5} />
			</button>
			<button
				type="button"
				onClick={() => scrollByPage(1)}
				disabled={!canNext}
				aria-label="Next products"
				className="inline-flex size-9 items-center justify-center transition-opacity disabled:opacity-30"
			>
				<ChevronRightIcon aria-hidden className="size-5" strokeWidth={1.5} />
			</button>
		</div>
	);

	return (
		<section aria-label={label} className={cn("page-x overflow-hidden", className)}>
			{align === "center" ? (
				<div className="mb-8 text-center md:mb-6">
					{heading}
					<div className="mt-4 flex items-end justify-center gap-6 md:justify-end">
						{intro ? <div className="mx-auto max-w-3xl md:pl-24">{intro}</div> : null}
						{arrows}
					</div>
				</div>
			) : (
				<div className="mb-6 flex items-center justify-between gap-6 md:mb-8">
					{heading}
					{arrows}
				</div>
			)}
			<ul
				ref={trackRef}
				className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 md:mx-0 md:scroll-px-0 md:px-0 md:gap-3"
			>
				{children}
			</ul>
		</section>
	);
}

/** One slide of the rail: two-and-a-bit cards on phones, four on desktop. */
export function CarouselItem({ children }: { children: ReactNode }) {
	return (
		<li className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-[calc((100%-1.5rem)/3.2)] lg:w-[calc((100%-2.25rem)/4.2)]">
			{children}
		</li>
	);
}
