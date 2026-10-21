"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ReactNode, useRef } from "react";

/**
 * A titled, horizontally scrolling row with the original's small round prev/next buttons at the
 * title's end. The items are server-rendered; this only scrolls the track by one item.
 */
export function Rail({ title, children }: { title: string; children: ReactNode }) {
	const track = useRef<HTMLDivElement>(null);

	const scroll = (direction: 1 | -1) => {
		const el = track.current;
		const item = el?.firstElementChild;
		if (!el || !item) return;
		const step = item.getBoundingClientRect().width + 20;
		el.scrollBy({ left: direction * step, behavior: "smooth" });
	};

	const buttonClass =
		"flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition hover:bg-green-600 hover:text-white";

	return (
		<>
			<div className="mb-6 flex items-center justify-between gap-4">
				<h2 className="text-fc-lg">{title}</h2>
				<div className="flex gap-3">
					<button
						type="button"
						aria-label={`Scroll ${title} back`}
						onClick={() => scroll(-1)}
						className={buttonClass}
					>
						<ChevronLeftIcon className="size-4" aria-hidden />
					</button>
					<button
						type="button"
						aria-label={`Scroll ${title} forward`}
						onClick={() => scroll(1)}
						className={buttonClass}
					>
						<ChevronRightIcon className="size-4" aria-hidden />
					</button>
				</div>
			</div>
			<div
				ref={track}
				className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{children}
			</div>
		</>
	);
}
