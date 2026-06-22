import { Beaker, Leaf, type LucideIcon, Sprout } from "lucide-react";

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
		title: "Botanical Actives",
		description: "Single-origin polyphenols, cold-extracted at 21°C to preserve molecular integrity.",
	},
	{
		title: "Clinically Dosed",
		description:
			"Every formulation is tested for efficacy at the published concentration — no marketing dust.",
	},
	{
		title: "Calibrated for Skin",
		description:
			"pH-balanced and dermatologist-reviewed for sensitive, normal and compromised skin barriers.",
	},
];

const defaultIcons = [Leaf, Beaker, Sprout];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border/70 pt-20">
			<div className="grid lg:grid-cols-12 gap-10">
				<div className="lg:col-span-4">
					<p className="uppercase-display text-[10.5px] tracking-[0.24em] text-muted-foreground">
						The Formulation
					</p>
					<h2 className="mt-3 uppercase-display text-3xl sm:text-4xl text-foreground tracking-tight leading-[1.05]">
						Engineered, not embellished.
					</h2>
				</div>
				<div className="lg:col-span-8 grid sm:grid-cols-3 gap-px bg-border/70 border border-border/70">
					{features.map((feature, index) => {
						const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
						return (
							<div key={feature.title} className="bg-background p-7 flex flex-col gap-4">
								<Icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
								<div className="uppercase-display text-[10px] tracking-[0.2em] text-muted-foreground">
									{String(index + 1).padStart(2, "0")} · Note
								</div>
								<h3 className="text-base font-medium text-foreground leading-snug">{feature.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
