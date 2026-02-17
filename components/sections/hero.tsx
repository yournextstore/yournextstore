"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

const slides = [
	{
		image: "/scraped-0.png",
		subtitle: "Fall essentials",
		title: "Fall\u00A0 essentials",
		description: "Celebrate joyful moments with the House's emblematic pieces.",
		cta: "Shop all",
		href: "/collection/all",
		overlayPosition: "left" as const,
	},
	{
		image: "/scraped-3.png",
		subtitle: "New collection",
		title: "Inspired by Nature",
		description: "",
		cta: "Shop Now",
		href: "/collection/all",
		overlayPosition: "center" as const,
	},
	{
		image: "/scraped-5.png",
		subtitle: "Your Next Store",
		title: "Luxette's STYLE",
		description: "Fresh looks for sunny days.",
		cta: "Shop all",
		href: "/collection/all",
		overlayPosition: "right" as const,
	},
];

export function Hero() {
	const [current, setCurrent] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const next = useCallback(() => {
		setCurrent((prev) => (prev + 1) % slides.length);
	}, []);

	const prev = useCallback(() => {
		setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
	}, []);

	useEffect(() => {
		if (isPaused) return;
		const interval = setInterval(next, 5000);
		return () => clearInterval(interval);
	}, [isPaused, next]);

	const slide = slides[current];
	if (!slide) return null;

	return (
		<section
			className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden bg-[#f5f5f0]"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{slides.map((s, i) => (
				<div
					key={s.title}
					className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				>
					<Image src={s.image} alt={s.title} fill className="object-cover" priority={i === 0} sizes="100vw" />
					<div className="absolute inset-0 bg-black/10" />
				</div>
			))}

			{/* Content overlay */}
			<div className="relative z-10 h-full flex items-end pb-16 sm:pb-20 lg:pb-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div
						className={`max-w-lg impulse-hero-slide ${
							slide.overlayPosition === "right" ? "ml-auto text-right" : ""
						} ${slide.overlayPosition === "center" ? "mx-auto text-center" : ""}`}
						key={current}
					>
						<h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide">
							{slide.title}
						</h2>
						{slide.description && (
							<p className="mt-4 text-base sm:text-lg text-white/90 font-light">{slide.description}</p>
						)}
						<div className="mt-8">
							<YnsLink
								prefetch="eager"
								href={slide.href}
								className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
							>
								{slide.cta}
								<ArrowRight className="w-3.5 h-3.5" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation arrows */}
			<button
				type="button"
				onClick={prev}
				className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white transition-colors"
				aria-label="Previous slide"
			>
				<ChevronLeft className="w-6 h-6" />
			</button>
			<button
				type="button"
				onClick={next}
				className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white transition-colors"
				aria-label="Next slide"
			>
				<ChevronRight className="w-6 h-6" />
			</button>

			{/* Slide indicators */}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{slides.map((s, i) => (
					<button
						key={s.title}
						type="button"
						onClick={() => setCurrent(i)}
						className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/50"}`}
						aria-label={`Go to slide ${i + 1}`}
					/>
				))}
			</div>
		</section>
	);
}
