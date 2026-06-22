import { Feather, Heart, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Drawn in our studio",
		description:
			"Every print, embroidery and silhouette is designed by our small in-house team in London — never repeated.",
		icon: Sparkles,
	},
	{
		title: "Heritage fabrics",
		description:
			"Sun-friendly cottons, breathable linens and softly draping viscose, chosen for the way they wear in.",
		icon: Feather,
	},
	{
		title: "Made to be loved",
		description:
			"Carefully finished hems, considered buttons and reinforced seams — built to be passed on, not thrown out.",
		icon: Heart,
	},
	{
		title: "Better for the planet",
		description:
			"100% of our cotton is responsibly sourced. We are working toward more sustainable fibres across the whole range.",
		icon: Leaf,
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 bg-cream/60 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-12 sm:mb-16">
					<p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-3">The Yns Way</p>
					<h2 className="font-serif text-3xl sm:text-4xl text-ink">Crafted with intention</h2>
				</div>
				<div className="grid gap-10 sm:gap-12 md:grid-cols-2">
					{features.map((feature) => {
						const Icon = feature.icon ?? Sparkles;
						return (
							<div key={feature.title} className="flex gap-5">
								<div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-full border border-ink/20 text-forest">
									<Icon className="h-5 w-5" strokeWidth={1.5} />
								</div>
								<div>
									<h3 className="font-serif text-xl text-ink mb-2">{feature.title}</h3>
									<p className="text-sm text-muted-foreground leading-relaxed font-light">
										{feature.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
