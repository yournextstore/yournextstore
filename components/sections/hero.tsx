"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

const slides = [
	{
		tag: "NEW ARRIVAL",
		title: "Analog",
		subtitle: "The simplest productivity system",
		image: "/scraped-0.png",
		href: "/",
	},
	{
		tag: "TRENDING",
		title: "Shop Gather",
		subtitle: "The Minimal & Modular Organizer",
		image: "/scraped-1.png",
		href: "/",
	},
	{
		tag: "NEW!",
		title: "Basic T-shirts",
		subtitle: "Premium Quality",
		image: "/scraped-2.png",
		href: "/",
	},
];

export function Hero() {
	const [current, setCurrent] = useState(0);

	const next = useCallback(() => {
		setCurrent((prev) => (prev + 1) % slides.length);
	}, []);

	useEffect(() => {
		const timer = setInterval(next, 5000);
		return () => clearInterval(timer);
	}, [next]);

	return (
		<section className="relative w-full overflow-hidden bg-[#e8e5df]">
			<div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[2.5/1]">
				{slides.map((slide, index) => (
					<div
						key={slide.title}
						className="absolute inset-0 transition-opacity duration-700"
						style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
					>
						<Image
							src={slide.image}
							alt={slide.title}
							fill
							className="object-cover"
							priority={index === 0}
							sizes="100vw"
						/>
						<div className="absolute inset-0 bg-black/20" />
						<YnsLink
							prefetch={"eager"}
							href={slide.href}
							className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4"
						>
							<span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 font-light">
								{slide.tag}
							</span>
							<h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-light tracking-wider mb-3">
								{slide.title}
							</h2>
							<p className="text-sm sm:text-base font-light tracking-wide">{slide.subtitle}</p>
						</YnsLink>
					</div>
				))}
			</div>

			{/* Slide indicators */}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{slides.map((slide, index) => (
					<button
						key={slide.title}
						type="button"
						onClick={() => setCurrent(index)}
						className={`w-2 h-2 rounded-full transition-all ${
							index === current ? "bg-white w-6" : "bg-white/50"
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
}
