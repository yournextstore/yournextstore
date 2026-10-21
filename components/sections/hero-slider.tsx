"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's Swiper hero (fade effect, 3 s autoplay, dot pagination) without Swiper:
 * every slide sits in the same grid cell, so the box is as tall as the tallest slide from the
 * first paint and switching is an opacity change only (no layout shift). Autoplay pauses on
 * hover/focus and for reduced-motion users.
 */
export function HeroSlider({ slides, labels }: { slides: ReactNode[]; labels: string[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setInterval(() => setActive((i) => (i + 1) % count), 4500);
		return () => window.clearInterval(timer);
	}, [count, paused]);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured offers"
			className="relative"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<div className="grid">
				{slides.map((slide, index) => (
					<div
						key={labels[index]}
						aria-hidden={index !== active}
						inert={index !== active}
						className={cn(
							"col-start-1 row-start-1 transition-opacity duration-500",
							index === active ? "opacity-100" : "pointer-events-none opacity-0",
						)}
					>
						{slide}
					</div>
				))}
			</div>
			{count > 1 ? (
				<div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 lg:bottom-5">
					{labels.map((label, index) => (
						<button
							key={label}
							type="button"
							aria-label={`Show slide ${index + 1}: ${label}`}
							aria-current={index === active}
							onClick={() => setActive(index)}
							className="flex size-6 items-center justify-center"
						>
							<span
								className={cn(
									"size-2.5 rounded-full border border-green-500 transition",
									index === active ? "bg-green-500" : "bg-transparent opacity-60",
								)}
							/>
						</button>
					))}
				</div>
			) : null}
		</section>
	);
}
