import { Leaf, type LucideIcon, Recycle, Shirt } from "lucide-react";

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
		description: "Crafted from organic and recycled fibers with minimal environmental impact.",
	},
	{
		title: "Ethical Production",
		description: "Made in factories with perfect working conditions and fair wages.",
	},
	{
		title: "Built to Last",
		description: "Designed for longevity — both in terms of style expression and durability.",
	},
];

const defaultIcons = [Leaf, Recycle, Shirt];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
				Crafted with Intention
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center bg-brand-dark transition-colors">
								<Icon className="h-6 w-6 text-brand-yellow" />
							</div>
							<h3 className="mb-2 text-sm font-extrabold uppercase tracking-widest">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
