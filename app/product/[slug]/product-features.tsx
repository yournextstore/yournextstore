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
		title: "Premium Fabrics",
		description: "Crafted from the finest materials for lasting comfort and durability.",
	},
	{
		title: "Expert Tailoring",
		description: "Each piece is carefully constructed by skilled artisans with precision.",
	},
	{
		title: "Quality Guaranteed",
		description: "Built to last with premium components and rigorous quality standards.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 border-t border-border pt-14">
			<h2 className="mb-10 text-center font-heading text-2xl font-medium tracking-tight">
				Crafted with Intention
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-12 w-12 items-center justify-center bg-secondary transition-colors group-hover:bg-foreground">
								<Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
							</div>
							<h3 className="mb-2 text-sm font-semibold uppercase tracking-wider">{feature.title}</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
