"use client";

import { type ReactNode, useRef } from "react";

/** A titled arrow carousel: a native scroll strip with ghost ← → buttons, as on the original home. */
export function Carousel({ title, id, children }: { title: string; id: string; children: ReactNode }) {
	const track = useRef<HTMLDivElement>(null);
	const scroll = (direction: 1 | -1) => {
		const el = track.current;
		if (!el) return;
		el.scrollBy({ left: direction * Math.max(320, el.clientWidth * 0.7), behavior: "smooth" });
	};

	return (
		<section aria-labelledby={id} className="pt-20 sm:pt-28">
			<div className="mx-auto mb-8 flex max-w-[1640px] items-end justify-between px-4 sm:px-5 lg:px-9">
				<h2 id={id} className="text-[15px] font-normal uppercase tracking-[0.26em]">
					{title}
				</h2>
				<div className="flex gap-2.5">
					<button
						type="button"
						aria-label={`Previous ${title.toLowerCase()}`}
						onClick={() => scroll(-1)}
						className="flex size-[38px] cursor-pointer items-center justify-center border border-line text-[13px] transition-colors hover:border-foreground"
					>
						←
					</button>
					<button
						type="button"
						aria-label={`Next ${title.toLowerCase()}`}
						onClick={() => scroll(1)}
						className="flex size-[38px] cursor-pointer items-center justify-center border border-line text-[13px] transition-colors hover:border-foreground"
					>
						→
					</button>
				</div>
			</div>
			<div
				ref={track}
				className="no-scrollbar flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 sm:scroll-px-5 sm:px-5 lg:scroll-px-9 lg:px-9"
			>
				{children}
			</div>
		</section>
	);
}
