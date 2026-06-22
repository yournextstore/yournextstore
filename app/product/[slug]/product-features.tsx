import { Heart, type LucideIcon, Sparkles, WashingMachine } from "lucide-react";

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
		title: "Cloud-soft cuddles",
		description: "Cloud-pile fabric and dreamy stuffing that's perfect for nuzzling, hugging and napping.",
	},
	{
		title: "Hand-stitched smiles",
		description: "Each face is sewn by hand in our London studio — no two friends are exactly the same.",
	},
	{
		title: "Surface washable",
		description: "Spot clean with a gentle dab — built for everyday adventures, from picnics to puddles.",
	},
];

const defaultIcons = [Heart, Sparkles, WashingMachine];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="text-center mb-12">
				<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-peach)]">
					Made with love
				</span>
				<h2
					className="mt-2 font-heading text-3xl text-foreground"
					style={{ fontVariationSettings: "'SOFT' 100" }}
				>
					Cuddled, crafted, character-tested
				</h2>
			</div>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-mint-soft)] transition-colors group-hover:bg-[var(--color-peach)]">
								<Icon className="h-6 w-6 text-[var(--color-mint-deep)] transition-colors group-hover:text-white" />
							</div>
							<h3 className="mb-2 font-heading text-lg" style={{ fontVariationSettings: "'SOFT' 100" }}>
								{feature.title}
							</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
