import { Beaker, Droplets, type LucideIcon, ShieldCheck } from "lucide-react";

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
		title: "Dermatologist Formulated",
		description: "Developed with dermatologists for personalized care tailored to your skin's needs.",
	},
	{
		title: "Clinically Tested",
		description: "Rigorously tested ingredients backed by science for proven results you can trust.",
	},
	{
		title: "Clean Ingredients",
		description: "Free from parabens, sulfates, and harsh chemicals. Only what your skin truly needs.",
	},
];

const defaultIcons = [Beaker, ShieldCheck, Droplets];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center font-heading text-3xl font-bold tracking-tight">
				Backed by Science, Perfected for You
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-sage/10 transition-colors group-hover:bg-brand-sage/20">
								<Icon className="h-6 w-6 text-brand-sage transition-colors" />
							</div>
							<h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
