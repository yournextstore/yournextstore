import { Hammer, Leaf, type LucideIcon, Trees } from "lucide-react";

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
		title: "Slow-grown timber",
		description:
			"FSC-certified oak and ash from sustainably managed European forests. Air-dried for a year before milling.",
	},
	{
		title: "Hand-finished in Porto",
		description:
			"Each piece passes through six pairs of hands — from joinery to upholstery to the final inspection at our atelier.",
	},
	{
		title: "Made to be repaired",
		description:
			"Re-upholster, replace cushions, refresh oils. Every component is designed to be serviced — not discarded.",
	},
];

const defaultIcons = [Trees, Hammer, Leaf];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t hairline pt-16">
			<div className="mx-auto max-w-2xl text-center mb-14">
				<p className="eyebrow text-[var(--clay)] mb-3">Craft notes</p>
				<h2 className="font-display text-4xl tracking-tight text-foreground">Made slowly, on purpose.</h2>
			</div>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-start text-left border-t hairline pt-6">
							<div className="mb-5 flex h-10 w-10 items-center justify-center rounded-sm border hairline text-[var(--forest)]">
								<Icon className="h-4 w-4" />
							</div>
							<h3 className="mb-3 font-display text-2xl text-foreground">{feature.title}</h3>
							<p className="text-sm leading-relaxed text-foreground/65">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
