"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const arrowClassName =
	"absolute top-[calc(50%-2.75rem)] z-10 hidden size-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-sand sm:flex";

/**
 * The original's product carousel: a native scroll track with snap points and a small round
 * arrow over each edge that appears only while there is more to scroll that way.
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

	const scrollByPage = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: "smooth" });
	};

	return (
		<section aria-label={label} className={cn("relative", className)}>
			<div
				ref={trackRef}
				className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain lg:gap-5"
			>
				{children}
			</div>
			{canPrev && (
				<button
					type="button"
					onClick={() => scrollByPage(-1)}
					aria-label="Previous products"
					className={cn(arrowClassName, "-left-4")}
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
				</button>
			)}
			{canNext && (
				<button
					type="button"
					onClick={() => scrollByPage(1)}
					aria-label="Next products"
					className={cn(arrowClassName, "-right-4")}
				>
					<ArrowRight className="size-4" aria-hidden="true" />
				</button>
			)}
		</section>
	);
}
