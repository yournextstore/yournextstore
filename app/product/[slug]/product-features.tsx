import { Award, Hammer, Leaf, type LucideIcon } from "lucide-react";

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
		title: "Sustainable Materials",
		description: "FSC-certified hardwood frames and recycled fibers — built with intention, not waste.",
	},
	{
		title: "Master Craftsmanship",
		description: "Hand-finished by furniture makers with decades of experience in their workshops.",
	},
	{
		title: "Designed for Decades",
		description: "Reinforced joinery, premium textiles, and a 10-year warranty on every frame.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];
const accentColors = ["bg-[#ff6b35]", "bg-[#2f62f6]", "bg-[#1fb36b]"];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 sm:mt-20 rounded-[2rem] bg-white ring-1 ring-black/5 p-6 sm:p-10">
			<h2 className="font-display uppercase mb-10 sm:mb-12 text-center text-2xl sm:text-3xl text-[#0f0f0f]">
				Crafted with intention
			</h2>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="rounded-[1.5rem] bg-[#f5e8e4]/40 ring-1 ring-black/5 p-6 text-center"
						>
							<span
								className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${accentColors[index % accentColors.length]} text-white`}
							>
								<Icon className="h-5 w-5" />
							</span>
							<h3 className="font-display text-lg text-[#0f0f0f]">{feature.title}</h3>
							<p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
