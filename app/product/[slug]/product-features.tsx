import { Droplets, Feather, type LucideIcon, Moon } from "lucide-react";

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
		title: "Reduces breakage",
		description:
			"The polished surface of mulberry silk lets each strand glide instead of snagging — overnight friction practically disappears.",
	},
	{
		title: "Locks in moisture",
		description:
			"Unlike cotton, silk doesn't wick away the oils your hair worked all day to keep, so curls wake hydrated and defined.",
	},
	{
		title: "A quieter night",
		description:
			"Featherlight, breathable, hypoallergenic — naturally temperature-regulating so you stay cool from dusk till dawn.",
	},
];

const defaultIcons = [Feather, Droplets, Moon];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-walnut/15 pt-20">
			<p className="text-[11px] tracking-[0.3em] uppercase text-terracotta font-medium text-center mb-4">
				The silk difference
			</p>
			<h2 className="mb-16 text-center font-serif text-4xl sm:text-5xl text-espresso">
				Crafted for the way <span className="italic">you</span> sleep
			</h2>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-terracotta/30 bg-terracotta/5 transition-colors group-hover:bg-terracotta group-hover:border-terracotta">
								<Icon
									className="h-5 w-5 text-terracotta transition-colors group-hover:text-cream"
									strokeWidth={1.5}
								/>
							</div>
							<h3 className="mb-3 font-serif text-2xl text-espresso">{feature.title}</h3>
							<p className="text-sm text-walnut/70 leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
