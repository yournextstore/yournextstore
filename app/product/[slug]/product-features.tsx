import { FlaskConical, Leaf, type LucideIcon, Sprout } from "lucide-react";

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
		title: "Wild-harvested mycelium",
		description: "Sourced from small mycology farms in the Pacific Northwest and Yunnan.",
	},
	{
		title: "Dual-extracted potency",
		description: "Hot water + alcohol extraction unlocks both polysaccharides and triterpenes.",
	},
	{
		title: "Third-party verified",
		description: "Every batch is tested for beta-glucans, heavy metals, and pesticides.",
	},
];

const defaultIcons = [Sprout, FlaskConical, Leaf];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<p className="font-label text-center text-[#8b7560] mb-3">THE FORMULATION</p>
			<h2 className="mb-12 text-center font-editorial text-3xl sm:text-4xl font-medium tracking-tight">
				Sourced, extracted, verified
			</h2>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#d6c8af] bg-[#fffaf0]">
								<Icon className="h-6 w-6 text-[#4a5bc4]" strokeWidth={1.5} />
							</div>
							<h3 className="mb-2 font-editorial text-lg font-medium">{feature.title}</h3>
							<p className="text-sm text-foreground/65 leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
