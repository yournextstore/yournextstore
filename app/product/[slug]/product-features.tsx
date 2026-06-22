import { Flower2, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Whole-plant botanicals",
		description: "Foraged, gently dried and milled in small batches — no synthetic stand-ins.",
	},
	{
		title: "Prebiotic nutrients",
		description: "Formulated with vitamins, minerals and antioxidants that support daily wellness.",
	},
	{
		title: "Quietly considered",
		description: "Glass vessels, plant-based inks, and a soft footprint from garden to shelf.",
	},
];

const defaultIcons = [Leaf, Sparkles, Flower2];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="text-center max-w-xl mx-auto mb-12">
				<span className="text-xs uppercase tracking-[0.25em] text-terracotta font-medium">
					Made with care
				</span>
				<h2 className="mt-3 font-serif text-3xl sm:text-4xl text-cocoa">Crafted with botanical intention</h2>
			</div>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sand ring-1 ring-cocoa/10 transition-colors group-hover:bg-sage">
								<Icon className="h-6 w-6 text-terracotta transition-colors group-hover:text-cocoa" />
							</div>
							<h3 className="mb-2 font-serif text-2xl text-cocoa">{feature.title}</h3>
							<p className="text-sm text-cocoa/70 leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
