import { Beaker, Heart, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Clinically formulated",
		description:
			"Co-developed with chemists and editorial stylists. Bond-rebuilding amino acids meet plant-derived ceramides — no greasy residue, no shortcuts.",
	},
	{
		title: "Color-safe & sulfate-free",
		description:
			"Gentle enough for fresh balayage and bleach, strong enough to dissolve product build-up after a week of dry shampoo.",
	},
	{
		title: "Made with love (and ritual)",
		description:
			"Vegan, cruelty-free, and bottled in fully recyclable glass. The kind of bathroom object you actually want on display.",
	},
];

const defaultIcons = [Beaker, Sparkles, Heart];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	const tiles = ["bg-yns-pink", "bg-yns-lavender", "bg-yns-pink-soft"];
	return (
		<section className="mt-20 border-t border-yns-pink-soft/60 pt-16">
			<p className="text-center text-[11px] tracking-[0.28em] uppercase font-bold text-yns-mauve">
				What&apos;s Inside
			</p>
			<h2 className="mt-4 mb-14 text-center yns-display text-3xl sm:text-4xl text-yns-ink not-italic uppercase">
				The good stuff, distilled.
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					const tile = tiles[index % tiles.length];
					return (
						<div
							key={feature.title}
							className="rounded-[24px] border border-yns-pink-soft/70 bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(155,143,184,0.5)]"
						>
							<div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${tile}`}>
								<Icon className="h-5 w-5 text-yns-ink" strokeWidth={1.5} />
							</div>
							<h3 className="mb-3 yns-display text-xl text-yns-ink not-italic uppercase">{feature.title}</h3>
							<p className="text-sm leading-relaxed text-yns-ink/70">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
