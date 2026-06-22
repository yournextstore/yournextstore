import { Coffee, Droplets, Leaf, type LucideIcon } from "lucide-react";

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
		title: "Slow-Roasted Espresso",
		description: "Single-origin beans pulled just past first crack — never burnt, always layered.",
	},
	{
		title: "Hand-Pressed Citrus",
		description: "Sun-ripe peel zested into our cold-press, hours from harvest, for a brighter sip.",
	},
	{
		title: "Lightly Sparkling",
		description: "A whisper of fizz that lifts the cocoa, citrus and crema without burying them.",
	},
];

const defaultIcons = [Coffee, Leaf, Droplets];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<p className="font-script text-2xl text-terracotta text-center mb-3">Craft, all the way down</p>
			<h2 className="mb-14 text-center font-display text-3xl sm:text-4xl text-espresso">
				Brewed with intention.
			</h2>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary border border-terracotta/30 transition-colors group-hover:bg-terracotta">
								<Icon className="h-6 w-6 text-terracotta transition-colors group-hover:text-cream" />
							</div>
							<h3 className="mb-3 font-display text-2xl text-espresso">{feature.title}</h3>
							<p className="text-sm text-espresso/65 leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
