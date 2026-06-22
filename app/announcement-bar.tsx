"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
	"Buy 6 soaps, save $6.",
	"Free shipping on orders over $35.",
	"Subscribe & Save 15% on every order.",
	"Naturally good. Iconically scented.",
];

export function AnnouncementBar() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setIndex((i) => (i + 1) % messages.length);
		}, 4500);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="bg-[#1a1a2e] text-[#fdf6ee] text-xs sm:text-sm">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-10 flex items-center justify-between gap-4">
				<button
					type="button"
					aria-label="Previous announcement"
					onClick={() => setIndex((i) => (i - 1 + messages.length) % messages.length)}
					className="p-1 rounded-full hover:bg-white/10 transition-colors"
				>
					<ChevronLeft className="w-4 h-4" />
				</button>
				<p
					key={index}
					className="tracking-wide animate-in fade-in slide-in-from-bottom-1 duration-500 truncate"
				>
					{messages[index]}
				</p>
				<button
					type="button"
					aria-label="Next announcement"
					onClick={() => setIndex((i) => (i + 1) % messages.length)}
					className="p-1 rounded-full hover:bg-white/10 transition-colors"
				>
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
