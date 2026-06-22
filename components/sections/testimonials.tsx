import { Star } from "lucide-react";

const reviews = [
	{
		quote:
			"It's the first thing in a decade that's actually helped me stay asleep through the night. I wake up clear-headed, not foggy.",
		name: "Sara K.",
		title: "Verified customer",
	},
	{
		quote:
			"I drink it ten minutes before I read in bed. By the time I close my book, I'm gone. Genuinely no side effects.",
		name: "Devon R.",
		title: "Verified customer",
	},
	{
		quote:
			"Beautifully made, considered formula, and the ritual feels grounding. I look forward to it every evening.",
		name: "Priya M.",
		title: "Verified customer",
	},
];

export function Testimonials() {
	return (
		<section className="bg-mauve-soft">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center max-w-2xl mx-auto">
					<p className="text-[10px] tracking-[0.32em] uppercase text-primary mb-4">— Loved at bedtime —</p>
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-foreground">
						4.9 stars across 12,000+ nights.
					</h2>
				</div>
				<div className="mt-14 grid gap-6 md:grid-cols-3">
					{reviews.map((r) => (
						<figure
							key={r.name}
							className="flex flex-col rounded-lg bg-background/85 backdrop-blur p-7 ring-1 ring-foreground/5"
						>
							<div className="flex gap-1 mb-4 text-primary">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={`star-${r.name}-${i}`} className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
								))}
							</div>
							<blockquote className="font-serif text-lg leading-snug text-foreground">
								&ldquo;{r.quote}&rdquo;
							</blockquote>
							<figcaption className="mt-6 text-sm text-muted-foreground">
								<span className="block font-medium text-foreground">{r.name}</span>
								<span className="block text-xs tracking-wide uppercase text-foreground/55 mt-0.5">
									{r.title}
								</span>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
