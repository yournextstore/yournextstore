"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
	"Now available on Android and iOS",
	"Free shipping on orders over $50",
	"30-day no-questions-asked returns",
	"Join 35,000+ intentional makers",
];

export function AnnouncementBar() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setIndex((i) => (i + 1) % messages.length);
		}, 4500);
		return () => clearInterval(id);
	}, []);

	const go = (delta: number) => {
		setIndex((i) => (i + delta + messages.length) % messages.length);
	};

	return (
		<div className="bg-[color:var(--brick-lavender)] text-white text-xs sm:text-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-9">
					<button
						type="button"
						onClick={() => go(-1)}
						aria-label="Previous announcement"
						className="p-1 rounded-full hover:bg-white/15 transition-colors"
					>
						<ChevronLeft className="h-3.5 w-3.5" />
					</button>
					<p className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
						<svg
							aria-hidden
							viewBox="0 0 24 24"
							className="h-3.5 w-3.5 shrink-0"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						<span className="truncate">{messages[index]}</span>
					</p>
					<button
						type="button"
						onClick={() => go(1)}
						aria-label="Next announcement"
						className="p-1 rounded-full hover:bg-white/15 transition-colors"
					>
						<ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</div>
	);
}
