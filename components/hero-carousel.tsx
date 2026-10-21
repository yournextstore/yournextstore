"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDE_MS = 5000;

export function HeroCarousel({ slides }: { slides: { id: string; node: ReactNode }[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setInterval(() => setActive((i) => (i + 1) % count), SLIDE_MS);
		return () => window.clearInterval(timer);
	}, [count, paused]);

	return (
		<section
			aria-label="Featured"
			className="relative"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<div className="relative overflow-hidden">
				<div
					className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
					style={{ transform: `translateX(-${active * 100}%)` }}
				>
					{slides.map((slide, index) => (
						<div
							key={slide.id}
							className="w-full shrink-0"
							aria-hidden={index !== active}
							inert={index !== active}
						>
							{slide.node}
						</div>
					))}
				</div>
				{count > 1 && (
					<div className="absolute inset-x-0 bottom-0 h-1 bg-black/10" aria-hidden="true">
						<div
							key={`${active}-${paused}`}
							className={cn("h-full bg-bar/70", !paused && "hero-progress")}
							style={{ animationDuration: `${SLIDE_MS}ms` }}
						/>
					</div>
				)}
			</div>
			{count > 1 && (
				<div className="flex items-center justify-center">
					{slides.map((slide, index) => (
						<button
							key={slide.id}
							type="button"
							onClick={() => setActive(index)}
							aria-label={`Show slide ${index + 1}`}
							aria-current={index === active}
							className="flex h-6 w-6 items-center justify-center"
						>
							<span
								className={cn(
									"rounded-full bg-[#5d5d5d] transition-all",
									index === active ? "h-2 w-2 opacity-70" : "h-1.5 w-1.5 opacity-50",
								)}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
