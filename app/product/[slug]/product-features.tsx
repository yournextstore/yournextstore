import { Droplets, type LucideIcon, Sparkles, Sprout } from "lucide-react";

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
		title: "Hydration That Lasts",
		description:
			"Plant-derived hyaluronic acid and silk amino acids hold moisture in for up to 72 hours — even through humidity.",
	},
	{
		title: "Frizz On Lockdown",
		description:
			"Lightweight smoothing peptides flatten the cuticle without coating hair in heavy silicones or waxes.",
	},
	{
		title: "Clean Inside & Out",
		description:
			"Vegan, cruelty-free, and free from sulfates, parabens, mineral oil, and synthetic dyes. Always.",
	},
];

const defaultIcons = [Droplets, Sparkles, Sprout];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 bg-[color:var(--yns-cream)] -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-16">
			<div className="text-center mb-12">
				<span className="font-script text-2xl text-[color:var(--yns-red)]">the good stuff</span>
				<h2 className="mt-1 font-display text-3xl sm:text-4xl uppercase tracking-tight text-[color:var(--yns-ink)]">
					Made for messy hair
				</h2>
			</div>
			<div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--yns-pink)] text-white transition-transform group-hover:scale-110">
								<Icon className="h-6 w-6" strokeWidth={1.75} />
							</div>
							<h3 className="mb-2 font-display text-xl uppercase tracking-tight text-[color:var(--yns-ink)]">
								{feature.title}
							</h3>
							<p className="text-sm text-[color:var(--yns-ink)]/70 leading-relaxed max-w-xs">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
