import { Droplets, Heart, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Clean Ingredients",
		description: "Made with 100% clean, non-irritating ingredients that are safe for all skin types.",
	},
	{
		title: "Cruelty Free",
		description: "Never tested on animals. We believe in beauty without compromise.",
	},
	{
		title: "Dermatologist Tested",
		description: "Clinically tested and approved by leading dermatologists worldwide.",
	},
];

const defaultIcons = [Droplets, Heart, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center font-heading text-3xl font-light tracking-wide">Crafted with care</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary">
								<Icon
									className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground"
									strokeWidth={1.5}
								/>
							</div>
							<h3 className="mb-2 text-sm font-medium tracking-wide uppercase">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
