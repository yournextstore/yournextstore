"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, type ReactNode, useEffect, useRef, useState } from "react";

/**
 * The original's carousels (Embla there) as a native scroll-snap row: swipe on touch, arrow
 * buttons under the row on larger screens, page dots under the hero on phones.
 */
export function Carousel({
	label,
	children,
	hero = false,
}: {
	label: string;
	children: ReactNode;
	hero?: boolean;
}) {
	const track = useRef<HTMLDivElement>(null);
	const slides = Children.toArray(children);
	const [edges, setEdges] = useState({ start: true, end: slides.length < 2, index: 0 });

	useEffect(() => {
		const el = track.current;
		if (!el) return;
		const update = () => {
			const max = el.scrollWidth - el.clientWidth;
			setEdges({
				start: el.scrollLeft <= 2,
				end: el.scrollLeft >= max - 2,
				index: Math.round(el.scrollLeft / Math.max(1, el.clientWidth)),
			});
		};
		update();
		el.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			el.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	const go = (direction: 1 | -1) => {
		const el = track.current;
		if (!el) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const loopBack = hero && direction === 1 && edges.end;
		el.scrollTo({
			left: loopBack ? 0 : el.scrollLeft + direction * el.clientWidth,
			behavior: reduced ? "auto" : "smooth",
		});
	};

	return (
		<section aria-label={label} className={hero ? "hero-carousel" : "store-carousel"}>
			<div ref={track} className="carousel-track">
				{slides.map((slide, i) => (
					<div key={i} className="carousel-slide">
						{slide}
					</div>
				))}
			</div>
			{slides.length > 1 && (
				<div className="carousel-controls">
					<button
						type="button"
						aria-label="Previous slide"
						onClick={() => go(-1)}
						disabled={edges.start && !hero}
					>
						<ChevronLeft size={18} aria-hidden />
					</button>
					<button type="button" aria-label="Next slide" onClick={() => go(1)} disabled={edges.end && !hero}>
						<ChevronRight size={18} aria-hidden />
					</button>
				</div>
			)}
			{hero && slides.length > 1 && (
				<div className="carousel-dots" aria-hidden>
					{slides.map((_, i) => (
						<span key={i} data-active={i === edges.index || undefined} />
					))}
				</div>
			)}
		</section>
	);
}
