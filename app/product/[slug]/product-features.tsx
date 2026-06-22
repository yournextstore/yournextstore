import { Citrus, Hammer, type LucideIcon, Sun } from "lucide-react";

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
		title: "Made in small batches",
		description: "By a single workshop we visit by train at least twice a year.",
	},
	{
		title: "Patiently sourced",
		description: "We say no to anything that can't survive a careful trip across the sea.",
	},
	{
		title: "Built for the long lunch",
		description: "Designed for the kind of table where lemons live in a chipped ceramic bowl.",
	},
];

const defaultIcons = [Hammer, Sun, Citrus];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[#d8c4a8]/60 pt-16">
			<div className="text-center mb-12">
				<p className="font-script text-[#1f46c2] text-2xl sm:text-3xl">notes from the shop</p>
				<h2 className="mt-1 font-display text-3xl sm:text-4xl uppercase tracking-wide text-[#2a2622]">
					Crafted, then crated
				</h2>
			</div>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#d8c4a8] bg-[#fbf3e6] text-[#1f46c2] transition-colors group-hover:bg-[#1f46c2] group-hover:text-[#e8b547]">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="mb-2 font-display text-xl text-[#2a2622]">{feature.title}</h3>
							<p className="text-sm text-[#6b5e4e] max-w-xs leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
