"use client";

import { ArrowLeft, ArrowRight, Leaf } from "lucide-react";
import { useState } from "react";

const SLIDES = [
	{
		title: "Out of the Box",
		text: "We blend in small batches from plant oils, butters, clays and essential oils, and list every ingredient on the page, so you know exactly what goes into the bath.",
	},
	{
		title: "Short Ingredient Lists",
		text: "Each formula uses only what it needs to clean, soften or scent the skin. If an ingredient does not earn its place, it stays out of the jar.",
	},
	{
		title: "Slow, Not Rushed",
		text: "A warm soak at the end of the day, a minute with a dry brush before the shower, a little oil on damp skin after it. Small rituals, done slowly.",
	},
];

/** The original's sage text slider: hairlines, a leaf roundel, serif title, copy and pill arrows. */
export function StorySlider() {
	const [index, setIndex] = useState(0);
	const slide = SLIDES[index] ?? SLIDES[0];
	const go = (step: 1 | -1) => setIndex((i) => (i + step + SLIDES.length) % SLIDES.length);

	return (
		<div className="flex h-full flex-col items-center justify-between rounded-xl bg-sage px-6 py-6 text-center text-white md:px-12">
			<span aria-hidden="true" className="h-px w-16 bg-white/70" />
			<div className="flex flex-1 flex-col items-center justify-center gap-5 py-8">
				<span className="flex size-16 items-center justify-center rounded-full border border-white/80">
					<Leaf className="size-7" strokeWidth={1.2} aria-hidden="true" />
				</span>
				<div aria-live="polite" className="max-w-md">
					<h2 className="text-title-lg">{slide?.title}</h2>
					<p className="mt-4 text-sm leading-relaxed md:text-[15px]">{slide?.text}</p>
				</div>
				<div className="mt-2 flex gap-4">
					<button
						type="button"
						onClick={() => go(-1)}
						aria-label="Previous story"
						className="inline-flex h-12 w-20 items-center justify-center rounded-full bg-[#f7f3ec] text-foreground transition-colors hover:bg-white"
					>
						<ArrowLeft className="size-5" strokeWidth={1.4} aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() => go(1)}
						aria-label="Next story"
						className="inline-flex h-12 w-20 items-center justify-center rounded-full bg-[#f7f3ec] text-foreground transition-colors hover:bg-white"
					>
						<ArrowRight className="size-5" strokeWidth={1.4} aria-hidden="true" />
					</button>
				</div>
			</div>
			<span aria-hidden="true" className="h-px w-16 bg-white/70" />
		</div>
	);
}
