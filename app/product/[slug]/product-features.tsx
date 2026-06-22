import { Award, Hammer, Leaf, type LucideIcon } from "lucide-react";

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
		title: "Premium fabrics",
		description: "Woven by mills we know by name. Soft hand, honest weight, built to age well.",
	},
	{
		title: "Studio crafted",
		description: "Cut and finished in small batches. No fast fashion, no filler runs.",
	},
	{
		title: "Wear-tested quality",
		description: "Stitched, stress-tested, and reviewed before it gets the label.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 relative overflow-hidden rounded-3xl bg-sunset-soft ring-1 ring-black/5 px-6 sm:px-10 py-14 sm:py-16">
			<div className="text-center">
				<p className="text-xs font-medium uppercase tracking-[0.22em] text-[--ember]">Why Us</p>
				<h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[--ink]">
					Crafted with <span className="italic text-[--ember]">intention</span>
				</h2>
			</div>
			<div className="mt-12 grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group rounded-2xl bg-white/85 backdrop-blur p-6 ring-1 ring-black/5 transition-all hover:-translate-y-1"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[--ember]/10 text-[--ember]">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="mt-5 font-display text-lg font-semibold text-[--ink]">{feature.title}</h3>
							<p className="mt-1.5 text-sm text-[--ink]/65 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
