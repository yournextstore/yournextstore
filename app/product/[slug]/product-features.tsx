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
		title: "Sustainable Materials",
		description: "Crafted from responsibly sourced materials with minimal environmental impact.",
	},
	{
		title: "Expert Craftsmanship",
		description: "Each piece is made by skilled artisans with attention to detail.",
	},
	{
		title: "Quality Guaranteed",
		description: "Built to last with premium components and rigorous quality standards.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];
const accents = [
	{ bg: "bg-[var(--color-primary-container)]", fg: "text-[var(--color-on-primary-container)]" },
	{ bg: "bg-[var(--color-secondary-container)]", fg: "text-[var(--color-on-secondary-container)]" },
	{ bg: "bg-[var(--color-tertiary-container)]", fg: "text-[var(--color-on-tertiary-container)]" },
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="bg-[var(--color-surface-container)] border-b border-foreground py-16 md:py-20 px-5 md:px-20">
			<div className="max-w-[1280px] mx-auto">
				<div className="text-center mb-12">
					<span className="label-caps text-[var(--color-on-surface-variant)]">Why we love it</span>
					<h2 className="font-serif text-3xl md:text-4xl mt-3">Crafted with intention</h2>
				</div>
				<div className="grid gap-6 md:grid-cols-3">
					{features.map((feature, index) => {
						const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
						const accent = accents[index % accents.length];
						return (
							<div
								key={feature.title}
								className="bg-[var(--color-surface-container-lowest)] neo-border p-6 hover:neo-shadow transition-shadow"
							>
								<div
									className={`mb-4 flex h-14 w-14 items-center justify-center neo-border ${accent.bg} ${accent.fg}`}
								>
									<Icon className="h-6 w-6" strokeWidth={1.5} />
								</div>
								<h3 className="font-serif text-2xl mb-2">{feature.title}</h3>
								<p className="text-[var(--color-on-surface-variant)] leading-relaxed">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
