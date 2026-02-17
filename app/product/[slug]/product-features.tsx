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
		title: "OEM-Grade Parts",
		description:
			"All parts meet or exceed original equipment manufacturer specifications for perfect fitment.",
	},
	{
		title: "Expert Installation Support",
		description: "Detailed guides and tech support to help you install with confidence.",
	},
	{
		title: "Performance Guaranteed",
		description: "Engineered for durability and peak performance under demanding conditions.",
	},
];

const defaultIcons = [Settings, Wrench, Shield];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-16 border-t border-border pt-12">
			<h2 className="mb-10 text-center font-heading text-2xl font-bold uppercase tracking-wide">
				Why Choose Our Parts
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center bg-brand text-brand-foreground transition-colors group-hover:bg-foreground group-hover:text-primary-foreground">
								<Icon className="h-6 w-6" />
							</div>
							<h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wide">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
