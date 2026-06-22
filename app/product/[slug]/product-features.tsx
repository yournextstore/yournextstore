import { Heart, type LucideIcon, Sparkles, Zap } from "lucide-react";

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
		title: "5x faster absorption",
		description: "Sublingual delivery beats the gut. Actives hit your system in seconds, not 45 minutes.",
	},
	{
		title: "Clinically dosed",
		description: "Research-backed amounts of every active. No proprietary blends, no fairy dust.",
	},
	{
		title: "Tastes like candy",
		description: "Real fruit flavors, zero sugar, zero chalk. Your tongue won't believe it's a supplement.",
	},
];

const defaultIcons = [Zap, Sparkles, Heart];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[#ecd9c6] pt-16">
			<div className="text-center mb-12">
				<p className="font-marker text-[#f4884a] text-xl mb-2 -rotate-2">why it works</p>
				<h2 className="text-3xl sm:text-4xl text-[#1a0f4d]">Made for actually using.</h2>
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col items-center text-center rounded-3xl bg-[#fef7f0] border-2 border-[#ecd9c6] p-7 hover:border-[#4b1fb5] hover:-translate-y-1 transition-all"
						>
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4b1fb5] transition-colors group-hover:bg-[#f5c518]">
								<Icon className="h-6 w-6 text-white group-hover:text-[#1a0f4d] transition-colors" />
							</div>
							<h3 className="mb-2 text-lg font-extrabold text-[#1a0f4d]">{feature.title}</h3>
							<p className="text-sm text-[#1a0f4d]/70 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
