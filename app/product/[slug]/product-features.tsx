import { Award, Diamond, Shield, Sparkles, type LucideIcon } from "lucide-react";

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
		title: "Ethically Sourced",
		description: "Every gemstone is responsibly sourced and certified, ensuring beauty with integrity.",
	},
	{
		title: "Master Craftsmanship",
		description: "Handcrafted by skilled artisans with decades of experience in fine jewelry.",
	},
	{
		title: "Lifetime Guarantee",
		description: "Each piece comes with our lifetime warranty and complimentary care services.",
	},
];

const defaultIcons = [Diamond, Sparkles, Shield];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border/50 pt-20">
			<div className="text-center mb-16">
				<p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">The Lumiere Promise</p>
				<h2 className="text-3xl font-serif font-light tracking-tight">Crafted with Excellence</h2>
				<div className="mt-6 w-16 h-px bg-primary/50 mx-auto" />
			</div>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-6 flex h-16 w-16 items-center justify-center border border-primary/30 transition-all duration-300 group-hover:border-primary group-hover:bg-primary/5">
								<Icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mb-3 text-sm tracking-[0.15em] uppercase font-medium">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
