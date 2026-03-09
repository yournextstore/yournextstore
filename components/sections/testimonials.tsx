"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const reviews = [
	{
		stars: 5,
		text: "Couldn't be happier with the service I received from this company.",
		image: "/scraped-5.png",
		name: "James L.",
		location: "Los Angeles, CA",
	},
	{
		stars: 5,
		text: "Really went out of their way to make me feel special as a customer, highly recommend!",
		image: "/scraped-6.png",
		name: "Rachel F.",
		location: "Toronto, ON",
	},
	{
		stars: 5,
		text: "Fantastic fabrics, great fit and no issues going through the laundry either!",
		image: "/scraped-7.png",
		name: "Sam R.",
		location: "Brooklyn, NY",
	},
	{
		stars: 5,
		text: "Arrived fast and beautifully boxed. Outstanding quality for the price.",
		image: "/scraped-8.png",
		name: "Matt C.",
		location: "Montreal, QC",
	},
	{
		stars: 5,
		text: "Amazing customer service and top-notch product quality. Will definitely order again!",
		image: "/scraped-9.png",
		name: "Sharon S.",
		location: "New Orleans, LA",
	},
];

export function Testimonials() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const checkScroll = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 0);
		setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
	}, []);

	useEffect(() => {
		checkScroll();
	}, [checkScroll]);

	const scroll = (direction: "left" | "right") => {
		const el = scrollRef.current;
		if (!el) return;
		const amount = direction === "left" ? -340 : 340;
		el.scrollBy({ left: amount, behavior: "smooth" });
		setTimeout(checkScroll, 400);
	};

	return (
		<section className="py-12 sm:py-16 bg-secondary/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-8">
					<h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-wide">
						Don&apos;t take our word for it
					</h2>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => scroll("left")}
							disabled={!canScrollLeft}
							className="w-10 h-10 flex items-center justify-center border border-border hover:bg-foreground hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
							aria-label="Previous testimonial"
						>
							&larr;
						</button>
						<button
							type="button"
							onClick={() => scroll("right")}
							disabled={!canScrollRight}
							className="w-10 h-10 flex items-center justify-center border border-border hover:bg-foreground hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
							aria-label="Next testimonial"
						>
							&rarr;
						</button>
					</div>
				</div>

				<div
					ref={scrollRef}
					onScroll={checkScroll}
					className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{reviews.map((review) => (
						<div
							key={review.name}
							className="flex-shrink-0 w-[300px] sm:w-[320px] bg-background p-6 snap-start"
						>
							<div className="flex gap-1 mb-4">
								{Array.from({ length: review.stars }).map((_, i) => (
									<Star
										key={`star-${review.name}-${i}`}
										className="w-4 h-4 fill-foreground text-foreground"
									/>
								))}
							</div>
							<p className="text-sm text-foreground leading-relaxed mb-6">{review.text}</p>
							<div className="flex items-center gap-3">
								<div className="relative w-10 h-10 rounded-full overflow-hidden">
									<Image src={review.image} alt={review.name} fill sizes="40px" className="object-cover" />
								</div>
								<div>
									<p className="text-sm font-semibold">{review.name}</p>
									<p className="text-xs text-muted-foreground">{review.location}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
