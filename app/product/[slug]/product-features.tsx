import { Award, Hammer, Leaf, type LucideIcon } from "lucide-react";

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
		title: "Made for parents",
		description: "Shaped through years of conversations with families. Every curve has a reason.",
	},
	{
		title: "Considered materials",
		description: "Food-safe glass and medical-grade silicone. Nothing that doesn't need to be there.",
	},
	{
		title: "Designed to last",
		description: "We build for second siblings. Dishwasher and sterilizer safe, for years of use.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-[var(--border)] pt-20">
			<p className="text-center text-[10px] tracking-[0.32em] uppercase text-foreground/60 mb-4">
				— Why it matters
			</p>
			<h2 className="mb-16 text-center font-display text-4xl md:text-5xl leading-tight">
				A new era of nurturing
			</h2>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] transition-colors group-hover:bg-[var(--olive-dark)] group-hover:border-[var(--olive-dark)]">
								<Icon
									className="h-5 w-5 text-[var(--olive-dark)] transition-colors group-hover:text-[var(--cream)]"
									strokeWidth={1.4}
								/>
							</div>
							<h3 className="mb-3 font-display text-2xl">{feature.title}</h3>
							<p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
