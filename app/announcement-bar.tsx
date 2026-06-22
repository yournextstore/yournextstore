"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const messages = [
	"Complimentary shipping on orders over $75",
	"Free silk pouch with every bundle",
	"30-night sleep promise — love it or return it",
	"New: cocoa-bronze bonnet now in stock",
];

export function AnnouncementBar() {
	const [index, setIndex] = useState(0);
	const total = messages.length;
	const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

	return (
		<div className="bg-espresso text-cream relative">
			<div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase">
				<button
					type="button"
					onClick={() => go(-1)}
					aria-label="Previous announcement"
					className="opacity-70 hover:opacity-100 transition-opacity p-1"
				>
					<ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
				</button>
				<p className="text-center flex-1 truncate">{messages[index]}</p>
				<button
					type="button"
					onClick={() => go(1)}
					aria-label="Next announcement"
					className="opacity-70 hover:opacity-100 transition-opacity p-1"
				>
					<ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
				</button>
			</div>
		</div>
	);
}
