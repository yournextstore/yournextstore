import { FlaskConical, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Enzyme-forward",
		description:
			"Targeted proteases break down protein chains so your body can absorb more amino acids from every meal.",
	},
	{
		title: "Clinically informed",
		description:
			"Formulated with peer-reviewed ingredient ratios and third-party tested for purity, potency, and contaminants.",
	},
	{
		title: "Quietly powerful",
		description:
			"No jitters, no stim crashes. Just steadier energy, sharper focus, and a metabolism that earns its keep.",
	},
];

const defaultIcons = [Leaf, FlaskConical, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border/60 pt-16">
			<p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-terracotta">
				Built for the long protocol
			</p>
			<h2 className="mt-3 mb-12 text-center font-display text-3xl sm:text-4xl text-ink tracking-tight">
				Crafted with intention
			</h2>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center px-2">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-terracotta/30 bg-[color:var(--secondary)] transition-colors group-hover:bg-terracotta">
								<Icon
									className="h-6 w-6 text-terracotta transition-colors group-hover:text-cream"
									strokeWidth={1.6}
								/>
							</div>
							<h3 className="mb-2 font-display text-2xl text-ink">{feature.title}</h3>
							<p className="text-sm text-clay leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
