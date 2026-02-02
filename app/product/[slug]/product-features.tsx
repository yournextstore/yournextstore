import { Headphones, type LucideIcon, Shield, Truck } from "lucide-react";

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
		title: "Premium Sound",
		description: "Crystal clear audio with deep bass and crisp highs for an immersive experience.",
	},
	{
		title: "2-Year Warranty",
		description: "Full coverage warranty with hassle-free repairs and replacements.",
	},
	{
		title: "Free Shipping",
		description: "Complimentary express shipping on all orders over $100.",
	},
];

const defaultIcons = [Headphones, Shield, Truck];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-12">
			<div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft">
				<h2 className="mb-10 text-center text-2xl md:text-3xl font-bold tracking-tight">
					Why Choose Aura Audio
				</h2>
				<div className="grid gap-6 md:grid-cols-3">
					{features.map((feature, index) => {
						const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
						return (
							<div
								key={feature.title}
								className="group flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
							>
								<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary group-hover:scale-110">
									<Icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
								</div>
								<h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
