import { Leaf, type LucideIcon, ShieldCheck, Zap } from "lucide-react";

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
		title: "Natural Caffeine",
		description: "200mg of plant-derived caffeine per pouch — no synthetic stimulants, ever.",
		icon: Zap,
	},
	{
		title: "Clean Ingredients",
		description: "Zero sugar, zero calories, zero nicotine. Just natural flavors and B-vitamins.",
		icon: Leaf,
	},
	{
		title: "Lab Verified",
		description: "Every batch is third-party tested for purity, potency, and safety standards.",
		icon: ShieldCheck,
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-20">
			<p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-foreground/60">
				Why YNS
			</p>
			<h2 className="mb-16 text-center font-display text-4xl uppercase tracking-tight sm:text-5xl lg:text-6xl">
				Engineered for focus.
			</h2>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultFeatures[index % defaultFeatures.length].icon ?? Zap;
					return (
						<div
							key={feature.title}
							className="group relative flex flex-col items-start border-l-2 border-foreground/10 pl-6 transition-all hover:border-zap"
						>
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-zap text-foreground transition-transform group-hover:rotate-12">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="mb-3 font-display text-2xl uppercase tracking-tight">{feature.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
