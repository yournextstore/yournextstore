"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Rolling digit columns: each digit is a clipped 0–9 reel, everything else (units, separators,
 * currency) sits fixed. Reels rest at 0 and spin to the value once the readout is on screen; a new
 * value with the same shape rolls from the current digits, a new shape re-mounts and rolls from 0.
 */
export function Odometer({ value, className }: { value: string; className?: string }) {
	const mask = value.replace(/[0-9]/g, "#");
	return <Reels key={mask} value={value} className={className} />;
}

function Reels({ value, className }: { value: string; className?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const [rolled, setRolled] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					setRolled(true);
					io.disconnect();
				}
			},
			{ threshold: 0.4 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<span className={cn("tabular", className)}>
			<span className="sr-only">{value}</span>
			<span ref={ref} aria-hidden="true" className="odo">
				{Array.from(value).map((ch, i) =>
					ch >= "0" && ch <= "9" ? (
						<span key={i} className="odo-col">
							<span className="odo-reel" style={{ "--d": rolled ? Number(ch) : 0 } as React.CSSProperties}>
								{DIGITS.map((d) => (
									<span key={d} className="odo-d">
										{d}
									</span>
								))}
							</span>
						</span>
					) : (
						<span key={i} className="odo-fixed">
							{ch}
						</span>
					),
				)}
			</span>
		</span>
	);
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
