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
		title: "Sourced materials",
		description:
			"Bent beech, walnut veneer and brushed steel — drawn for grain and weight, not finish alone.",
	},
	{
		title: "Studio-made",
		description: "Six pairs of hands attend each piece before it leaves the workshop, signed and dated.",
	},
	{
		title: "Archival",
		description:
			"Joined to a catalogue still in production after seven decades — built to outlast the trend cycle.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-foreground/15 pt-16">
			<div
				className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-ember mb-6"
				style={{ color: "#c97a2b" }}
			>
				<span className="block h-px w-10 bg-current" />
				<span>The make</span>
			</div>
			<h2 className="display-italic text-4xl sm:text-5xl tracking-[-0.02em] leading-[0.95] mb-12 max-w-2xl">
				Drawn with restraint, built by hand.
			</h2>
			<div className="grid gap-12 md:grid-cols-3 border-t border-foreground/15 pt-10">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col">
							<div className="flex items-center gap-3 mb-5">
								<span className="display-italic text-xl text-ember" style={{ color: "#c97a2b" }}>
									{String(index + 1).padStart(2, "0")}
								</span>
								<Icon className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
							</div>
							<h3 className="display-italic text-2xl tracking-[-0.01em] mb-3">{feature.title}</h3>
							<p className="text-sm text-foreground/70 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
