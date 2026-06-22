import { Citrus, type LucideIcon, PartyPopper, Snowflake } from "lucide-react";

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
		title: "Real-fruit purée",
		description: "Cold-pressed mango, hibiscus, passionfruit, watermelon — never from concentrate.",
	},
	{
		title: "21% ABV punch",
		description: "Tequila, mezcal, and sparkling-wine bases that survive the freezer and taste loud.",
	},
	{
		title: "Party-ready packaging",
		description: "Twist-tear pouches that handle dry-ice shipping and look great on the deck.",
	},
];

const defaultIcons = [Citrus, PartyPopper, Snowflake];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<p className="text-center text-[11px] uppercase tracking-[0.28em] font-semibold text-primary">
				What&apos;s inside
			</p>
			<h2 className="mt-2 mb-12 text-center font-display text-4xl sm:text-5xl uppercase text-pop-ink">
				Tropical, on purpose
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					const surface = index === 0 ? "bg-pop-yellow" : index === 1 ? "bg-pop-mint" : "bg-pop-pink-soft";
					return (
						<div
							key={feature.title}
							className={`group rounded-3xl ${surface} p-6 shadow-[5px_5px_0_rgba(47,47,47,0.92)]`}
						>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pop-ink">
								<Icon className="h-5 w-5 text-pop-yellow" />
							</div>
							<h3 className="font-display text-2xl uppercase text-pop-ink leading-none">{feature.title}</h3>
							<p className="mt-3 text-sm text-pop-ink/80 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
