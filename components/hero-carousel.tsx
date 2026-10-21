"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type HeroSlide = {
	image: string;
	label: string;
	category: string | null;
	href: string;
	cta?: string;
};

const AUTOPLAY_MS = 4500;

/**
 * The original's hero picture: a rounded 3:4 frame cross-fading between featured products,
 * a violet wash at the foot with the category, the serif name and a gold "View Product" link,
 * a gold "Featured" tag and vertical pill dots. Pauses on hover/focus and for reduced motion.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
		return () => window.clearInterval(timer);
	}, [count, paused]);

	const slide = slides[active];
	if (!slide) return null;

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative aspect-3/4 max-h-[600px] w-full overflow-hidden rounded-2xl bg-sand shadow-luxury-lg"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			{slides.map((s, i) => (
				<div
					key={s.href}
					aria-hidden={i !== active}
					className={cn(
						"absolute inset-0 transition-opacity duration-700 ease-luxury",
						i === active ? "opacity-100" : "opacity-0",
					)}
				>
					<YNSMedia
						src={s.image}
						alt=""
						fill
						priority={i === 0}
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-royal/80 via-royal/10 to-transparent" />
				</div>
			))}

			<div className="absolute right-16 bottom-8 left-8" aria-live="polite">
				{slide.category && (
					<p className="mb-1 font-body text-xs uppercase tracking-widest text-cream/85">{slide.category}</p>
				)}
				<p className="font-display text-2xl leading-tight text-cream sm:text-3xl">{slide.label}</p>
				<Link
					href={slide.href}
					className="mt-3 inline-block border-b border-gold/50 font-body text-xs uppercase tracking-widest text-gold transition-colors hover:border-gold"
				>
					{slide.cta ?? "View Product"} <span aria-hidden="true">&rarr;</span>
				</Link>
			</div>

			{count > 1 && (
				<div className="absolute right-5 bottom-6 flex flex-col">
					{slides.map((s, i) => (
						<button
							key={s.href}
							type="button"
							onClick={() => setActive(i)}
							aria-label={`Show ${s.label}`}
							aria-current={i === active}
							className="flex min-h-6 w-6 items-center justify-center py-1"
						>
							<span
								className={cn(
									"block w-1.5 rounded-full transition-all duration-300",
									i === active ? "h-8 bg-gold" : "h-3 bg-cream/50 hover:bg-cream/70",
								)}
							/>
						</button>
					))}
				</div>
			)}

			<span className="absolute top-6 left-6 rounded-md bg-gold px-3 py-1.5 font-body text-2xs uppercase tracking-widest text-earth">
				Featured
			</span>
		</section>
	);
}
