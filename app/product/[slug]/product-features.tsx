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
		description: "Crafted from responsibly sourced materials with minimal environmental impact.",
	},
	{
		title: "Expert Craftsmanship",
		description: "Each piece is carefully made by skilled artisans with attention to detail.",
	},
	{
		title: "Quality Guaranteed",
		description: "Built to last with premium components and rigorous quality standards.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-18 border-t border-border/80 pt-14">
			<div className="mb-10 max-w-2xl space-y-3">
				<p className="editorial-kicker">Craft Notes</p>
				<h2 className="section-title">Built with material honesty and a longer view.</h2>
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="surface-panel p-6">
							<div className="mb-5 flex h-11 w-11 items-center justify-center border border-border/80 bg-background">
								<Icon className="h-[1.125rem] w-[1.125rem] text-muted-foreground" />
							</div>
							<h3 className="mb-2 font-medium text-foreground">{feature.title}</h3>
							<p className="text-sm leading-7 text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
