import { Flower2, type LucideIcon, MoonStar, Sparkle } from "lucide-react";

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
		title: "Slow-Pressed Botanicals",
		description:
			"Each material is steeped, not rushed — coaxed out over weeks to keep its full range of warmth and depth.",
	},
	{
		title: "An Honest Material",
		description:
			"No fillers, no shortcuts. We ferment, blend and bottle in small lots so every drop arrives fresh and present.",
	},
	{
		title: "A Ritual, Not a Routine",
		description:
			"Designed for the unhurried minute. Two drops, four breaths, one quiet pause. The body listens when given a chance.",
	},
];

const defaultIcons = [Flower2, Sparkle, MoonStar];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-ink/15 pt-20">
			<div className="text-center mb-14">
				<p className="eyebrow text-rosewood mb-5">The Difference</p>
				<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-light leading-[1.05]">
					Made <span className="italic text-rosewood">with intention,</span> sent with care.
				</h2>
			</div>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center px-4">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-ink/20 bg-bone">
								<Icon className="h-5 w-5 text-rosewood" strokeWidth={1.3} />
							</div>
							<h3 className="font-serif text-2xl text-ink font-normal mb-3">{feature.title}</h3>
							<span className="inline-block w-8 h-px bg-ink/25 mb-4" />
							<p className="text-sm text-ink/65 leading-relaxed max-w-xs">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
