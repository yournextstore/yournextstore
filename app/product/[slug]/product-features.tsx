import { Feather, type LucideIcon, Scissors, Sparkles } from "lucide-react";

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
		title: "Considered Cloth",
		description:
			"Double-faced wools and brushed cottons milled in Italy, chosen for the way they soften with wear.",
	},
	{
		title: "Patterned in Studio",
		description: "Every silhouette is cut and re-cut on the body in our atelier before it is ever finalized.",
	},
	{
		title: "Finished by Hand",
		description:
			"Quiet hand-stitching, lined seams, and considered details — the kind you only notice up close.",
	},
];

const defaultIcons = [Feather, Scissors, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<p className="text-center eyebrow text-mushroom">Made in our Atelier</p>
			<h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl tracking-tight text-foreground sm:text-[40px] sm:leading-[1.1]">
				A quieter approach to making clothes.
			</h2>
			<div className="mt-14 grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-start">
							<Icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
							<h3 className="mt-5 font-display text-lg text-foreground">{feature.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-mushroom">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
