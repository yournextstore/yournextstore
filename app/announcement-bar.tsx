"use client";

import { useEffect, useState } from "react";

function getNextSundayMidnight() {
	const now = new Date();
	const target = new Date(now);
	const day = now.getDay();
	const daysUntilSunday = day === 0 ? 7 : 7 - day;
	target.setDate(now.getDate() + daysUntilSunday);
	target.setHours(0, 0, 0, 0);
	return target.getTime();
}

function pad(n: number) {
	return n.toString().padStart(2, "0");
}

export function AnnouncementBar() {
	const [remaining, setRemaining] = useState<{ h: number; m: number; s: number } | null>(null);

	useEffect(() => {
		const target = getNextSundayMidnight();
		const tick = () => {
			const diff = Math.max(0, target - Date.now());
			const totalSeconds = Math.floor(diff / 1000);
			setRemaining({
				h: Math.floor(totalSeconds / 3600),
				m: Math.floor((totalSeconds % 3600) / 60),
				s: totalSeconds % 60,
			});
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	return (
		<div
			className="bg-charcoal text-bone w-full"
			style={{ background: "var(--charcoal)", color: "var(--bone)" }}
		>
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-center gap-6 text-[11px] sm:text-[12px] tracking-[0.22em] uppercase">
				<span className="hidden md:inline opacity-80">Complimentary worldwide shipping</span>
				<span className="hidden md:inline-block h-3 w-px bg-bone/30" aria-hidden="true" />
				<span className="flex items-center gap-2">
					<span
						className="inline-block w-1.5 h-1.5 rounded-full bg-clay animate-ticker-pulse"
						aria-hidden="true"
					/>
					<span className="font-medium">25% off Summer Edit · Code SUMMER25</span>
				</span>
				<span className="hidden md:inline-block h-3 w-px bg-bone/30" aria-hidden="true" />
				<span className="hidden md:flex items-center gap-1.5 tabular-nums">
					Ends in
					<span className="font-medium text-clay">
						{remaining ? `${pad(remaining.h)}:${pad(remaining.m)}:${pad(remaining.s)}` : "--:--:--"}
					</span>
				</span>
			</div>
		</div>
	);
}
