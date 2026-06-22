import { Hammer, Leaf, type LucideIcon, Ruler } from "lucide-react";

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
		title: "Hand-laminated",
		description:
			"Seven sheets of beech veneer, pressed and cured for forty-eight hours before the shell is released.",
	},
	{
		title: "Joinery you can read",
		description:
			"Mortise-and-tenon construction, brass hardware visible where it carries the load and hidden where it doesn't.",
	},
	{
		title: "Drawn to scale",
		description:
			"Proportioned in the studio against the body, not the room — every dimension referenced from a physical sketch.",
	},
];

const defaultIcons = [Leaf, Hammer, Ruler];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border/70 pt-16">
			<div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<p className="editorial-eyebrow text-muted-foreground">Three notes on the make</p>
					<h2 className="mt-3 font-display italic text-4xl sm:text-5xl tracking-tight leading-[0.95]">
						Made with patience.
					</h2>
				</div>
				<p className="text-sm text-muted-foreground max-w-sm">
					Every piece in the catalog goes through the same three checks before it leaves the studio.
				</p>
			</div>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col border-t border-foreground/15 pt-6">
							<div className="flex items-baseline justify-between">
								<span className="font-display italic text-foreground/30 text-3xl leading-none">
									0{index + 1}
								</span>
								<Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
							</div>
							<h3 className="mt-6 font-display italic text-2xl text-foreground">{feature.title}</h3>
							<p className="mt-3 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
