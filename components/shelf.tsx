"use client";

import { type ReactNode, useRef } from "react";

const arrow =
	"grid h-11 w-11 place-items-center border border-white/30 text-[18px] text-white transition hover:border-white";

/**
 * Product slider: eyebrow and uppercase title on the left, square arrows on the right (desktop);
 * a snap row underneath that swipes on touch. The arrows scroll by one card.
 */
export function Shelf({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
	const track = useRef<HTMLElement>(null);
	const step = (dir: 1 | -1) => {
		const el = track.current;
		if (!el) return;
		const first = el.firstElementChild;
		const width = first instanceof HTMLElement ? first.offsetWidth + 20 : 320;
		el.scrollBy({ left: dir * width, behavior: "smooth" });
	};

	return (
		<>
			<div className="mb-7 flex items-end justify-between gap-4">
				<div className="min-w-0">
					<p className="mb-2 text-[12px] uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
					<h2 className="wrap-break-word font-display text-[clamp(21px,3vw,36px)] font-semibold uppercase leading-none tracking-[0.08em]">
						{title}
					</h2>
				</div>
				<div className="hidden shrink-0 gap-1.5 md:flex">
					<button type="button" onClick={() => step(-1)} className={arrow} aria-label="Scroll back">
						←
					</button>
					<button type="button" onClick={() => step(1)} className={arrow} aria-label="Scroll forward">
						→
					</button>
				</div>
			</div>
			<section
				ref={track}
				aria-label={title}
				className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-1 md:mx-0 md:scroll-px-0 md:px-0"
			>
				{children}
			</section>
		</>
	);
}
