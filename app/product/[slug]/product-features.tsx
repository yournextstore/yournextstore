import { Leaf, Scissors, Sprout } from "lucide-react";

type Feature = {
	title: string;
	description: string;
};

const defaultFeatures: Feature[] = [
	{
		title: "Hand-loomed silk",
		description:
			"Each metre is woven on heritage looms in a single family atelier — slow work, with the quiet imperfection the loom leaves behind.",
	},
	{
		title: "Cut to soften",
		description:
			"Patterns are graded to drape immediately and yield with wear, so the garment fits more like itself with every season.",
	},
	{
		title: "Mendable by design",
		description:
			"Generous seam allowances, replaceable buttons, and a free first repair — a piece you can keep returning to.",
	},
];

const featureIcons = [Leaf, Scissors, Sprout];

export function ProductFeatures({ features = defaultFeatures }: { features?: Feature[] }) {
	return (
		<section className="mt-24 border-t border-border/70 pt-20">
			<div className="text-center max-w-2xl mx-auto mb-16">
				<p className="font-eyebrow text-[10px] text-muted-foreground mb-4">— Slow craft —</p>
				<h2 className="font-serif font-light text-foreground text-[36px] sm:text-[48px] tracking-tight leading-[1.05]">
					Made with intention,
					<br />
					<em className="italic text-foreground/70">to be worn for years.</em>
				</h2>
			</div>
			<div className="grid gap-12 md:gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = featureIcons[index % featureIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-start text-left md:px-6">
							<Icon className="mb-5 h-5 w-5 text-foreground/70" strokeWidth={1.25} />
							<h3 className="font-serif text-[22px] font-light tracking-tight text-foreground mb-3">
								{feature.title}
							</h3>
							<p className="text-[14px] leading-[1.7] text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
