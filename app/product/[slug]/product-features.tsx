import { type LucideIcon, Sparkles, Wind, Zap } from "lucide-react";

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
		title: "Pure spark, zero crash",
		description: "Smooth caffeine from green tea leaves and natural adaptogens, no sugar cliff.",
	},
	{
		title: "Real fruit, real flavor",
		description: "Cold-pressed juices and botanicals — never an artificial syrup in sight.",
	},
	{
		title: "Brewed in small batches",
		description: "Every flavor is dialed in by hand. Quality stays consistent, can after can.",
	},
];

const defaultIcons = [Zap, Sparkles, Wind];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[var(--peach)]/60 pt-16">
			<h2 className="mb-12 text-center font-display text-4xl sm:text-5xl tracking-tight text-[var(--ink)]">
				Crafted for the <em>spark</em>
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length] ?? Zap;
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--peach-light)] border border-[var(--peach)] transition-colors group-hover:bg-[var(--coral)] group-hover:border-[var(--coral)]">
								<Icon className="h-6 w-6 text-[var(--coral)] transition-colors group-hover:text-[var(--cream)]" />
							</div>
							<h3 className="mb-2 font-display italic text-xl text-[var(--ink)]">{feature.title}</h3>
							<p className="text-sm text-[var(--ink)]/65 max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
