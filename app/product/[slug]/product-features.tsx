import { Droplets, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Plant-Based Lather",
		description:
			"Cold-pressed coconut and olive oils whip into a creamy, dense lather without a single drop of synthetic surfactant.",
	},
	{
		title: "Real Essential Oils",
		description:
			"Scent comes from steam-distilled botanicals, never fragrance oils. The smell is bold because the ingredients are real.",
	},
	{
		title: "Small-Batch Cure",
		description:
			"Each bar cures for 6 weeks in our studio so it lasts longer, lathers richer, and smells truer.",
	},
];

const defaultIcons = [Droplets, Leaf, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 pt-16 border-t border-[#e4d9c4]">
			<div className="text-center max-w-2xl mx-auto">
				<p className="font-script text-2xl text-[#4d4bc4]">made differently</p>
				<h2 className="mt-1 font-display text-4xl sm:text-5xl text-[#1a1a2e]">Crafted with intention</h2>
			</div>
			<div className="mt-12 grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col items-center text-center bg-[#fdf6ee] border border-[#e4d9c4] rounded-2xl p-7 hover:border-[#4d4bc4] transition-colors"
						>
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#b9bcf2]/40 text-[#4d4bc4] transition-colors group-hover:bg-[#1a1a2e] group-hover:text-[#fdf6ee]">
								<Icon className="h-6 w-6" />
							</div>
							<h3 className="mb-2 font-display text-2xl text-[#1a1a2e]">{feature.title}</h3>
							<p className="text-sm text-[#5c5b78] leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
