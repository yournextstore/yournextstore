import { Flame, Leaf, type LucideIcon, Sprout } from "lucide-react";

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
		title: "Clean by default",
		description: "Never seed oils, fillers, or preservatives. If we wouldn't eat it, it doesn't go in.",
	},
	{
		title: "Cold-blended",
		description: "Lightly cooked to keep brightness, then bottled within twelve hours of mixing.",
	},
	{
		title: "Shipped flat",
		description: "Mailer-shaped bottles fit through a standard slot. No box waste, no doorstep theft.",
	},
];

const defaultIcons = [Leaf, Flame, Sprout];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-[var(--brand-ink)]/10 pt-16">
			<div className="mb-14 text-center">
				<p className="font-mono-ed text-[10px] uppercase tracking-[0.32em] text-[var(--brand-ember)]">
					Why this bottle
				</p>
				<h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--brand-ink)] sm:text-4xl">
					Crafted with intention.
				</h2>
			</div>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--brand-ember)]/30 text-[var(--brand-ember)]">
								<Icon className="h-5 w-5" strokeWidth={1.5} />
							</div>
							<h3 className="mb-2 font-display text-lg font-medium tracking-tight text-[var(--brand-ink)]">
								{feature.title}
							</h3>
							<p className="max-w-[20rem] font-mono-ed text-[11px] leading-relaxed text-[var(--brand-ink)]/65">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
