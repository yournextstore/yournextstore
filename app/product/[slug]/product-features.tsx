import { Citrus, Leaf, type LucideIcon, Snowflake } from "lucide-react";

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
		title: "Real fruit, real flavor",
		description: "Cold-pressed juice and natural extracts. No mystery syrups, no artificial colors.",
	},
	{
		title: "1/3 the sugar",
		description: "9g of cane sugar per can. Tastes like soda — not like a sugar crash.",
	},
	{
		title: "Best ice-cold",
		description: "Chill below 38°F for peak fizz. Pour over crushed ice for max chaos.",
	},
];

const defaultIcons = [Citrus, Leaf, Snowflake];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t-2 border-[var(--tizz-deep)]/15 pt-16">
			<p className="tizz-overline text-center text-[var(--tizz-orange)] text-xs mb-3">Why it works</p>
			<h2 className="mb-12 text-center tizz-display text-[var(--tizz-deep)] text-4xl sm:text-5xl">
				Built for the cooler.
			</h2>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group rounded-3xl border-2 border-[var(--tizz-deep)] bg-[var(--tizz-cream)] p-6 hover:bg-[var(--tizz-yellow)] transition-colors"
						>
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tizz-orange)] text-[var(--tizz-cream)]">
								<Icon className="h-7 w-7" strokeWidth={2.5} />
							</div>
							<h3 className="mb-2 tizz-display text-[var(--tizz-deep)] text-2xl">{feature.title}</h3>
							<p className="text-sm text-[var(--tizz-deep)]/75 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
