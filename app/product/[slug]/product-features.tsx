import { Heart, type LucideIcon, Sparkles, Wheat } from "lucide-react";

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
		title: "Real food, real protein",
		description: "20g of clean protein per bag — from whey isolate and almond, not mystery powders.",
	},
	{
		title: "Seven ingredients. That's it.",
		description: "Oats, almond butter, honey, dates, dark chocolate, sea salt, a pinch of vanilla.",
	},
	{
		title: "Slow-baked in small batches",
		description: "Mixed by hand, baked low and long, and packed the morning it cools.",
	},
];

const defaultIcons = [Heart, Wheat, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-foreground/10 pt-16">
			<div className="text-center max-w-2xl mx-auto mb-14">
				<span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--crimson)] mb-4">
					<span aria-hidden="true" className="h-px w-6 bg-[var(--crimson)]" />
					Why people keep reordering
				</span>
				<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">Bakery first, supplement second.</h2>
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group p-7 bg-[var(--cream)] border border-foreground/10 hover:bg-white hover:shadow-[0_12px_40px_rgba(10,10,10,0.06)] transition-all"
						>
							<div className="mb-5 flex h-11 w-11 items-center justify-center bg-foreground text-background">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
