"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

function useCountdown() {
	const [time, setTime] = useState({ hours: 2, minutes: 59, seconds: 36 });

	useEffect(() => {
		const timer = setInterval(() => {
			setTime((prev) => {
				const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
				if (totalSeconds <= 0) return { hours: 23, minutes: 59, seconds: 59 };
				return {
					hours: Math.floor(totalSeconds / 3600),
					minutes: Math.floor((totalSeconds % 3600) / 60),
					seconds: totalSeconds % 60,
				};
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return time;
}

export function SaleBanner() {
	const { hours, minutes, seconds } = useCountdown();

	return (
		<section className="py-16 sm:py-24 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative rounded-3xl overflow-hidden bg-lime p-8 sm:p-12 lg:p-16">
					<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
						<div>
							<span className="text-xs uppercase tracking-[0.2em] font-medium text-lime-foreground/70">
								Special Sale
							</span>
							<h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-lime-foreground">
								Buy one{" "}
								<span className="inline-flex items-center justify-center bg-foreground text-primary-foreground text-sm px-3 py-1 rounded-full font-medium">
									get
								</span>{" "}
								one
							</h2>
							<p className="mt-4 text-sm text-lime-foreground/70">The program will end soon:</p>

							{/* Countdown */}
							<div className="mt-4 flex gap-3">
								<CountdownUnit value={hours} label="Hours" />
								<span className="text-2xl font-light text-lime-foreground pt-1">:</span>
								<CountdownUnit value={minutes} label="Minutes" />
								<span className="text-2xl font-light text-lime-foreground pt-1">:</span>
								<CountdownUnit value={seconds} label="Seconds" />
							</div>

							<div className="mt-8">
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
								>
									Shopping sale all Collection
								</YnsLink>
							</div>
						</div>

						{/* Sale images */}
						<div className="flex justify-center gap-4">
							<div className="relative w-[140px] h-[200px] rounded-2xl overflow-hidden">
								<Image
									src="/scraped-8.png"
									alt="Sale product"
									fill
									className="object-contain"
									sizes="140px"
								/>
							</div>
							<div className="relative w-[140px] h-[200px] rounded-2xl overflow-hidden mt-8">
								<Image
									src="/scraped-10.png"
									alt="Sale product"
									fill
									className="object-contain"
									sizes="140px"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
	return (
		<div className="text-center">
			<span className="text-3xl font-light text-lime-foreground tabular-nums">
				{String(value).padStart(2, "0")}
			</span>
			<p className="text-[10px] text-lime-foreground/60 uppercase tracking-wider">{label}</p>
		</div>
	);
}
