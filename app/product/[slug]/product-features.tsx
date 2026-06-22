import { Leaf, type LucideIcon, RotateCcw, Store } from "lucide-react";

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
		title: "Supporting Local Charity",
		description: "A portion of every purchase goes to local community organizations.",
	},
	{
		title: "90-Days Return Policy",
		description: "Not satisfied? Return it within 90 days for a full refund, no questions asked.",
	},
];

const defaultIcons = [Leaf, Store, RotateCcw];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-4 flex h-12 w-12 items-center justify-center">
								<Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
							</div>
							<h3 className="mb-2 text-sm font-semibold uppercase tracking-widest">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
