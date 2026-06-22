import { Flame, Leaf, type LucideIcon, Sprout } from "lucide-react";

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
		title: "Grass-fed cream",
		description: "Sourced from regenerative dairies — sweeter pasture, deeper color, richer mouthfeel.",
	},
	{
		title: "High smoke point",
		description: "485°F. Sear, fry, roast — no smoking, no burning, just glossy golden caramelization.",
	},
	{
		title: "Slow simmered",
		description: "Hours in copper at low heat. We skim, never strain through plastic. You can taste it.",
	},
];

const defaultIcons = [Leaf, Flame, Sprout];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-mahogany/15 pt-20">
			<p className="font-mono mb-3 text-center text-[11px] uppercase tracking-[0.3em] text-amber-deep">
				/ why this jar
			</p>
			<h2
				className="font-display mb-14 text-center text-4xl font-medium tracking-tight text-mahogany sm:text-5xl"
				style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
			>
				crafted with intention.
			</h2>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-mahogany/20 bg-honey/40">
								<Icon className="h-6 w-6 text-amber-deep" strokeWidth={1.5} />
							</div>
							<h3
								className="font-display mb-3 text-2xl text-mahogany"
								style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
							>
								{feature.title}
							</h3>
							<p className="font-mono text-xs leading-relaxed text-mahogany/65">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
