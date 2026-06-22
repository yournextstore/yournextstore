import { Droplets, FlaskConical, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Master Perfumery",
		description: "Composed by award-winning noses in Grasse, the cradle of French perfumery.",
	},
	{
		title: "Clean Ingredients",
		description: "Vegan-friendly, cruelty-free, and IFRA compliant — never compromised.",
	},
	{
		title: "Lasting Sillage",
		description: "Up to 12 hours of refined, evolving wear. From skin to memory.",
	},
];

const defaultIcons = [FlaskConical, Droplets, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border/60 pt-16">
			<p className="text-center text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-violet)]">
				Maison Promise
			</p>
			<h2 className="mb-12 mt-3 text-center font-display text-5xl tracking-tight">Crafted with intention</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-luxe-cream)] text-[color:var(--color-luxe-violet)] transition-colors group-hover:bg-foreground group-hover:text-background">
								<Icon className="h-6 w-6" />
							</div>
							<h3 className="mb-2 font-display text-2xl tracking-wide">{feature.title}</h3>
							<p className="max-w-xs text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
