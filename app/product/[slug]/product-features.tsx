import { Compass, type LucideIcon, Mountain, Shield } from "lucide-react";

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
		title: "Built For Travel",
		description: "Compact form, weatherproof shell, marine-grade hardware. Earns its place in any pack.",
	},
	{
		title: "Materials That Age Well",
		description:
			"Hand-pressed cork, vegetable-tanned leather, anodized aluminum. The longer you use it, the better it gets.",
	},
	{
		title: "Lifetime Promise",
		description:
			"Repairs, refurbishes, replacements. If it leaves our bench, we stand behind it for as long as you own it.",
	},
];

const defaultIcons = [Compass, Mountain, Shield];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[color:var(--color-yns-ink)]/15 pt-16">
			<div className="text-center mb-12">
				<p className="text-xs tracking-utility font-semibold text-[color:var(--color-yns-wood)] mb-3">
					WHY IT&apos;S BUILT THIS WAY
				</p>
				<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[-0.02em] leading-[0.95]">
					Made for the long haul.
				</h2>
			</div>
			<div className="grid gap-px md:grid-cols-3 bg-[color:var(--color-yns-ink)]/10 border border-[color:var(--color-yns-ink)]/10">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group bg-[color:var(--color-yns-cream)] p-8 sm:p-10 flex flex-col items-start gap-4"
						>
							<div className="flex h-12 w-12 items-center justify-center bg-[color:var(--color-yns-ink)] text-[color:var(--color-yns-cream)] group-hover:bg-[color:var(--color-yns-wood)] transition-colors">
								<Icon className="h-5 w-5" />
							</div>
							<p className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/55">
								№0{index + 1}
							</p>
							<h3 className="font-display text-2xl font-black uppercase leading-none tracking-[-0.01em]">
								{feature.title}
							</h3>
							<p className="text-sm leading-relaxed text-[color:var(--color-yns-ink)]/70">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
