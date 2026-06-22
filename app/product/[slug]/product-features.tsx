import { HandHeart, Leaf, type LucideIcon, Sprout } from "lucide-react";

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
		title: "Pasture-raised goodness",
		description: "Sourced from small farms where animals graze on real grass under real skies.",
	},
	{
		title: "Made by real hands",
		description: "Mixed, poured, and labeled in small batches by people we know by name.",
	},
	{
		title: "Wholesome, full stop",
		description: "No funky additives, no artificial flavors — just the good stuff that's always worked.",
	},
];

const defaultIcons = [Sprout, HandHeart, Leaf];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t-2 border-dashed border-[#d9c1a3] pt-16">
			<p className="text-center font-display text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8b5e3c]">
				Why it{"'"}s good
			</p>
			<h2 className="mt-3 text-center font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#4a2c1a]">
				Made with intention
			</h2>
			<div className="mt-12 grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fbf4e8] border-2 border-[#c99a5e] transition-transform group-hover:-rotate-6">
								<Icon className="h-7 w-7 text-[#8b5e3c]" />
							</div>
							<h3 className="font-display mb-2 text-xl font-extrabold text-[#4a2c1a]">{feature.title}</h3>
							<p className="text-sm text-[#8b5e3c] leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
