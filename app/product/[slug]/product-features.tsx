import { Flower, type LucideIcon, Sparkles, Sprout } from "lucide-react";

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
		title: "Foraged & farmed",
		description:
			"Botanicals are sourced from a tiny network of growers we visit each season — never anonymous, never industrial.",
	},
	{
		title: "Small-batch by hand",
		description:
			"Blended in 40-pouch runs in our Brooklyn studio. Each tin is dated, signed, and a little imperfect.",
	},
	{
		title: "Quietly extraordinary",
		description:
			"Slow recipes refined over hundreds of cups, balanced for the way you actually drink at home.",
	},
];

const defaultIcons = [Flower, Sprout, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="text-center max-w-2xl mx-auto">
				<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sage">
					<span className="h-px w-8 bg-sage" />
					What&rsquo;s in the pouch
					<span className="h-px w-8 bg-sage" />
				</span>
				<h2 className="mt-4 font-serif text-4xl sm:text-5xl tracking-tight text-foreground">
					Crafted with intention
				</h2>
			</div>
			<div className="mt-14 grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group rounded-3xl bg-cream p-8 ring-1 ring-border/60 hover:ring-sage transition-all"
						>
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 text-sage transition-colors group-hover:bg-sage group-hover:text-cream">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="font-serif text-2xl text-foreground">{feature.title}</h3>
							<p className="mt-3 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
