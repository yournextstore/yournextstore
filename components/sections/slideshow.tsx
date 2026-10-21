"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type Slide = {
	image: string;
	eyebrow: string;
	heading: string;
	body: string;
	cta: string;
	href: string;
};

const INTERVAL_MS = 6000;

/**
 * Pilot's full-bleed home slideshow: photograph under a soft scrim, eyebrow, serif headline,
 * a line of copy and an outlined button bottom-left, bar indicators bottom-centre. Slides
 * cross-fade every six seconds; hovering, focusing or a reduced-motion preference holds them.
 * `data-hero` pulls the slideshow up under the transparent header (see globals.css).
 */
export function Slideshow({ slides }: { slides: Slide[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (paused || slides.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setTimeout(() => setActive((index) => (index + 1) % slides.length), INTERVAL_MS);
		return () => window.clearTimeout(timer);
	}, [paused, slides.length]);

	return (
		<section
			data-hero
			aria-roledescription="carousel"
			aria-label="Featured"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
			className="relative h-[max(34rem,calc(100svh-2.25rem))] max-h-[60rem] overflow-hidden bg-ink text-white"
		>
			{slides.map((slide, index) => {
				const isActive = index === active;
				const Heading = index === 0 ? "h1" : "h2";
				return (
					<div
						key={slide.href + slide.image}
						aria-hidden={!isActive}
						inert={!isActive}
						className={cn(
							"absolute inset-0 transition-opacity duration-1000 ease-in-out",
							isActive ? "z-1 opacity-100" : "z-0 opacity-0",
						)}
					>
						<YNSMedia
							src={slide.image}
							alt=""
							fill
							sizes="100vw"
							priority={index === 0}
							className="object-cover"
						/>
						<div
							aria-hidden
							className="absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-black/25"
						/>
						<div
							className={cn(
								"page-x absolute inset-x-0 bottom-0 pb-20 lg:pb-24",
								isActive ? "opacity-100 transition-opacity delay-500 duration-500" : "opacity-0",
							)}
						>
							<div className="max-w-2xl max-md:mx-auto max-md:text-center">
								<p className="text-body-sm">{slide.eyebrow}</p>
								<Heading className="mt-3 text-display text-balance">{slide.heading}</Heading>
								<p className="mt-4 max-w-xl text-body text-white/90 max-md:mx-auto">{slide.body}</p>
								<Link
									href={slide.href}
									className="mt-6 inline-flex h-11 items-center rounded-md border border-white px-5 text-body-sm transition-colors hover:bg-white hover:text-foreground"
								>
									{slide.cta}
								</Link>
							</div>
						</div>
					</div>
				);
			})}
			{slides.length > 1 && (
				<div className="absolute inset-x-0 bottom-8 z-2 flex justify-center gap-2">
					{slides.map((slide, index) => (
						<button
							key={slide.href + slide.image}
							type="button"
							onClick={() => setActive(index)}
							aria-label={`Show slide ${index + 1} of ${slides.length}`}
							aria-current={index === active}
							className="flex h-6 items-center"
						>
							<span
								className={cn(
									"block h-1 rounded-full transition-all duration-300",
									index === active ? "w-12 bg-white" : "w-6 bg-white/50",
								)}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
