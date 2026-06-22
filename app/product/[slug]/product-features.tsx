import { Gem, type LucideIcon, Plane, RefreshCcw } from "lucide-react";

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
		title: "Atelier authenticated",
		description: "Every garment is hand-inspected and authenticated by our in-house team in Antwerp.",
	},
	{
		title: "Express worldwide",
		description: "Complimentary express delivery to 90+ countries on orders over $250.",
	},
	{
		title: "Effortless returns",
		description: "Free 30-day returns and exchanges, with concierge collection on request.",
	},
];

const defaultIcons = [Gem, Plane, RefreshCcw];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<p className="text-center text-[11px] uppercase tracking-[0.28em] text-lilac-deep">The YNS Promise</p>
			<h2 className="font-display mt-3 mb-14 text-center text-3xl font-medium tracking-[-0.01em] sm:text-4xl">
				Considered service, beautifully delivered
			</h2>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 text-foreground">
								<Icon className="h-5 w-5" strokeWidth={1.5} />
							</div>
							<h3 className="font-display mb-2 text-xl">{feature.title}</h3>
							<p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
