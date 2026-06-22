import { Hammer, Leaf, type LucideIcon, PenLine } from "lucide-react";

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
		title: "FSC-certified timber",
		description:
			"Beech and maple from European forests managed for the long view. Every offcut heats the workshop in winter.",
	},
	{
		title: "Hand-turned, hand-painted",
		description:
			"Each piece is shaped on the lathe and finished in matte plant-based pigments — no two are identical.",
	},
	{
		title: "Signed by the maker",
		description:
			"A small initial is burned into the base of every object before it leaves the bench. Accountability, by the gram.",
	},
];

const defaultIcons = [Leaf, Hammer, PenLine];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[color:var(--border)] pt-16">
			<div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<div>
					<p className="yns-eyebrow text-[color:var(--yns-terracotta)]">The making of</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-tight leading-none">
						Made by hand, kept for keeps.
					</h2>
				</div>
			</div>
			<div className="grid gap-10 md:grid-cols-3 md:gap-12">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="border-t border-foreground/10 pt-6">
							<div className="flex items-center gap-3">
								<span className="font-display text-xl text-foreground/40">0{index + 1}</span>
								<Icon className="h-5 w-5 text-[color:var(--yns-terracotta)]" />
							</div>
							<h3 className="mt-4 text-lg font-medium text-foreground">{feature.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
