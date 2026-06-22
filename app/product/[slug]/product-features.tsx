import { type LucideIcon, Settings, Shield, Wrench } from "lucide-react";

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
		title: "OEM Quality Parts",
		description: "Engineered to meet or exceed original equipment manufacturer specifications.",
	},
	{
		title: "Professional Grade",
		description: "Built for professional mechanics and serious DIY enthusiasts alike.",
	},
	{
		title: "Perfect Fit Guarantee",
		description: "Every part is guaranteed to fit your vehicle or your money back.",
	},
];

const defaultIcons = [Settings, Wrench, Shield];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 border-t border-border pt-12">
			<h2 className="mb-10 text-center font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight">
				Why Choose YNS Parts
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
								<Icon className="h-6 w-6 text-primary transition-colors group-hover:text-white" />
							</div>
							<h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
