import { Leaf, type LucideIcon, Sprout, Sun } from "lucide-react";

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
		title: "Locally grown",
		description: "Sourced from regional family farms within 100 miles of our market.",
	},
	{
		title: "Pesticide-free",
		description: "Certified organic and grown without synthetic chemicals.",
	},
	{
		title: "Picked at peak",
		description: "Harvested at sunrise so every basket arrives at its tastiest.",
	},
];

const defaultIcons = [Leaf, Sprout, Sun];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-[var(--brand-deep)]">
				Fresh from the farm
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--brand-soft)] transition-colors group-hover:bg-[var(--brand)]">
								<Icon className="h-6 w-6 text-[var(--brand-deep)] transition-colors group-hover:text-white" />
							</div>
							<h3 className="mb-2 font-display text-lg font-semibold text-[var(--brand-deep)]">
								{feature.title}
							</h3>
							<p className="text-sm text-[var(--muted-foreground)]">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
