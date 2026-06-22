"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const MESSAGES = [
	"No subscription required",
	"Free shipping on orders over $50",
	"Built to last — backed by a 2-year guarantee",
	"Ships from Brooklyn within 48 hours",
];

export function AnnouncementBar() {
	const [index, setIndex] = useState(0);

	const prev = () => setIndex((i) => (i - 1 + MESSAGES.length) % MESSAGES.length);
	const next = () => setIndex((i) => (i + 1) % MESSAGES.length);

	return (
		<div className="relative bg-black border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-8 text-[11px] tracking-[0.18em] uppercase text-bone/70">
					<button
						type="button"
						onClick={prev}
						aria-label="Previous announcement"
						className="p-1 hover:text-bone transition-colors"
					>
						<ChevronLeft className="h-3.5 w-3.5" />
					</button>
					<p className="font-medium text-center flex-1 truncate">{MESSAGES[index]}</p>
					<button
						type="button"
						onClick={next}
						aria-label="Next announcement"
						className="p-1 hover:text-bone transition-colors"
					>
						<ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</div>
	);
}
