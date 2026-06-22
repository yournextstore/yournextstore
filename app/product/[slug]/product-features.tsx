import { Flame, Hammer, LeafyGreen, type LucideIcon } from "lucide-react";

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
		title: "Small Batch Heresy",
		description: "Three hundred jars per run. When they're gone, you wait for the next pot.",
	},
	{
		title: "Hand-Jarred In Brooklyn",
		description: "Cooked low, jarred hot, sealed by people who care if it's right.",
	},
	{
		title: "Real Ingredients Only",
		description: "San Marzano tomatoes, real wine, real chilies. No sugar, no fillers, no shortcuts.",
	},
];

const defaultIcons = [Flame, Hammer, LeafyGreen];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-soot/10 pt-16">
			<span className="block text-center font-condensed text-[11px] tracking-[0.32em] text-ember">
				What&apos;s In The Jar
			</span>
			<h2 className="mt-4 text-center font-display text-5xl text-soot">No shortcuts.</h2>
			<div className="mt-12 grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-5 flex h-16 w-16 items-center justify-center bg-ember text-cream transition-colors group-hover:bg-soot">
								<Icon className="h-7 w-7" />
							</div>
							<h3 className="mb-2 font-display text-2xl text-soot">{feature.title}</h3>
							<p className="text-sm text-muted-foreground max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
