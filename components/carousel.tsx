"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's Embla carousel as a native scroll-snap row: slides stay server-rendered, and
 * the progress bar + arrows below drive the scroll position. Controls show on mobile only
 * (like the original) unless `desktopControls` says the row overflows on desktop too.
 */
export function Carousel({
	children,
	label,
	itemClassName,
	tone = "light",
	desktopControls = false,
	className,
}: {
	children: ReactNode;
	label: string;
	itemClassName?: string;
	tone?: "light" | "dark";
	desktopControls?: boolean;
	className?: string;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
	const slides = Children.toArray(children);
	const [progress, setProgress] = useState({ start: 0, size: 1 / Math.max(1, slides.length) });

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => {
			const { scrollLeft, scrollWidth, clientWidth } = track;
			setProgress({
				start: scrollWidth > 0 ? scrollLeft / scrollWidth : 0,
				size: scrollWidth > 0 ? clientWidth / scrollWidth : 1,
			});
		};
		update();
		track.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			track.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	const step = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		const slide = track.firstElementChild;
		const distance = slide ? slide.getBoundingClientRect().width : track.clientWidth;
		track.scrollBy({ left: direction * distance, behavior: "smooth" });
	};

	return (
		<section aria-label={label} className={cn("w-full", className)}>
			<div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
				{slides.map((slide, index) => (
					<div key={index} className={cn("shrink-0 snap-start", itemClassName)}>
						{slide}
					</div>
				))}
			</div>
			<div className={cn("mt-4 flex items-center justify-between", !desktopControls && "sm:hidden")}>
				<div
					aria-hidden
					className={cn("relative h-1 w-1/2 rounded-full", tone === "dark" ? "bg-ink-line" : "bg-border")}
				>
					<div
						className={cn(
							"absolute inset-y-0 rounded-full transition-[left,width] duration-200",
							tone === "dark" ? "bg-ink-foreground" : "bg-primary",
						)}
						style={{ left: `${progress.start * 100}%`, width: `${progress.size * 100}%` }}
					/>
				</div>
				<div className="flex">
					<button
						type="button"
						onClick={() => step(-1)}
						aria-label="Previous"
						className="inline-flex size-8 items-center justify-center rounded-xs hover:bg-tonal"
					>
						<ArrowLeftIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
					</button>
					<button
						type="button"
						onClick={() => step(1)}
						aria-label="Next"
						className="inline-flex size-8 items-center justify-center rounded-xs hover:bg-tonal"
					>
						<ArrowRightIcon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
					</button>
				</div>
			</div>
		</section>
	);
}
