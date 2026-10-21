"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The goods shelf: an honest sideways row (the original's own mobile and reduced-motion mode)
 * that a mouse can grab and drag, with the thin denim progress line underneath.
 */
export function Shelf({ children, className }: { children: React.ReactNode; className?: string }) {
	const track = useRef<HTMLDivElement>(null);
	const bar = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = track.current;
		if (!el) return;
		const update = () => {
			const max = el.scrollWidth - el.clientWidth;
			const progress = max > 0 ? el.scrollLeft / max : 1;
			if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.04, progress).toFixed(4)})`;
		};
		update();
		el.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);

		let dragging = false;
		let moved = 0;
		let lastX = 0;
		const down = (e: PointerEvent) => {
			if (e.pointerType !== "mouse" || e.button !== 0) return;
			dragging = true;
			moved = 0;
			lastX = e.clientX;
		};
		const move = (e: PointerEvent) => {
			if (!dragging) return;
			const dx = e.clientX - lastX;
			lastX = e.clientX;
			moved += Math.abs(dx);
			if (moved > 4) {
				el.dataset.dragging = "true";
				el.scrollLeft -= dx;
			}
		};
		const up = () => {
			dragging = false;
			// Let the click that ends a drag land first, then swallow it if the row moved.
			requestAnimationFrame(() => {
				delete el.dataset.dragging;
			});
		};
		const click = (e: MouseEvent) => {
			if (moved > 4) {
				e.preventDefault();
				e.stopPropagation();
				moved = 0;
			}
		};
		el.addEventListener("pointerdown", down);
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		el.addEventListener("click", click, true);
		return () => {
			el.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
			el.removeEventListener("pointerdown", down);
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			el.removeEventListener("click", click, true);
		};
	}, []);

	return (
		<div className={className}>
			<div
				ref={track}
				className={cn(
					"flex snap-x snap-proximity gap-[clamp(16px,2vw,26px)] overflow-x-auto scroll-px-[clamp(18px,4vw,44px)] px-[clamp(18px,4vw,44px)] pb-[26px] pt-[18px] md:cursor-grab",
					"data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none data-[dragging=true]:select-none",
					"[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line",
				)}
			>
				{children}
			</div>
			<div
				aria-hidden="true"
				className="mx-[clamp(18px,4vw,44px)] mt-1.5 h-0.5 overflow-hidden rounded-full bg-line"
			>
				<i ref={bar} className="block h-full origin-left scale-x-[0.04] bg-denim" />
			</div>
		</div>
	);
}
