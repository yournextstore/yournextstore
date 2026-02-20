import { Award, Leaf, type LucideIcon, ShieldCheck } from "lucide-react";

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
		title: "Natural Ingredients",
		description: "Made from carefully selected natural and organic ingredients, free from harmful chemicals.",
	},
	{
		title: "Quality Certified",
		description: "Every product undergoes rigorous quality testing and comes with certified lab results.",
	},
	{
		title: "Wellness Focused",
		description: "Designed to support your overall health and wellbeing with proven natural compounds.",
	},
];

const defaultIcons = [Leaf, ShieldCheck, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 border-t border-border pt-12">
			<h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-foreground">
				Why Choose Our Products
			</h2>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col items-center text-center p-6 rounded-xl border border-border bg-white hover:shadow-md transition-shadow"
						>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary transition-colors">
								<Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
							</div>
							<h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
