"use client";

import { useEffect, useState } from "react";

const slides = [
	{ image: "/hero-bg-1.svg", alt: "Mountain landscape" },
	{ image: "/hero-bg-2.svg", alt: "Forest trail" },
	{ image: "/hero-bg-3.svg", alt: "Ocean coast" },
];

export function Hero() {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	return (
		<section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
			{/* Slide backgrounds */}
			{slides.map((slide, index) => (
				<div
					key={slide.alt}
					className="absolute inset-0 transition-opacity duration-1000"
					style={{ opacity: index === currentSlide ? 1 : 0 }}
				>
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: `url(${slide.image})` }}
					/>
					<div className="absolute inset-0 bg-black/30" />
				</div>
			))}

			{/* Content overlay */}
			<div className="relative z-10 flex items-center justify-center h-full text-center text-white">
				<div className="max-w-3xl px-4">
					<h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light tracking-wide">
						The adventurous.
					</h1>
				</div>
			</div>

			{/* Slide indicators */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
				{slides.map((slide, index) => (
					<button
						key={slide.alt}
						type="button"
						onClick={() => setCurrentSlide(index)}
						className={`w-2 h-2 rounded-full transition-all duration-300 ${
							index === currentSlide ? "bg-white w-6" : "bg-white/50"
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
}
