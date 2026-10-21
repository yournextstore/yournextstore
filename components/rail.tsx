"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's swiper rows: a serif heading on the left, round grey arrow buttons on the
 * right, and a native scroll-snap track underneath. On phones the arrows move below the track.
 */
export function Rail({
	title,
	children,
	className,
	centered = false,
}: {
	title: string;
	children: ReactNode;
	className?: string;
	centered?: boolean;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
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

	const scrollByCard = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		const card = track.firstElementChild;
		const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
		track.scrollBy({ left: direction * step, behavior: "smooth" });
	};

	const arrows = (
		<div className="flex gap-3">
			<button
				type="button"
				onClick={() => scrollByCard(-1)}
				disabled={!canPrev}
				aria-label={`Previous: ${title}`}
				className="inline-flex size-11 items-center justify-center rounded-full bg-subtle text-foreground transition-colors hover:bg-subtle-2 disabled:opacity-50 md:size-9"
			>
				<ChevronLeft className="size-4" aria-hidden="true" />
			</button>
			<button
				type="button"
				onClick={() => scrollByCard(1)}
				disabled={!canNext}
				aria-label={`Next: ${title}`}
				className="inline-flex size-11 items-center justify-center rounded-full bg-subtle text-foreground transition-colors hover:bg-subtle-2 disabled:opacity-50 md:size-9"
			>
				<ChevronRight className="size-4" aria-hidden="true" />
			</button>
		</div>
	);

	return (
		<section aria-label={title} className={cn("container-page", className)}>
			<div
				className={cn(
					"mb-6 flex items-end gap-6 md:mb-8",
					centered ? "justify-center text-center" : "justify-between",
				)}
			>
				<h2 className="text-title-xl text-foreground">{title}</h2>
				{!centered && <div className="max-md:hidden">{arrows}</div>}
			</div>
			<div
				ref={trackRef}
				className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 md:-mx-10 md:scroll-px-10 md:px-10"
			>
				{children}
			</div>
			<div className={cn("mt-6 flex justify-center", !centered && "md:hidden")}>{arrows}</div>
		</section>
	);
}
