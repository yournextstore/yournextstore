"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** The original's slide widths: 72.7% of the row on phones down to 30.3% on very wide screens. */
export const carouselSlide =
	"shrink-0 snap-start basis-[calc(72.666%-8px)] sm:basis-[calc(62.666%-8px)] md:basis-[calc(42.666%-8px)] wide:basis-[calc(33.333%-6px)] huge:basis-[calc(30.333%-8px)]";

/**
 * Solace's product carousel: heading on the left, two round tonal arrows on the right (from 640px,
 * hidden when everything fits), and a native scroll-snap track with 8px gutters.
 */
export function Carousel({
	title,
	children,
	footer,
	className,
}: {
	title: string;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

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
		const firstCard = track.firstElementChild;
		const step = firstCard ? firstCard.getBoundingClientRect().width + 8 : track.clientWidth * 0.8;
		track.scrollBy({ left: direction * step, behavior: "smooth" });
	};

	const arrow =
		"inline-flex size-12 items-center justify-center rounded-full bg-tonal transition-colors hover:bg-tonal-hover disabled:pointer-events-none disabled:text-muted-foreground";

	return (
		<section className={cn("shell section-y overflow-hidden", className)}>
			<div className="flex flex-col gap-6 sm:gap-12">
				<div className="flex min-h-12 items-start justify-between gap-4">
					<h2 className="text-heading-sm sm:text-heading-md">{title}</h2>
					<div className={cn("hidden gap-2 sm:flex", !canPrev && !canNext && "sm:hidden")}>
						<button
							type="button"
							onClick={() => scrollByCard(-1)}
							disabled={!canPrev}
							aria-label={`Previous: ${title}`}
							className={arrow}
						>
							<ArrowLeftIcon className="size-5" />
						</button>
						<button
							type="button"
							onClick={() => scrollByCard(1)}
							disabled={!canNext}
							aria-label={`Next: ${title}`}
							className={arrow}
						>
							<ArrowRightIcon className="size-5" />
						</button>
					</div>
				</div>
				<div
					ref={trackRef}
					className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain"
				>
					{children}
				</div>
				{footer}
			</div>
		</section>
	);
}
