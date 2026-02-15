"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { YnsLink } from "../yns-link";

const slides = [
	{ image: "/scraped-5.jpg", alt: "Beauty swatch" },
	{ image: "/scraped-6.jpg", alt: "Serum droplets" },
	{ image: "/scraped-9.jpg", alt: "Hydrating texture" },
];

export function Hero() {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	return (
		<section className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
			{slides.map((slide, idx) => (
				<div
					key={slide.image}
					className={`absolute inset-0 transition-opacity duration-1000 ${
						idx === current ? "opacity-100" : "opacity-0"
					}`}
				>
					<Image
						src={slide.image}
						alt={slide.alt}
						fill
						className="object-cover"
						priority={idx === 0}
						sizes="100vw"
					/>
					<div className="absolute inset-0 bg-black/20" />
				</div>
			))}

			<div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
				<p className="text-sm sm:text-base tracking-[0.3em] uppercase mb-4 font-light">Blend beauty in you</p>
				<h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-light leading-tight mb-8 max-w-3xl">
					Get the skin you want to feel
				</h1>
				<YnsLink
					prefetch={"eager"}
					href="/products"
					className="inline-flex items-center justify-center h-12 px-10 border border-white text-white text-sm tracking-widest uppercase hover:bg-white hover:text-foreground transition-all duration-300"
				>
					Shop Now
				</YnsLink>
			</div>

			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
				{slides.map((slide, idx) => (
					<button
						key={slide.image}
						type="button"
						onClick={() => setCurrent(idx)}
						className={`w-2 h-2 rounded-full transition-all ${
							idx === current ? "bg-white w-6" : "bg-white/50"
						}`}
						aria-label={`Go to slide ${idx + 1}`}
					/>
				))}
			</div>
		</section>
	);
}
