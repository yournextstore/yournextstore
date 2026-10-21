"use client";

import { ArrowLeft, ArrowRight, CircleCheck, Star } from "lucide-react";
import { useRef } from "react";

export type TestimonialCard = { id: string; title: string; body: string; rating?: number };

/** "Our happy customers": a title row with arrows over a sideways strip of bordered cards. */
export function TestimonialCarousel({ title, cards }: { title: string; cards: TestimonialCard[] }) {
	const trackRef = useRef<HTMLUListElement>(null);

	const scrollBy = (direction: 1 | -1) => {
		const track = trackRef.current;
		const card = track?.querySelector("li");
		if (!track || !card) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		track.scrollBy({ left: direction * (card.clientWidth + 20), behavior: reduce ? "auto" : "smooth" });
	};

	return (
		<section className="mb-6 overflow-hidden md:mb-9">
			<div className="mx-auto mb-6 flex max-w-[77.5rem] items-end px-4 sm:items-center md:mb-10 xl:px-0">
				<h2 className="font-display mr-auto text-display-sm md:text-display-lg">{title}</h2>
				<div className="ml-2 flex items-center gap-1">
					<button type="button" onClick={() => scrollBy(-1)} aria-label="Previous" className="p-2">
						<ArrowLeft className="size-6" strokeWidth={2.25} />
					</button>
					<button type="button" onClick={() => scrollBy(1)} aria-label="Next" className="p-2">
						<ArrowRight className="size-6" strokeWidth={2.25} />
					</button>
				</div>
			</div>
			<ul
				ref={trackRef}
				className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 xl:px-[max(0px,calc((100vw-77.5rem)/2))] md:[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
			>
				{cards.map((card) => (
					<li
						key={card.id}
						className="flex w-[min(358px,calc(100vw-2rem))] shrink-0 snap-center flex-col items-start rounded-[20px] border border-black/10 bg-white p-6 sm:w-[400px] sm:px-8 sm:py-7"
					>
						{card.rating ? (
							<span
								className="mb-3 flex gap-1 sm:mb-4"
								role="img"
								aria-label={`${card.rating} out of 5 stars`}
							>
								{Array.from({ length: 5 }, (_, i) => (
									<Star
										key={i}
										aria-hidden
										className={
											i < (card.rating ?? 0) ? "size-5 fill-star text-star" : "size-5 fill-pill text-pill"
										}
									/>
								))}
							</span>
						) : null}
						<p className="mb-2 flex items-center gap-1 sm:mb-3">
							<strong className="text-black sm:text-xl">{card.title}</strong>
							<CircleCheck className="size-5 fill-verified text-white sm:size-6" aria-hidden />
						</p>
						<p className="text-sm text-muted-foreground sm:text-base">{card.body}</p>
					</li>
				))}
			</ul>
		</section>
	);
}
