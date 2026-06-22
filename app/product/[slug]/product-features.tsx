import { Heart, Leaf, type LucideIcon, Wheat } from "lucide-react";

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
		title: "Real ingredients",
		description: "Organic oats, honey, and whole nuts. Nothing you can't pronounce.",
	},
	{
		title: "Made with love",
		description: "Roasted in small batches by our family in the Hudson Valley.",
	},
	{
		title: "Gluten-free",
		description: "Certified GF facility. Tested every production run.",
	},
];

const defaultIcons = [Leaf, Heart, Wheat];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[#E5D3B7] pt-16">
			<h2 className="mb-12 text-center font-display text-3xl font-black uppercase tracking-tight text-[#2A2A2A] sm:text-4xl">
				Baked with intention
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F6ECDC] ring-1 ring-[#E5D3B7] transition-colors group-hover:bg-[#8C1F2A]">
								<Icon className="h-6 w-6 text-[#8C1F2A] transition-colors group-hover:text-[#FAF2E6]" />
							</div>
							<h3 className="mb-2 font-display text-lg font-bold uppercase tracking-tight text-[#2A2A2A]">
								{feature.title}
							</h3>
							<p className="max-w-xs text-sm text-[#5a4a3a]">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
