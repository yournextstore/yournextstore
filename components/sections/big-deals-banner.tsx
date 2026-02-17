"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

function useCountdown(targetDate: Date) {
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

	useEffect(() => {
		const calculate = () => {
			const diff = targetDate.getTime() - Date.now();
			if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
			return {
				days: Math.floor(diff / (1000 * 60 * 60 * 24)),
				hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
				mins: Math.floor((diff / (1000 * 60)) % 60),
				secs: Math.floor((diff / 1000) % 60),
			};
		};
		setTimeLeft(calculate());
		const interval = setInterval(() => setTimeLeft(calculate()), 1000);
		return () => clearInterval(interval);
	}, [targetDate]);

	return timeLeft;
}

export function BigDealsBanner() {
	const [targetDate] = useState(() => new Date(Date.now() + 216 * 24 * 60 * 60 * 1000));
	const timeLeft = useCountdown(targetDate);

	return (
		<section className="relative overflow-hidden">
			<div className="relative bg-[#f8f3ee]">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row items-center gap-8 py-14 sm:py-20">
						<div className="w-full lg:w-1/2 relative aspect-[4/5] rounded-lg overflow-hidden bg-secondary">
							<Image
								src="/scraped-5.png"
								alt="Big deals"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<div className="w-full lg:w-1/2 text-center lg:text-left">
							<p className="text-xs uppercase tracking-[0.2em] text-foreground/60 mb-3">
								Don&apos;t miss out...
							</p>
							<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mb-4">
								Today&apos;s Big Deals
							</h2>
							<p className="text-muted-foreground mb-8">Sale up to 75% all items. Hurry Up!</p>
							<div className="flex justify-center lg:justify-start gap-4 mb-8">
								{[
									{ value: timeLeft.days, label: "days" },
									{ value: timeLeft.hours, label: "hour" },
									{ value: timeLeft.mins, label: "mins" },
									{ value: timeLeft.secs, label: "secs" },
								].map((item) => (
									<div key={item.label} className="text-center">
										<div className="text-2xl sm:text-3xl font-medium text-foreground tabular-nums">
											{String(item.value).padStart(2, "0")}
										</div>
										<div className="text-xs text-muted-foreground mt-1">{item.label}</div>
									</div>
								))}
							</div>
							<YnsLink
								prefetch={"eager"}
								href="/"
								className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-primary-foreground text-sm font-medium tracking-wide uppercase hover:bg-foreground/90 transition-colors"
							>
								Shop Sale
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
