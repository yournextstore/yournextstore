import { Award, Droplets, Leaf, type LucideIcon, Recycle, Shield, Thermometer } from "lucide-react";

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
		title: "Double-Wall Insulation",
		description: "Vacuum-sealed stainless steel keeps drinks cold 24h and hot 12h.",
	},
	{
		title: "BPA-Free Materials",
		description: "Food-grade stainless steel and BPA-free components for safe daily use.",
	},
	{
		title: "Leak-Proof Design",
		description: "Precision-engineered lid with silicone seal prevents spills on the go.",
	},
	{
		title: "Eco-Friendly",
		description: "Reduce single-use plastic waste with a reusable bottle built to last.",
	},
	{
		title: "Durable Finish",
		description: "Powder-coated exterior resists scratches and provides a premium grip.",
	},
	{
		title: "Quality Guaranteed",
		description: "Built with premium components and backed by our satisfaction guarantee.",
	},
];

const defaultIcons = [Thermometer, Shield, Droplets, Recycle, Leaf, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="text-center mb-12">
				<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
					Product Specifications
				</span>
				<h2 className="mt-3 text-3xl font-light tracking-tight">Crafted with intention</h2>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex items-start gap-4 p-5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 transition-colors"
						>
							<div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
								<Icon className="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<h3 className="text-sm font-medium">{feature.title}</h3>
								<p className="mt-1 text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
