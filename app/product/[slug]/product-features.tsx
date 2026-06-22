import { Activity, Droplets, type LucideIcon, Recycle, Wind } from "lucide-react";

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
		title: "Four-way stretch",
		description: "Mobility-first fabric that moves through any rep, stride, or stretch.",
		icon: Activity,
	},
	{
		title: "Moisture-wicking",
		description: "Quick-dry weave keeps you cool and dry from warm-up to cool-down.",
		icon: Droplets,
	},
	{
		title: "Breathable mesh panels",
		description: "Strategic ventilation where you need it most.",
		icon: Wind,
	},
	{
		title: "Made responsibly",
		description: "Recycled fibers and low-impact dyes, sewn with care.",
		icon: Recycle,
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="text-center max-w-2xl mx-auto mb-12">
				<p className="text-[11px] uppercase tracking-[0.22em] text-[--oxblood] font-semibold mb-3">
					Engineered for you
				</p>
				<h2 className="display-section text-3xl sm:text-4xl tracking-tight">Performance, every detail.</h2>
			</div>
			<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{features.map((feature) => {
					const Icon = feature.icon ?? Activity;
					return (
						<div key={feature.title} className="flex flex-col items-start">
							<div className="mb-4 flex h-11 w-11 items-center justify-center bg-[--bone]">
								<Icon className="h-5 w-5 text-[--oxblood]" />
							</div>
							<h3 className="mb-2 text-base font-semibold tracking-tight">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
