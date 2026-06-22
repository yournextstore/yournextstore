import { Activity, FlaskConical, type LucideIcon, Sprout } from "lucide-react";

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
		title: "Mitochondrial first",
		description:
			"Each active is selected for measurable downstream effect on ATP — not a vague feeling of wellness.",
	},
	{
		title: "Compounding, not stacking",
		description:
			"Thirteen ingredients formulated to work with each other across NAD+, methylation, and redox pathways.",
	},
	{
		title: "Quiet daily ritual",
		description: "One dose, ninety days. The smallest unit at which the body adapts and holds.",
	},
];

const defaultIcons = [Activity, FlaskConical, Sprout];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="text-center max-w-2xl mx-auto">
				<p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
					Designed with intention
				</p>
				<h2 className="mt-4 font-display text-[1.8rem] sm:text-[2.4rem] leading-[1.05] tracking-[-0.025em]">
					Built for the long arc.
				</h2>
			</div>
			<div className="mt-14 grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-start text-left">
							<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-bone-deep">
								<Icon className="h-5 w-5 text-moss" />
							</div>
							<p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
								{String(index + 1).padStart(2, "0")}
							</p>
							<h3 className="mt-2 font-display text-[1.25rem] tracking-[-0.02em] text-foreground">
								{feature.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
