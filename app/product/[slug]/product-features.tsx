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
		description: "Crafted from carefully selected materials for lasting comfort and style.",
	},
	{
		title: "Expert Tailoring",
		description: "Each piece is meticulously constructed by skilled artisans.",
	},
	{
		title: "Quality Assured",
		description: "Rigorous quality standards ensure every item meets our exacting specifications.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 border-t border-border pt-12">
			<h2 className="mb-10 text-center text-sm font-semibold tracking-[0.15em] uppercase">Why Choose Us</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-12 w-12 items-center justify-center border border-border transition-colors group-hover:bg-foreground">
								<Icon className="h-5 w-5 text-foreground/40 transition-colors group-hover:text-primary-foreground" />
							</div>
							<h3 className="mb-2 text-sm font-medium">{feature.title}</h3>
							<p className="text-xs text-foreground/50 max-w-[240px]">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
