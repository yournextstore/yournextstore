"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";

const testimonials = [
	{
		quote:
			"This is really amazing shop, super smooth buying experience. The quality of every piece exceeded my expectations!",
		author: "JOHN SMITH",
		role: "Amazing Creator",
	},
	{
		quote:
			"I recently had the pleasure of shopping here, and I must say it was a fantastic experience from start to finish. I couldn't be happier with the quality.",
		author: "SAM HILL",
		role: "Smart Developer",
	},
	{
		quote:
			"An extraordinary opportunity to find some amazing streetwear pieces. The customer service is top-notch and shipping was incredibly fast!",
		author: "JANE SUSAN",
		role: "Happiness Hero",
	},
];

export function Testimonials() {
	const [current, setCurrent] = useState(0);

	const next = useCallback(() => {
		setCurrent((prev) => (prev + 1) % testimonials.length);
	}, []);

	const prev = useCallback(() => {
		setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
	}, []);

	const testimonial = testimonials[current];
	if (!testimonial) return null;

	return (
		<section className="py-16 sm:py-24 bg-secondary">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-12">What They Say</h2>
				<blockquote className="relative">
					<p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-foreground italic">
						&ldquo;{testimonial.quote}&rdquo;
					</p>
					<footer className="mt-8">
						<p className="text-sm font-extrabold uppercase tracking-widest">{testimonial.author}</p>
						<p className="text-sm text-muted-foreground mt-1">{testimonial.role}</p>
					</footer>
				</blockquote>
				<div className="mt-8 flex justify-center gap-3">
					<button
						type="button"
						onClick={prev}
						className="w-10 h-10 border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
						aria-label="Previous testimonial"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
					<button
						type="button"
						onClick={next}
						className="w-10 h-10 border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
						aria-label="Next testimonial"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</section>
	);
}
