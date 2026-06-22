import { Heart, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Real fruit, no nonsense",
		description: "Made with juice and puree from actual fruit — never artificial flavors or colors.",
	},
	{
		title: "Plant-based & gluten-free",
		description: "Wobbly, jiggly, and made with ingredients you can pronounce. Vegan-friendly.",
	},
	{
		title: "Under 60 calories",
		description: "Light, refreshing, and packed with flavor — snack joy without the snack guilt.",
	},
];

const defaultIcons = [Sparkles, Leaf, Heart];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[var(--lilac)]/30 pt-16">
			<p className="text-center font-display text-xs uppercase tracking-[0.3em] text-[var(--pink)]">
				What&apos;s inside
			</p>
			<h2 className="mb-12 mt-3 text-center font-display text-3xl uppercase tracking-tight text-[var(--purple-deep)]">
				Clean, weird &amp; wonderful.
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pink)]/10 transition-colors group-hover:bg-[var(--pink)]">
								<Icon className="h-7 w-7 text-[var(--pink)] transition-colors group-hover:text-white" />
							</div>
							<h3 className="mb-2 font-display text-lg uppercase tracking-tight text-[var(--purple-deep)]">
								{feature.title}
							</h3>
							<p className="text-sm text-[var(--purple-deep)]/70 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
