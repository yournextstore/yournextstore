import { Hammer, type LucideIcon, Repeat, Shield, Truck } from "lucide-react";

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
		title: "Made to last",
		description: "Spec'd around real-world abuse — cobblestones, rain, the back of a sedan.",
		icon: Hammer,
	},
	{
		title: "10-year frame guarantee",
		description: "If the frame fails, we replace it. Free of charge, for a decade.",
		icon: Shield,
	},
	{
		title: "Free 48-hour shipping",
		description: "Most orders ship the same day from our Brooklyn warehouse.",
		icon: Truck,
	},
	{
		title: "Endlessly repairable",
		description: "Every part sold separately. A 6mm hex is the only tool you'll ever need.",
		icon: Repeat,
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="text-center mb-12">
				<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
					<span className="block h-px w-8 bg-brick" />
					Why YNS
				</span>
				<h2 className="mt-4 font-display-wide text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] uppercase tracking-tight">
					Built like you mean it.
				</h2>
			</div>
			<div className="grid gap-px bg-border lg:grid-cols-4 border border-border">
				{features.map((feature) => {
					const Icon = feature.icon ?? Hammer;
					return (
						<div key={feature.title} className="bg-background p-7 group hover:bg-bone transition-colors">
							<div className="inline-flex h-11 w-11 items-center justify-center bg-ink text-bone group-hover:bg-brick transition-colors">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="mt-5 font-display-wide text-[13px] tracking-[0.06em] uppercase">
								{feature.title}
							</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
