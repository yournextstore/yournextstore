"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

const slides = [
	{
		subtitle: "Sweater Collection",
		title: "Cozy Crew\nOnline Exclusive",
		cta: "Shop Collection",
		href: "/",
		image: "/scraped-0.png",
	},
	{
		subtitle: "Season Collection",
		title: "Pure Ease\nAll-Day Cool",
		cta: "Shop Collection",
		href: "/",
		image: "/scraped-1.png",
	},
	{
		subtitle: "Look Exclusive",
		title: "Clean Look\nSuper Comfort",
		cta: "Shop Collection",
		href: "/",
		image: "/scraped-2.png",
	},
];

export function Hero() {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 6000);
		return () => clearInterval(interval);
	}, []);

	const slide = slides[current];
	if (!slide) return null;

	return (
		<section className="relative w-full bg-[#f5f0eb] overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="flex flex-col lg:flex-row items-center min-h-[500px] lg:min-h-[600px]">
					<div className="relative z-10 w-full lg:w-1/2 py-12 lg:py-20">
						<p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-foreground/60 mb-4">
							{slide.subtitle}
						</p>
						<h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] tracking-tight text-foreground whitespace-pre-line">
							{slide.title}
						</h1>
						<div className="mt-8">
							<YnsLink
								prefetch={"eager"}
								href={slide.href}
								className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-primary-foreground text-sm font-medium tracking-wide uppercase hover:bg-foreground/90 transition-colors"
							>
								{slide.cta}
							</YnsLink>
						</div>
						<div className="flex gap-2 mt-10">
							{slides.map((_, index) => (
								<button
									key={`slide-dot-${index}`}
									type="button"
									onClick={() => setCurrent(index)}
									className={`h-0.5 transition-all duration-300 ${
										index === current ? "w-8 bg-foreground" : "w-4 bg-foreground/30"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					</div>
					<div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
						<div className="relative w-full max-w-[500px] h-[400px] lg:h-[550px]">
							<Image
								src={slide.image}
								alt={slide.title}
								fill
								sizes="500px"
								className="object-cover object-top transition-opacity duration-700"
								priority
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
