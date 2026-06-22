import { FlaskConical, Leaf, type LucideIcon, Sprout } from "lucide-react";

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
		title: "Forest-grown",
		description: "Cultivated on hardwood logs in shaded canopies — no industrial growhouses.",
	},
	{
		title: "Dual-extracted",
		description: "Hot water + ethanol extraction unlocks both beta-glucans and triterpenes.",
	},
	{
		title: "Independently lab-tested",
		description: "Each batch is screened for actives, heavy metals, and contaminants.",
	},
];

const defaultIcons = [Leaf, Sprout, FlaskConical];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[color:var(--color-mush-cream-deep)] pt-16">
			<p className="text-center font-script text-2xl text-[color:var(--color-mush-caramel)]">
				Why it&apos;s different
			</p>
			<h2 className="mb-12 text-center font-display text-3xl sm:text-4xl tracking-tight text-[color:var(--color-mush-espresso)]">
				Made by farmers, not factories.
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-mush-yellow)] transition-colors group-hover:bg-[color:var(--color-mush-espresso)]">
								<Icon className="h-6 w-6 text-[color:var(--color-mush-espresso)] transition-colors group-hover:text-[color:var(--color-mush-yellow)]" />
							</div>
							<h3 className="mb-2 font-display text-lg text-[color:var(--color-mush-espresso)]">
								{feature.title}
							</h3>
							<p className="text-sm text-[color:var(--color-mush-caramel)] leading-relaxed max-w-xs">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
