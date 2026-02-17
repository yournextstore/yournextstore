import { Award, Leaf, type LucideIcon, Mountain } from "lucide-react";

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
		description: "A portion of every sale goes to supporting local community organizations.",
	},
	{
		title: "90-Days Return Policy",
		description: "Not satisfied? Return within 90 days for a full refund, no questions asked.",
	},
];

const defaultIcons = [Leaf, Mountain, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 border-t border-border pt-12">
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-12 w-12 items-center justify-center bg-secondary transition-colors group-hover:bg-foreground">
								<Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
							</div>
							<h3 className="mb-2 font-heading text-base font-semibold tracking-wide">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
