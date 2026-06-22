import { Leaf, Sparkles, Sprout, Zap } from "lucide-react";

const props = [
	{
		icon: Zap,
		title: "12g Protein",
		copy: "Plant-powered fuel that actually tastes like a snack, not a supplement.",
	},
	{
		icon: Leaf,
		title: "Real ingredients",
		copy: "Marinated organic tofu, soy glaze, chili — no funky shortcuts.",
	},
	{
		icon: Sprout,
		title: "0g added sugar",
		copy: "Savory all the way. We let umami do the heavy lifting.",
	},
	{
		icon: Sparkles,
		title: "Shelf-stable",
		copy: "Pocket. Backpack. Glovebox. Open it anywhere, anytime.",
	},
];

export function ValueProps() {
	return (
		<section className="bg-cream-grain border-y border-charcoal/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center max-w-2xl mx-auto">
					<p className="font-display text-[11px] tracking-[0.32em] uppercase text-chili">Why tofu?</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal">
						SNACKS THAT BITE BACK.
					</h2>
					<p className="mt-4 text-mahogany/80 font-script italic text-lg">
						Crispy, chewy, glazed — and quietly stacked with protein.
					</p>
				</div>

				<div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{props.map((p) => (
						<div
							key={p.title}
							className="group relative rounded-3xl bg-card p-6 sm:p-7 border border-charcoal/10 shadow-[0_2px_0_rgba(58,26,18,0.04)] hover:shadow-[0_8px_30px_rgba(58,26,18,0.08)] hover:-translate-y-0.5 transition-all"
						>
							<div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-chili text-cream shadow-[0_3px_0_rgba(58,26,18,0.18)]">
								<p.icon className="h-5 w-5" />
							</div>
							<h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-charcoal">
								{p.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-mahogany/80">{p.copy}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
