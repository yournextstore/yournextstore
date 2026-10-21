"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

/** The original's black strip above the header: one message at a time, arrows and a slow rotation. */
export function AnnouncementBar({ messages }: { messages: string[] }) {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = messages.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), 6000);
		return () => window.clearInterval(timer);
	}, [count, paused]);

	if (count === 0) return null;

	return (
		<section
			aria-label="Announcements"
			className="bg-primary text-primary-foreground"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<div className="shell flex h-10 items-center justify-between gap-2">
				{count > 1 ? (
					<button
						type="button"
						onClick={() => setIndex((i) => (i - 1 + count) % count)}
						className="hidden h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-70 md:inline-flex"
						aria-label="Previous announcement"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
				) : (
					<span />
				)}
				<p className="min-w-0 flex-1 truncate text-center text-xs sm:text-sm">{messages[index]}</p>
				{count > 1 ? (
					<button
						type="button"
						onClick={() => setIndex((i) => (i + 1) % count)}
						className="hidden h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-70 md:inline-flex"
						aria-label="Next announcement"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				) : (
					<span />
				)}
			</div>
		</section>
	);
}
