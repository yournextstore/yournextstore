"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

const slides = [
	{
		image: "/scraped-0.jpg",
		subtitle: "BUY 4 RIMS",
		title: "GET 30% OFF",
		description:
			"Premium automotive parts and accessories. This is our most comprehensive vehicle treatment.",
		cta: "SHOP NOW",
		href: "#products",
	},
	{
		image: "/scraped-1.jpg",
		subtitle: "THIS WEEK ONLY",
		title: "WHEELS & TIRES",
		description:
			"Premium automotive parts and accessories. This is our most comprehensive vehicle treatment.",
		cta: "SHOP NOW",
		href: "#products",
		price: "$99.99",
	},
	{
		image: "/scraped-9.jpg",
		subtitle: "Automotive Parts & Accessories",
		title: "FIND PARTS THAT FIT",
		description: "Explore our full catalog of premium auto parts, tools, and equipment for every vehicle.",
		cta: "SHOP NOW",
		href: "#products",
	},
];

export function Hero() {
	const [current, setCurrent] = useState(0);

	const next = useCallback(() => {
		setCurrent((c) => (c + 1) % slides.length);
	}, []);

	const prev = useCallback(() => {
		setCurrent((c) => (c - 1 + slides.length) % slides.length);
	}, []);

	useEffect(() => {
		const timer = setInterval(next, 5000);
		return () => clearInterval(timer);
	}, [next]);

	const slide = slides[current];
	if (!slide) return null;

	return (
		<section className="relative overflow-hidden bg-[#2a2a2a]">
			<div className="relative h-[320px] sm:h-[400px] lg:h-[480px]">
				{slides.map((s, i) => (
					<div
						key={s.title}
						className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
					>
						<Image src={s.image} alt={s.title} fill className="object-cover opacity-30" priority={i === 0} />
					</div>
				))}

				<div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
					<div className="max-w-xl">
						<p className="text-gold font-[family-name:var(--font-heading)] text-sm sm:text-base uppercase tracking-widest mb-2">
							{slide.subtitle}
						</p>
						<h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight">
							{slide.title}
						</h1>
						<p className="mt-4 text-white/70 text-sm sm:text-base max-w-md">{slide.description}</p>
						{slide.price && (
							<p className="mt-2 text-gold font-[family-name:var(--font-heading)] text-3xl font-bold">
								{slide.price}
							</p>
						)}
						<YnsLink
							prefetch={"eager"}
							href={slide.href}
							className="mt-6 inline-block bg-primary hover:bg-primary/90 text-white font-bold uppercase text-sm tracking-wider px-8 py-3 transition-colors"
						>
							{slide.cta}
						</YnsLink>
					</div>
				</div>

				{/* Navigation Arrows */}
				<button
					type="button"
					onClick={prev}
					className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
					aria-label="Previous slide"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
				<button
					type="button"
					onClick={next}
					className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
					aria-label="Next slide"
				>
					<ChevronRight className="w-5 h-5" />
				</button>

				{/* Dots */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
					{slides.map((s, i) => (
						<button
							key={s.title}
							type="button"
							onClick={() => setCurrent(i)}
							className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-gold" : "bg-white/40"}`}
							aria-label={`Go to slide ${i + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
