import { Flame, HeartHandshake, Leaf, type LucideIcon } from "lucide-react";

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
		title: "Family-milled spices",
		description:
			"We work direct with third-generation millers across the Levant, paying fair-trade rates that keep the old kitchens going.",
	},
	{
		title: "No fillers, no extracts",
		description:
			"Just whole herbs, sumac berries, sesame and salt — toasted and blended the way our grandmothers taught us.",
	},
	{
		title: "Tinned for the long shelf",
		description:
			"Each blend is small-batch tinned with a wax-seal liner, so the oils stay bright on your counter for months.",
	},
];

const defaultIcons = [HeartHandshake, Leaf, Flame];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 rounded-[28px] bg-[#fbe5ea] px-6 sm:px-10 py-16 sm:py-20">
			<div className="text-center mb-12">
				<p className="text-[11px] uppercase tracking-[0.3em] text-[#b81e26] font-semibold">Why this tin</p>
				<h2 className="mt-3 font-display italic text-3xl sm:text-4xl text-[#7a0e15]">
					Spice, the way it should taste.
				</h2>
			</div>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#b81e26] text-[#fbe5ea] shadow-[0_10px_25px_-10px_rgba(122,14,21,0.6)]">
								<Icon className="h-6 w-6" />
							</div>
							<h3 className="mb-2 font-display italic text-xl text-[#7a0e15]">{feature.title}</h3>
							<p className="text-sm leading-relaxed text-[#2b2120]/75 max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
