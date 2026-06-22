import { Flame, type LucideIcon, Sprout, Wand2 } from "lucide-react";

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
		title: "Hand-thrown",
		description: "Every piece is shaped on a stone wheel and signed underneath by the maker.",
	},
	{
		title: "Mineral glazes",
		description: "Mixed in studio from raw pigments. Small variations make each piece unique.",
	},
	{
		title: "Kiln-fired slowly",
		description: "Twin firings over forty hours produce stoneware that ages with patina, not wear.",
	},
];

const defaultIcons = [Wand2, Sprout, Flame];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="text-center mb-12">
				<span className="text-[10px] tracking-[0.28em] uppercase text-[var(--mahogany)] font-medium">
					The Craft
				</span>
				<h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-tight text-foreground">
					Made by hand, by name.
				</h2>
			</div>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col items-center text-center rounded-2xl border border-border bg-[var(--bone)] p-8 transition-colors hover:bg-[var(--sand)]/40"
						>
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sand)] transition-colors group-hover:bg-foreground">
								<Icon className="h-6 w-6 text-[var(--mahogany)] transition-colors group-hover:text-[var(--bone)]" />
							</div>
							<h3 className="mb-2 font-display text-2xl text-foreground">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
