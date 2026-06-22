import { Flame, type LucideIcon, Sprout, Zap } from "lucide-react";

type Feature = {
	title: string;
	description: string;
	icon?: LucideIcon;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "12g plant protein",
		description:
			"Marinated organic tofu, slow-glazed until the edges crisp. Real protein, no powder weirdness.",
	},
	{
		title: "Bold savory glaze",
		description: "Soy, chili, and a few quiet umami secrets. The kind of snack that earns a second bag.",
	},
	{
		title: "Made for movement",
		description: "Shelf-stable, pocket-sized, and zero refrigeration. Toss it in a bag and forget about it.",
	},
];

const defaultIcons = [Zap, Flame, Sprout];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-charcoal/10 pt-16">
			<p className="text-center font-display text-[11px] uppercase tracking-[0.32em] text-chili">
				What&apos;s inside
			</p>
			<h2 className="mb-12 mt-3 text-center font-display text-3xl sm:text-4xl font-extrabold uppercase text-charcoal">
				Snack-grade engineering.
			</h2>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group rounded-3xl border border-charcoal/10 bg-card p-6 sm:p-8 text-center transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(58,26,18,0.08)]"
						>
							<div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-chili text-cream shadow-[0_3px_0_rgba(58,26,18,0.18)] transition-transform group-hover:scale-110">
								<Icon className="h-6 w-6" />
							</div>
							<h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-charcoal">
								{feature.title}
							</h3>
							<p className="mt-3 text-sm text-mahogany/80 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
