import { Flame, Leaf, type LucideIcon, MapPin } from "lucide-react";

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
		title: "Coconut-Apricot Wax",
		description: "Soft, slow-burning, and never paraffin. Cooled overnight on travertine slabs.",
	},
	{
		title: "Single-Origin Oils",
		description: "Sourced from named growers in Grasse, Madagascar, and the Aeolian islands.",
	},
	{
		title: "Hand-Numbered Batch",
		description: "Each candle is poured, cured, and signed in batches of 250 or fewer.",
	},
];

const defaultIcons = [Leaf, MapPin, Flame];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-[#e8dcc8] pt-20">
			<p className="text-center text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-4">The Craft</p>
			<h2 className="mb-16 text-center font-serif text-3xl sm:text-4xl text-foreground">
				A house of slow hands
			</h2>
			<div className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a87c]/40 text-[#8b6b4a]">
								<Icon className="h-5 w-5" strokeWidth={1.25} />
							</div>
							<h3 className="mb-3 font-serif text-xl text-foreground">{feature.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground max-w-[28ch]">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
