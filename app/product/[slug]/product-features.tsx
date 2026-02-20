import { Clock, Droplets, type LucideIcon, RotateCcw } from "lucide-react";

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
		title: "Waterproof Construction",
		description: "Made with water-resistant fabric and sealed seams to keep you dry in any weather.",
	},
	{
		title: "Same Day Dispatch",
		description: "All orders placed before 4pm Monday to Friday are dispatched the same day.",
	},
	{
		title: "Free Returns",
		description: "30 days from shipping date to return your purchase free of charge.",
	},
];

const defaultIcons = [Droplets, Clock, RotateCcw];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 border-t border-border pt-12">
			<h2 className="mb-10 text-center text-xl font-medium uppercase tracking-wide">Why Choose Us</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<Icon className="h-6 w-6 text-foreground mb-4" strokeWidth={1.5} />
							<h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">{feature.title}</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
