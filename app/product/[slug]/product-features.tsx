import { Cpu, type LucideIcon, MonitorSpeaker, Zap } from "lucide-react";

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
		title: "High-Fidelity Sound",
		description: "Precision drivers for clear highs, rich mids, and deep bass — tuned for gaming.",
	},
	{
		title: "Ultra-Fast Performance",
		description: "Engineered with the latest hardware for zero-lag responsiveness and lightning speed.",
	},
	{
		title: "Built to Dominate",
		description: "Premium components tested under extreme conditions. Built for gamers, by gamers.",
	},
];

const defaultIcons = [MonitorSpeaker, Zap, Cpu];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="font-heading mb-12 text-center text-3xl font-bold uppercase tracking-tight">
				Engineered for Victory
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-card border border-border transition-colors group-hover:border-primary group-hover:bg-primary/10">
								<Icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mb-2 text-base font-semibold uppercase tracking-wider">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
