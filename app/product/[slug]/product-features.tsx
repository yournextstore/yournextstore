import { Droplets, Feather, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Enzyme-powered",
		description:
			"A pressed sheet of plant-derived enzymes that dissolves cleanly in any water temperature — no grit, no residue.",
	},
	{
		title: "Trace-dosed scent",
		description:
			"Perfumer-composed at the lowest concentration that still lingers on linen. Soft, never heavy.",
	},
	{
		title: "Paper, not plastic",
		description:
			"Each carton is curbside-recyclable kraft, printed with vegetable inks. Nothing about it is single-use.",
	},
];

const defaultIcons = [Sparkles, Feather, Droplets];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 pt-16 border-t border-foreground/10">
			<p className="text-center text-[11px] uppercase tracking-[0.32em] text-foreground/55">The formula</p>
			<h2 className="mt-4 mb-14 text-center font-serif italic text-4xl sm:text-5xl font-light tracking-tight">
				Quietly considered
			</h2>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center px-4">
							<Icon className="h-5 w-5 text-foreground/55 mb-5" strokeWidth={1.25} />
							<h3 className="font-serif text-xl tracking-[0.18em] uppercase font-light text-foreground">
								{feature.title}
							</h3>
							<p className="mt-4 text-[14px] leading-[1.7] text-foreground/65 max-w-xs">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
