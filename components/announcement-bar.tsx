"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const MESSAGES = [
	"FREE DELIVERY FOR ORDERS OVER $125",
	"COMPLIMENTARY GIFT WRAPPING ON EVERY ORDER",
	"NEW SEASON EDIT — JUST LANDED",
];

export function AnnouncementBar() {
	const [dismissed, setDismissed] = useState(false);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setIndex((i) => (i + 1) % MESSAGES.length);
		}, 5000);
		return () => clearInterval(id);
	}, []);

	if (dismissed) return null;

	return (
		<div className="relative bg-[#1a1410] text-[#f5ede2]">
			<div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-[11px] font-medium uppercase tracking-[0.18em] sm:text-xs">
				<span className="truncate text-center">{MESSAGES[index]}</span>
			</div>
			<button
				type="button"
				onClick={() => setDismissed(true)}
				aria-label="Dismiss announcement"
				className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5ede2]/70 transition-colors hover:text-[#f5ede2]"
			>
				<XIcon className="h-3.5 w-3.5" />
			</button>
		</div>
	);
}
