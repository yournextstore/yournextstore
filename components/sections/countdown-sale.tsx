"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function useCountdown(targetDate: Date | null) {
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	useEffect(() => {
		if (!targetDate) return;
		const tick = () => {
			const now = Date.now();
			const distance = targetDate.getTime() - now;

			if (distance <= 0) {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
				return;
			}

			setTimeLeft({
				days: Math.floor(distance / (1000 * 60 * 60 * 24)),
				hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
				minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
				seconds: Math.floor((distance % (1000 * 60)) / 1000),
			});
		};

		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [targetDate]);

	return timeLeft;
}

export function CountdownSale() {
	// Sale ends 30 days from now. Read in the browser after mount: the clock is not a prerender value,
	// so the section prerenders with zeros and ticks once hydrated.
	const [targetDate, setTargetDate] = useState<Date | null>(null);
	useEffect(() => {
		const d = new Date();
		d.setDate(d.getDate() + 30);
		setTargetDate(d);
	}, []);
	const { days, hours, minutes, seconds } = useCountdown(targetDate);

	const pad = (n: number) => String(n).padStart(2, "0");

	return (
		<section className="relative overflow-hidden bg-foreground text-primary-foreground min-h-[50vh] flex items-center">
			{/* Background image */}
			<div className="absolute inset-0">
				<Image
					src="/scraped-14.jpg"
					alt="Final Sale"
					fill
					className="object-cover opacity-40"
					sizes="100vw"
				/>
			</div>

			<div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
				<div className="text-center">
					<span className="text-xs tracking-[0.3em] uppercase text-primary-foreground/70 font-medium">
						Up to 50% off
					</span>
					<h2 className="text-3xl sm:text-5xl font-medium mt-3 mb-8 tracking-tight">FINAL SALE</h2>

					{/* Countdown */}
					<div className="flex items-center justify-center gap-4 sm:gap-6 mb-10">
						{[
							{ value: pad(days), label: "Days" },
							{ value: pad(hours), label: "Hours" },
							{ value: pad(minutes), label: "Minutes" },
							{ value: pad(seconds), label: "Seconds" },
						].map((item) => (
							<div key={item.label} className="text-center">
								<div className="text-3xl sm:text-5xl font-medium tabular-nums">{item.value}</div>
								<div className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/60 mt-1">
									{item.label}
								</div>
							</div>
						))}
					</div>

					<Link
						href="/products"
						className="inline-flex items-center justify-center px-10 py-3.5 bg-white text-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/90 transition-colors"
					>
						GO GET IT!
					</Link>
				</div>
			</div>
		</section>
	);
}
