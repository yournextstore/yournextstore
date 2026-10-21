"use client";

import { type ReactNode, useEffect, useState } from "react";

/**
 * Cross-fading slides with autoplay and pill dots (the original's embla carousel, without the
 * dependency). Slides are server-rendered children; this only flips `data-active`.
 */
export function HeroCarousel({ slides, labels }: { slides: ReactNode[]; labels: string[] }) {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (paused || slides.length < 2) {
			return;
		}
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}
		const id = window.setTimeout(() => setCurrent((index) => (index + 1) % slides.length), 6000);
		return () => window.clearTimeout(id);
	}, [paused, slides.length]);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative h-[72svh] min-h-[460px] max-h-[860px] w-full md:h-[85svh] md:min-h-[500px] overflow-hidden bg-[hsl(160_30%_9%)]"
			onPointerEnter={() => setPaused(true)}
			onPointerLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
		>
			{slides.map((slide, index) => (
				<div
					key={index}
					className="hero-slide absolute inset-0"
					data-active={index === current}
					aria-hidden={index !== current}
					inert={index !== current}
				>
					{slide}
				</div>
			))}
			{slides.length > 1 && (
				<div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-0.5">
					{labels.map((label, index) => (
						<button
							key={label}
							type="button"
							onClick={() => setCurrent(index)}
							aria-label={`Show slide ${index + 1}: ${label}`}
							aria-current={index === current}
							className="flex h-6 min-w-6 items-center justify-center px-0.5"
						>
							<span
								aria-hidden="true"
								className={`block h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-accent" : "w-2 bg-hero-ink/50"}`}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
