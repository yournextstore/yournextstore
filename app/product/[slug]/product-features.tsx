import { HeartHandshake, Leaf, type LucideIcon, Rabbit, Sparkles } from "lucide-react";

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
		title: "Clean Ingredients",
		description: "Plant-derived, EWG-aware formulas — free of sulfates, parabens and synthetic fragrance.",
		icon: Leaf,
	},
	{
		title: "Cruelty Free",
		description: "Leaping Bunny certified, vegan, and never tested on animals. Pet-approved by ours.",
		icon: Rabbit,
	},
	{
		title: "Gentle by Design",
		description: "Soft enough for sensitive skin, balanced for the natural pH of a dog's coat.",
		icon: Sparkles,
	},
	{
		title: "Made with Love",
		description: "Mixed in small batches and packed with a complimentary linen bandana on every order.",
		icon: HeartHandshake,
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="text-center">
				<p className="text-[11px] yns-letter-spacing-mid uppercase text-muted-foreground">
					Made with intention
				</p>
				<h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-foreground">
					Crafted with <em className="italic">care.</em>
				</h2>
			</div>
			<div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
				{features.map((feature) => {
					const Icon = feature.icon ?? Leaf;
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/30 text-foreground">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="font-serif text-xl italic font-light text-foreground">{feature.title}</h3>
							<p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
