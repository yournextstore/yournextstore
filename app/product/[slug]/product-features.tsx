import { Droplets, Heart, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Real honey, not corn syrup",
		description: "Sweetness straight from the hive — nothing artificial, nothing weird.",
	},
	{
		title: "Built to fuel",
		description: "An electrolyte blend that supports steady energy through 60 minutes of play.",
	},
	{
		title: "Safe for the squad",
		description: "Made in a nut‑free facility. Non‑GMO, gluten‑free, dye‑free, allergen‑smart.",
	},
];

const defaultIcons = [Heart, Droplets, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t-2 border-foreground/20 pt-16">
			<div className="text-center">
				<span className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1 text-[10px] font-bold tracking-[0.25em]">
					WHY KIDS LOVE IT
				</span>
				<h2 className="mt-4 mb-12 text-center font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
					Feel‑good fuel, by design
				</h2>
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col items-center text-center rounded-3xl border-2 border-foreground/15 bg-[--color-butter] p-8 transition-transform hover:-translate-y-1"
						>
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white border-2 border-foreground">
								<Icon className="h-6 w-6 text-foreground" />
							</div>
							<h3 className="mb-2 font-display text-lg font-extrabold uppercase tracking-wide">
								{feature.title}
							</h3>
							<p className="text-sm text-foreground/70">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
