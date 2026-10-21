"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Children, type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Soul's product carousel: cards a quarter of the row wide on desktop, a thin scroll-progress
 * bar bottom left and arrow buttons bottom right. Native horizontal scrolling with snap
 * points, so touch and trackpads work without a carousel library.
 */
export function ProductCarousel({ children, label }: { children: ReactNode; label: string }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState({ start: 0, size: 1 });
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const update = () => {
			const max = track.scrollWidth - track.clientWidth;
			const size = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1;
			setProgress({ start: max > 0 ? (track.scrollLeft / max) * (1 - size) : 0, size });
			setCanPrev(track.scrollLeft > 1);
			setCanNext(track.scrollLeft < max - 1);
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
		track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
	};

	const scrollable = progress.size < 0.999;

	return (
		<section aria-label={label}>
			<div
				ref={trackRef}
				className="no-scrollbar -ml-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:-ml-5"
			>
				{Children.map(children, (child) => (
					<div className="w-full min-w-0 shrink-0 snap-start pl-4 xs:w-1/2 md:w-1/3 md:pl-5 xl:w-1/4">
						{child}
					</div>
				))}
			</div>
			<div className="mt-10 flex w-full items-center justify-between gap-8">
				<div
					aria-hidden="true"
					className={`relative h-1 w-56 overflow-hidden rounded bg-contrast-100 ${scrollable ? "" : "invisible"}`}
				>
					<span
						className="absolute inset-y-0 rounded bg-foreground transition-[left] duration-150"
						style={{ left: `${progress.start * 100}%`, width: `${progress.size * 100}%` }}
					/>
				</div>
				<div className={`flex gap-2 ${scrollable ? "" : "invisible"}`}>
					<button
						type="button"
						onClick={() => scrollByPage(-1)}
						disabled={!canPrev}
						aria-label="Previous products"
						className="rounded-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:pointer-events-none disabled:opacity-25"
					>
						<ArrowLeft className="size-6" strokeWidth={1.5} />
					</button>
					<button
						type="button"
						onClick={() => scrollByPage(1)}
						disabled={!canNext}
						aria-label="Next products"
						className="rounded-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:pointer-events-none disabled:opacity-25"
					>
						<ArrowRight className="size-6" strokeWidth={1.5} />
					</button>
				</div>
			</div>
		</section>
	);
}
