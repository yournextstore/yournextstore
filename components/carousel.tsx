"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Pasargad's Embla banner: one slide at a time, looping autoplay and white dots pulled up over the
 * bottom of the slide. Slides are server-rendered and passed in; off-screen ones are `inert`.
 */
export function Carousel({
	slides,
	label,
	className,
	slideClassName,
	interval = 5000,
}: {
	slides: ReactNode[];
	label: string;
	className?: string;
	slideClassName?: string;
	interval?: number;
}) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => setActive((i) => (i + 1) % count), interval);
		return () => window.clearInterval(id);
	}, [count, paused, interval]);

	return (
		<section
			aria-roledescription="carousel"
			aria-label={label}
			className={cn("relative overflow-hidden rounded-lg", className)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
		>
			<div
				className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
				style={{ transform: `translateX(-${active * 100}%)` }}
			>
				{slides.map((slide, i) => (
					<div key={i} inert={i !== active} className={cn("relative w-full flex-[0_0_100%]", slideClassName)}>
						{slide}
					</div>
				))}
			</div>
			{count > 1 && (
				<div className="absolute inset-x-0 bottom-2 flex justify-center gap-0">
					{slides.map((_, i) => (
						<button
							key={i}
							type="button"
							aria-label={`Show slide ${i + 1}`}
							aria-current={i === active}
							onClick={() => setActive(i)}
							className="group/dot flex h-6 w-6 items-center justify-center"
						>
							<span
								className={cn(
									"h-3 w-3 rounded-full bg-white shadow-sm ring-1 ring-black/25 transition-opacity duration-300",
									i === active ? "opacity-100" : "opacity-50 group-hover/dot:opacity-80",
								)}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
