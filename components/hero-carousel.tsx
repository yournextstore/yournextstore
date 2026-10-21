"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type HeroSlide = {
	eyebrow: string;
	title: string;
	copy: string;
	cta: string;
	href: string;
	image: string | null;
};

const AUTOPLAY_MS = 6000;

/**
 * The original's full-bleed hero slider: a photograph under a left-weighted dark wash, a serif
 * headline, one pine button, arrows at the edges and pill dots at the bottom. Autoplays every
 * six seconds, pauses on hover/focus and when the shopper prefers reduced motion.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
		return () => window.clearTimeout(timer);
	}, [count, paused]);

	const go = (next: number) => setIndex((next + count) % count);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative h-[78vh] min-h-[560px] w-full overflow-hidden bg-[#2b2723]"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<div
				className="flex h-full w-full transition-transform duration-700 ease-out"
				style={{ transform: `translateX(-${index * 100}%)` }}
			>
				{slides.map((slide, i) => {
					const Heading = i === 0 ? "h1" : "h2";
					const active = i === index;
					return (
						<div
							key={slide.title}
							aria-hidden={!active}
							inert={!active}
							className="relative h-full w-full shrink-0"
						>
							{slide.image && (
								<YNSMedia
									src={slide.image}
									alt=""
									fill
									sizes="100vw"
									priority={i === 0}
									className="object-cover"
								/>
							)}
							<div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/40 to-black/10" />
							<div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 to-transparent" />
							<div className="container-x relative flex h-full items-center">
								<div className="max-w-xl pt-10 text-white">
									<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/90">
										{slide.eyebrow}
									</p>
									<Heading className="font-heading text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
										{slide.title}
									</Heading>
									<p className="mt-5 max-w-md text-base text-white/90">{slide.copy}</p>
									<Link
										href={slide.href}
										className="mt-7 inline-flex items-center justify-center rounded-form bg-primary px-6 py-3 text-[13px] font-semibold tracking-wide text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow-md active:scale-[0.98]"
									>
										{slide.cta}
									</Link>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			{count > 1 && (
				<>
					<button
						type="button"
						onClick={() => go(index - 1)}
						aria-label="Previous slide"
						className="absolute left-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center text-white/80 transition-colors hover:text-white sm:inline-flex"
					>
						<ArrowLeft className="size-[34px]" strokeWidth={1.5} aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() => go(index + 1)}
						aria-label="Next slide"
						className="absolute right-2 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center text-white/80 transition-colors hover:text-white sm:inline-flex"
					>
						<ArrowRight className="size-[34px]" strokeWidth={1.5} aria-hidden="true" />
					</button>
					<div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2">
						{slides.map((slide, i) => (
							<button
								key={slide.title}
								type="button"
								onClick={() => go(i)}
								aria-label={`Show slide ${i + 1}`}
								aria-current={i === index}
								className="flex h-6 min-w-6 items-center justify-center px-1"
							>
								<span
									className={cn(
										"block h-1.5 rounded-full transition-all",
										i === index ? "w-5 bg-primary" : "w-1.5 bg-white",
									)}
								/>
							</button>
						))}
					</div>
				</>
			)}
		</section>
	);
}
