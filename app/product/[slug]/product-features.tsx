import { Award, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Sourced with Care",
		description:
			"Our teas come directly from traditional producers in China, Japan, and other renowned tea regions.",
	},
	{
		title: "Pure & Natural",
		description:
			"Every tea is free from artificial flavors and additives — just the pure leaf, as nature intended.",
	},
	{
		title: "Quality Guaranteed",
		description:
			"Each tea has been rigorously tested and curated by our experts before being added to our collection.",
	},
];

const defaultIcons = [Leaf, Sparkles, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center font-[family-name:var(--font-heading)] text-3xl font-medium tracking-tight">
				Crafted with Tradition
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tea-light transition-colors group-hover:bg-primary">
								<Icon className="h-6 w-6 text-tea transition-colors group-hover:text-primary-foreground" />
							</div>
							<h3 className="mb-2 text-sm font-semibold tracking-[0.1em] uppercase">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
