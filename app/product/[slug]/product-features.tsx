import { Coffee, Flame, type LucideIcon, Mountain } from "lucide-react";

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
		title: "Direct trade sourcing",
		description:
			"Beans sourced direct from small-batch farms across Ethiopia, Guatemala and Sumatra. We pay above market, every time.",
	},
	{
		title: "Roasted in Brooklyn",
		description:
			"Small-batch roasted in our warehouse and bagged within 48 hours. Shipped before the oils have time to settle.",
	},
	{
		title: "Bold by design",
		description:
			"Dark, deliberate, and made for people who want their coffee to actually taste like coffee. No filler, no fluff.",
	},
];

const defaultIcons = [Mountain, Flame, Coffee];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-[#0e0e0e]/10 pt-16">
			<div className="mb-12 text-center">
				<span className="jolt-eyebrow text-[#6e6e6e]">— Why this can</span>
				<h2 className="jolt-headline mt-3 text-3xl sm:text-4xl text-[#0e0e0e]">Brewed with intention.</h2>
			</div>
			<div className="grid gap-px bg-[#0e0e0e]/10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group bg-background p-8 text-left transition-colors hover:bg-[#f2f2f2]"
						>
							<div className="flex items-center justify-between">
								<span className="jolt-eyebrow text-[#6e6e6e]">0{index + 1} /</span>
								<Icon className="h-5 w-5 text-[#0e0e0e] transition-colors group-hover:text-[#ffcc00]" />
							</div>
							<h3 className="jolt-headline mt-6 text-xl text-[#0e0e0e]">{feature.title}</h3>
							<p className="mt-3 text-sm text-[#6e6e6e] leading-relaxed">{feature.description}</p>
							<div className="mt-6 h-px w-10 bg-[#0e0e0e] transition-all group-hover:w-20 group-hover:bg-[#ffcc00]" />
						</div>
					);
				})}
			</div>
		</section>
	);
}
