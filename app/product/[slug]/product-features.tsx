import { Gem, type LucideIcon, Ruler, Shirt } from "lucide-react";

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
		title: "Premium Fabrics",
		description: "Crafted from the finest materials for a soft, luxurious feel all day long.",
	},
	{
		title: "Perfect Fit",
		description: "Designed with flattering silhouettes and thoughtful sizing for every body.",
	},
	{
		title: "Timeless Design",
		description: "Classic styles that transition seamlessly from season to season.",
	},
];

const defaultIcons = [Shirt, Ruler, Gem];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center font-heading text-3xl sm:text-4xl font-light tracking-wide">
				Crafted with care
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center border border-border transition-colors group-hover:bg-foreground">
								<Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
							</div>
							<h3 className="mb-2 text-sm font-medium tracking-[0.1em] uppercase">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
