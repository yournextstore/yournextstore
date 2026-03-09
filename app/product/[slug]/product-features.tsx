import { Flame, Leaf, type LucideIcon, Wheat } from "lucide-react";

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
		title: "All Natural Ingredients",
		description: "Made with responsibly sourced, organic ingredients. No preservatives, no fake stuff.",
	},
	{
		title: "Small Batch Crafted",
		description: "Each jar is carefully made in small batches to ensure maximum flavor and quality.",
	},
	{
		title: "Bold Flavour Guaranteed",
		description: "Our recipes are perfected over years. If it's not delicious, we'll make it right.",
	},
];

const defaultIcons = [Leaf, Wheat, Flame];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t-[3px] border-foreground pt-16">
			<h2 className="mb-12 text-center font-[family-name:var(--font-prompt)] text-3xl sm:text-4xl font-black uppercase tracking-tight">
				The good stuff
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5aff24] border-[3px] border-foreground shadow-[4px_4px_0_0_#000] transition-all group-hover:shadow-[2px_2px_0_0_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
								<Icon className="h-7 w-7 text-black" />
							</div>
							<h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
