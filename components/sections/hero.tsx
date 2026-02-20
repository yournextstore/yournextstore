"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

const slides = [
	{
		image: "/scraped-0.png",
		subtitle: "1 / 3",
		title: "PUFFER\nJACKETS",
		cta: "Go get it!",
		href: "/products",
	},
	{
		image: "/scraped-1.png",
		subtitle: "2 / 3",
		title: "AZTEK\nPATTERNS",
		cta: "VISIT COLLECTION",
		href: "/products",
	},
	{
		image: "/scraped-2.png",
		subtitle: "3 / 3",
		title: "CREWNECK\nSWEATSHIRTS",
		cta: "EXPLORE",
		href: "/products",
	},
];

export function Hero() {
	const [current, setCurrent] = useState(0);

	const next = useCallback(() => {
		setCurrent((prev) => (prev + 1) % slides.length);
	}, []);

	const prev = useCallback(() => {
		setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
	}, []);

	useEffect(() => {
		const interval = setInterval(next, 5000);
		return () => clearInterval(interval);
	}, [next]);

	const slide = slides[current];
	if (!slide) return null;

	return (
		<section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden bg-brand-dark">
			{slides.map((s, index) => (
				<div
					key={s.subtitle}
					className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`}
				>
					<Image
						src={s.image}
						alt={s.title}
						fill
						className="object-cover"
						priority={index === 0}
						sizes="100vw"
					/>
					<div className="absolute inset-0 bg-black/30" />
				</div>
			))}

			<div className="relative z-10 h-full flex flex-col justify-end pb-12 sm:pb-20 px-6 sm:px-12 lg:px-20">
				<p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-4">{slide.subtitle}</p>
				<h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white uppercase leading-[0.9] tracking-tighter whitespace-pre-line">
					{slide.title}
				</h1>
				<div className="mt-8">
					<YnsLink
						prefetch={"eager"}
						href={slide.href}
						className="inline-block border-2 border-white text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-colors"
					>
						{slide.cta}
					</YnsLink>
				</div>
			</div>

			{/* Navigation arrows */}
			<div className="absolute bottom-8 right-8 z-20 flex gap-2">
				<button
					type="button"
					onClick={prev}
					className="w-12 h-12 border border-white/50 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
					aria-label="Previous slide"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
				<button
					type="button"
					onClick={next}
					className="w-12 h-12 border border-white/50 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
					aria-label="Next slide"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>

			{/* Slide indicators */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{slides.map((s, index) => (
					<button
						key={s.subtitle}
						type="button"
						onClick={() => setCurrent(index)}
						className={`w-2 h-2 rounded-full transition-colors ${index === current ? "bg-white" : "bg-white/40"}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
}
