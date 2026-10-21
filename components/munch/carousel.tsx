"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's Embla rows as a native scroll-snap track: heading on the left, two small
 * outlined arrows on the right (desktop), and on phones an optional progress rule under the row.
 */
export function Carousel({
	title,
	label,
	children,
	footer,
	showArrows = true,
	showProgress = false,
	className,
	trackClassName,
}: {
	title?: ReactNode;
	/** Accessible name of the row, for the arrow buttons. */
	label: string;
	children: ReactNode;
	footer?: ReactNode;
	showArrows?: boolean;
	showProgress?: boolean;
	className?: string;
	trackClassName?: string;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => {
			const max = track.scrollWidth - track.clientWidth;
			setCanPrev(track.scrollLeft > 1);
			setCanNext(track.scrollLeft < max - 1);
			const visible = track.clientWidth / Math.max(track.scrollWidth, 1);
			setProgress(max > 0 ? visible + (1 - visible) * (track.scrollLeft / max) : 1);
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
		const first = track.firstElementChild;
		const step = first ? first.getBoundingClientRect().width + 8 : track.clientWidth * 0.8;
		track.scrollBy({ left: direction * step, behavior: "smooth" });
	};

	const arrow =
		"inline-flex size-6 items-center justify-center rounded-full border-[1.5px] border-brand text-brand transition-colors hover:bg-brand hover:text-paper disabled:pointer-events-none disabled:opacity-40";

	return (
		<section className={cn("mx-auto w-full max-w-[1440px] py-2xl", className)}>
			{(title || showArrows) && (
				<div className="mb-xs flex items-center justify-between gap-4 px-m lg:px-xl">
					{title}
					{showArrows && (
						<div className="hidden gap-2 lg:flex">
							<button
								type="button"
								onClick={() => scrollByCard(-1)}
								disabled={!canPrev}
								aria-label={`Previous: ${label}`}
								className={arrow}
							>
								<ChevronLeftIcon aria-hidden="true" className="size-3.5" strokeWidth={2} />
							</button>
							<button
								type="button"
								onClick={() => scrollByCard(1)}
								disabled={!canNext}
								aria-label={`Next: ${label}`}
								className={arrow}
							>
								<ChevronRightIcon aria-hidden="true" className="size-3.5" strokeWidth={2} />
							</button>
						</div>
					)}
				</div>
			)}
			<div
				ref={trackRef}
				className={cn(
					"no-scrollbar flex snap-x snap-mandatory scroll-px-m gap-2 overflow-x-auto overscroll-x-contain px-m py-1 lg:scroll-px-xl lg:px-xl",
					trackClassName,
				)}
			>
				{children}
			</div>
			{showProgress && (
				<div className="relative mx-auto mt-2xl h-0.5 w-[13.4rem] overflow-hidden bg-brand-tint lg:hidden">
					<div
						className="absolute inset-y-0 left-0 w-full origin-left bg-brand transition-transform duration-300 ease-out"
						style={{ transform: `scaleX(${progress})` }}
					/>
				</div>
			)}
			{footer && <div className="mt-2xl px-m lg:px-xl">{footer}</div>}
		</section>
	);
}
