import { Leaf, type LucideIcon, Sprout, Truck } from "lucide-react";

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
		title: "Sourced locally",
		description: "Partnered with family-run farms within 100 miles of your delivery zone.",
	},
	{
		title: "Picked at peak ripeness",
		description: "Harvested the morning your order ships — never warehoused, never waxed.",
	},
	{
		title: "Delivered in 30 minutes",
		description: "Refrigerated couriers and zero-waste packaging keep your basket fresh.",
	},
];

const defaultIcons = [Sprout, Leaf, Truck];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 rounded-3xl bg-cream border border-border p-10 sm:p-14">
			<p className="text-xs uppercase tracking-[0.18em] font-semibold text-forest/70 mb-3 text-center">
				The fresh promise
			</p>
			<h2 className="mb-12 text-center font-display text-3xl sm:text-4xl font-semibold tracking-tight text-forest-deep">
				Tended with care, every step.
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime/30 transition-colors group-hover:bg-lime">
								<Icon className="h-6 w-6 text-forest-deep" />
							</div>
							<h3 className="mb-2 font-display text-lg font-semibold text-forest-deep">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
