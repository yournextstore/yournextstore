import { Leaf, type LucideIcon, ShieldCheck, Sprout } from "lucide-react";

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
		title: "Whole-food ingredients",
		description:
			"Every blend starts with hemp hearts, nutritional yeast, and farm-fresh aromatics — never fillers.",
	},
	{
		title: "Milled in small batches",
		description:
			"Hand-blended in our sunny Brooklyn kitchen so each pouch tastes like it was made yesterday.",
	},
	{
		title: "Third-party tested",
		description: "Every lot is screened for purity, potency, and the things you'd rather not eat.",
	},
];

const defaultIcons = [Leaf, Sprout, ShieldCheck];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[#1b2a2e]/10 pt-16">
			<h2 className="mb-12 text-center font-display text-3xl sm:text-4xl font-black tracking-tight text-[#1b2a2e]">
				Good for you. Great on toast.
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#9f9cf5]/20 text-[#1b2a2e] transition-colors group-hover:bg-[#f5a623] group-hover:text-[#1b2a2e]">
								<Icon className="h-7 w-7" />
							</div>
							<h3 className="mb-2 font-display text-xl font-bold text-[#1b2a2e]">{feature.title}</h3>
							<p className="text-sm text-[#1b2a2e]/70 leading-relaxed max-w-[28ch]">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
