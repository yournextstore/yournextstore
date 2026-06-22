import { Cherry, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Whole, Real Fruit",
		description: "Every bite starts with real berries, mango, or matcha — never artificial flavoring.",
	},
	{
		title: "Functional Superfoods",
		description: "Adaptogens, omega-rich seeds, and clean protein, all working quietly in the background.",
	},
	{
		title: "No Junk, Ever",
		description: "Zero preservatives, refined sugars, or anything you wouldn't keep in your own pantry.",
	},
];

const defaultIcons = [Cherry, Sparkles, Leaf];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-brand-ink/10 pt-16">
			<div className="mx-auto max-w-2xl text-center">
				<span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-coral">
					Why You&apos;ll Love It
				</span>
				<h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-tight text-brand-ink">
					Crafted with intention. Snacked with abandon.
				</h2>
			</div>
			<div className="mt-12 grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					const tints = [
						"bg-brand-coral text-white",
						"bg-brand-green text-white",
						"bg-brand-mustard text-brand-ink",
					];
					return (
						<div
							key={feature.title}
							className="group rounded-3xl bg-brand-cream p-6 transition-transform duration-200 hover:-translate-y-0.5"
						>
							<div
								className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${tints[index % tints.length]}`}
							>
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="font-display text-xl text-brand-ink">{feature.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
