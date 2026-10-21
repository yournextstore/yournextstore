"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Horizontal rail with the original's heading row: title on the left, an optional button and
 * round arrow controls on the right (arrows from md). The track runs past the container to the
 * viewport's right edge, so the next card peeks in, and scrolls natively with snap points on
 * touch.
 */
export function Carousel({
	heading,
	button,
	children,
	className,
	label,
}: {
	heading: ReactNode;
	button?: ReactNode;
	children: ReactNode;
	className?: string;
	label: string;
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

	const scrollByPage = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		const firstCard = track.firstElementChild;
		const step = firstCard ? firstCard.getBoundingClientRect().width + 40 : track.clientWidth * 0.8;
		track.scrollBy({ left: direction * step, behavior: "smooth" });
	};

	return (
		<section aria-label={label} className={cn("overflow-hidden", className)}>
			<div className="layout">
				<div className="col-span-full">
					<div className="mb-8 flex justify-between gap-x-10 gap-y-6 max-sm:flex-col sm:items-center md:mb-15">
						{heading}
						<div className="flex shrink-0 md:gap-6">
							{button}
							<div className="flex gap-2 max-md:hidden">
								<button
									type="button"
									onClick={() => scrollByPage(-1)}
									disabled={!canPrev}
									aria-label="Previous"
									className="inline-flex size-10 items-center justify-center rounded-full border border-foreground transition-opacity disabled:opacity-50"
								>
									<ArrowLeftIcon className="size-6" />
								</button>
								<button
									type="button"
									onClick={() => scrollByPage(1)}
									disabled={!canNext}
									aria-label="Next"
									className="inline-flex size-10 items-center justify-center rounded-full border border-foreground transition-opacity disabled:opacity-50"
								>
									<ArrowRightIcon className="size-6" />
								</button>
							</div>
						</div>
					</div>
					<div
						ref={trackRef}
						className="no-scrollbar -mr-[calc((100vw-100%)/2)] flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pr-[calc((100vw-100%)/2)] md:gap-10"
					>
						{children}
					</div>
				</div>
			</div>
		</section>
	);
}
