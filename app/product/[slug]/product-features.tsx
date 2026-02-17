import { Award, Gem, Heart, type LucideIcon } from "lucide-react";

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
		title: "Premium Leather",
		description: "Crafted from the finest full-grain leather, sourced from artisan tanneries.",
	},
	{
		title: "Expert Craftsmanship",
		description: "Each piece is carefully hand-assembled by skilled artisans with decades of experience.",
	},
	{
		title: "Timeless Design",
		description: "Classic silhouettes that transcend trends, designed to be your forever companion.",
	},
];

const defaultIcons = [Gem, Heart, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center font-[family-name:var(--font-playfair)] text-3xl tracking-tight">
				Crafted with intention
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream transition-colors group-hover:bg-navy">
								<Icon className="h-6 w-6 text-navy transition-colors group-hover:text-white" />
							</div>
							<h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
