import { Droplet, Leaf, type LucideIcon, RefreshCw } from "lucide-react";

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
		title: "Plant-Based Power",
		description:
			"Coconut surfactants and plant enzymes get clothes truly clean — without the synthetic stuff.",
	},
	{
		title: "Skin-Loving Formula",
		description:
			"No dyes, parabens, or sulfates. Dermatologist-tested for the most sensitive skin in your home.",
	},
	{
		title: "Refillable Forever",
		description: "Buy the bottle once. Refill with our concentrated pouches and skip 95% of the plastic.",
	},
];

const defaultIcons = [Droplet, Leaf, RefreshCw];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[#E0D5C1] pt-16">
			<p className="text-center uppercase tracking-[0.24em] text-xs text-[#6B92AC] font-semibold mb-3">
				Why It Works
			</p>
			<h2 className="mb-12 text-center headline-display text-3xl sm:text-4xl text-[#1F2A33]">
				Made for messes — minus the mess
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8FB1C7]/15 transition-colors group-hover:bg-[#1F2A33]">
								<Icon className="h-6 w-6 text-[#1F2A33] transition-colors group-hover:text-[#F5EFE6]" />
							</div>
							<h3 className="mb-2 text-lg font-semibold text-[#1F2A33]">{feature.title}</h3>
							<p className="text-sm text-[#3B4856] max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
