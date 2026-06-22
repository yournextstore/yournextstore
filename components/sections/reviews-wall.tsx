import { Star } from "lucide-react";

const reviews = [
	{
		name: "Jamie L.",
		role: "Runs 5x / week",
		flavor: "Green Mint Chip",
		text: "The texture is genuinely creamy — not that chalky protein-tub thing. I finished a pint after a long run with zero regret.",
		stars: 5,
		accent: "var(--yns-mint)",
	},
	{
		name: "Devon R.",
		role: "Powerlifting coach",
		flavor: "Chocolate Bliss",
		text: "Macros line up with what's on the lid. I've put 6 of my athletes on subscription. That should tell you everything.",
		stars: 5,
		accent: "var(--yns-peach)",
	},
	{
		name: "Priya S.",
		role: "New mom, sleeps maybe",
		flavor: "Honey Cinnamon",
		text: "My 9pm reward. Tastes like a dessert from a real ice cream shop, not a supplement. Honey Cinnamon is unreal.",
		stars: 5,
		accent: "var(--yns-honey)",
	},
	{
		name: "Marcus T.",
		role: "Bodybuilder, cutting",
		flavor: "Vanilla Bean",
		text: "30g of protein and I'm not having existential dread about my prep. Vanilla bean specks, real cream — it eats heavy.",
		stars: 5,
		accent: "var(--yns-cyan)",
	},
	{
		name: "Ana V.",
		role: "Pilates instructor",
		flavor: "Green Mint Chip",
		text: "I'm not a 'protein dessert' person but my partner left a pint in the freezer and now I am. Mint chip is my whole personality.",
		stars: 5,
		accent: "var(--yns-mint)",
	},
	{
		name: "Theo K.",
		role: "Climber, gen pop",
		flavor: "Chocolate Bliss",
		text: "Tastes like the real thing. Reads like a supplement. The label is short enough I actually read it.",
		stars: 4,
		accent: "var(--yns-peach)",
	},
];

export function ReviewsWall() {
	return (
		<section className="bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div>
						<div className="font-display uppercase tracking-[0.2em] text-xs text-[var(--yns-cyan)]">
							Customer Wall
						</div>
						<h2 className="mt-3 font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
							4.9 / 5<span className="text-white/40"> · 2,841 reviews</span>
						</h2>
					</div>
					<div className="flex items-center gap-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star key={i} className="h-5 w-5 fill-[var(--yns-honey)] text-[var(--yns-honey)]" />
						))}
					</div>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{reviews.map((r) => (
						<article
							key={r.name}
							className="group relative rounded-3xl border border-white/10 bg-white/[0.02] p-7 hover:border-white/25 transition-colors"
						>
							<div className="flex items-center gap-1 mb-4">
								{Array.from({ length: r.stars }).map((_, i) => (
									<Star key={i} className="h-4 w-4 fill-[var(--yns-honey)] text-[var(--yns-honey)]" />
								))}
							</div>
							<p className="text-white/85 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
							<div className="mt-6 flex items-center justify-between">
								<div>
									<div className="font-display uppercase text-sm tracking-wide text-white">{r.name}</div>
									<div className="text-xs text-white/50">{r.role}</div>
								</div>
								<span
									className="rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-[0.16em] text-black"
									style={{ background: r.accent }}
								>
									{r.flavor}
								</span>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
