import { StarIcon } from "lucide-react";

const reviews = [
	{
		name: "Amara Okafor",
		role: "Verified buyer · 2 mo",
		quote:
			"The Hydra Elixir replaced three products in my routine. Skin feels balanced, dewy, and noticeably calmer within a week.",
		avatar: "/scraped-1.jpg",
	},
	{
		name: "Eloise Martin",
		role: "Verified buyer · 5 mo",
		quote:
			"Beautifully packaged, beautifully made. The botanicals are real — you can smell the rosemary and chamomile the second you open the jar.",
		avatar: "/scraped-3.jpg",
	},
	{
		name: "Sienna Reyes",
		role: "Verified buyer · 3 wk",
		quote:
			"I have very reactive skin and this is the only line I've trusted in years. Honest formulas, no greenwashing, results you can see.",
		avatar: "/scraped-2.jpg",
	},
];

export function Reviews() {
	return (
		<section className="bg-background py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
					<div>
						<div className="font-serif text-xs tracking-[0.4em] uppercase text-muted-foreground">
							Customer Reviews
						</div>
						<h2 className="mt-3 font-serif text-3xl sm:text-4xl text-foreground">
							Loved by 12,000 quiet glow-getters
						</h2>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex">
							{Array.from({ length: 5 }).map((_, i) => (
								<StarIcon key={`hero-star-${i}`} className="h-4 w-4 fill-warm-tan text-warm-tan" />
							))}
						</div>
						<span className="text-sm text-muted-foreground">4.9 avg · 2,431 reviews</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{reviews.map((r) => (
						<article
							key={r.name}
							className="bg-sand/60 border border-border/60 rounded-sm p-6 sm:p-8 flex flex-col"
						>
							<div className="flex">
								{Array.from({ length: 5 }).map((_, i) => (
									<StarIcon key={`${r.name}-star-${i}`} className="h-3.5 w-3.5 fill-warm-tan text-warm-tan" />
								))}
							</div>
							<p className="mt-5 font-serif italic text-foreground/90 leading-relaxed">
								&ldquo;{r.quote}&rdquo;
							</p>
							<div className="mt-6 flex items-center gap-3 pt-5 border-t border-border/60">
								<div
									className="h-11 w-11 rounded-full bg-cover bg-center bg-clay"
									style={{ backgroundImage: `url(${r.avatar})` }}
								/>
								<div>
									<div className="text-sm font-medium text-foreground">{r.name}</div>
									<div className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
										{r.role}
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
