"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

const slides = [
	{
		subtitle: "BUY 4 RIMS",
		title: "GET 30% OFF",
		description: "Premium performance parts for your vehicle. Built to last, engineered for excellence.",
		cta: "SHOP NOW",
		href: "/products",
		image: "/scraped-0.png",
	},
	{
		subtitle: "THIS WEEK ONLY",
		title: "WHEEL & TIRES",
		description: "Premium performance parts for your vehicle. Built to last, engineered for excellence.",
		price: "$99.99",
		cta: "SHOP NOW",
		href: "/products",
		image: "/scraped-1.png",
	},
	{
		subtitle: "Automotive Parts & Accessories",
		title: "FIND PARTS THAT FIT",
		description: "",
		cta: "SHOP NOW",
		href: "/products",
		image: "/scraped-2.png",
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
		const timer = setInterval(next, 5000);
		return () => clearInterval(timer);
	}, [next]);

	const slide = slides[current];
	if (!slide) return null;

	return (
		<section className="relative bg-[#1a1a1a] overflow-hidden">
			<div className="relative h-[400px] sm:h-[500px] lg:h-[560px]">
				{/* Background image */}
				<Image
					src={slide.image}
					alt={slide.title}
					fill
					className="object-cover opacity-60"
					priority
					sizes="100vw"
				/>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

				{/* Content */}
				<div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
					<div className="max-w-lg">
						{slide.subtitle && (
							<p className="font-heading text-brand text-sm sm:text-base font-semibold uppercase tracking-widest mb-2">
								{slide.subtitle}
							</p>
						)}
						<h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight">
							{slide.title}
						</h1>
						{slide.price && (
							<p className="mt-3 font-heading text-3xl sm:text-4xl font-bold text-brand">{slide.price}</p>
						)}
						{slide.description && (
							<p className="mt-4 text-white/70 text-sm sm:text-base max-w-md">{slide.description}</p>
						)}
						<YnsLink
							prefetch={"eager"}
							href={slide.href}
							className="mt-6 inline-flex items-center justify-center h-12 px-8 bg-brand text-brand-foreground font-heading font-semibold uppercase text-sm tracking-wider hover:bg-yellow-500 transition-colors"
						>
							{slide.cta}
						</YnsLink>
					</div>
				</div>

				{/* Navigation arrows */}
				<button
					type="button"
					onClick={prev}
					className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-brand text-white hover:text-brand-foreground transition-colors"
					aria-label="Previous slide"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
				<button
					type="button"
					onClick={next}
					className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-brand text-white hover:text-brand-foreground transition-colors"
					aria-label="Next slide"
				>
					<ChevronRight className="w-5 h-5" />
				</button>

				{/* Dots */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
					{slides.map((_, i) => (
						<button
							type="button"
							key={`dot-${slides[i]?.title}`}
							onClick={() => setCurrent(i)}
							className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-brand" : "bg-white/40 hover:bg-white/60"}`}
							aria-label={`Go to slide ${i + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
