import { Leaf, type LucideIcon, Scissors, Sun } from "lucide-react";

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
		title: "Cut & finished by hand",
		description:
			"Drafted on the body, sewn in our family-run atelier. Each piece moves through six pairs of hands before it ships.",
	},
	{
		title: "Honest, natural fibres",
		description:
			"Belgian linen, Japanese cotton, and undyed merino. Sun-bleached neutrals built to fade beautifully with wear.",
	},
	{
		title: "Made to be kept",
		description:
			"Reinforced seams and replaceable hardware. Free lifetime alterations and mending at our Lisbon studio.",
	},
];

const defaultIcons = [Scissors, Leaf, Sun];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="text-center max-w-xl mx-auto mb-14">
				<p className="text-[11px] tracking-[0.36em] uppercase text-bronze">The atelier note</p>
				<h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight">
					Crafted with intention
				</h2>
			</div>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-start">
							<span className="font-display italic text-bronze text-2xl mb-3">0{index + 1}</span>
							<div className="flex items-center gap-3 mb-3">
								<Icon className="h-4 w-4 text-foreground/80" strokeWidth={1.5} />
								<h3 className="text-lg font-medium text-foreground">{feature.title}</h3>
							</div>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
