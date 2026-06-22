import { Cookie, Heart, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Wholesome ingredients",
		description: "Stone-milled chickpea flour, real chocolate, and pantry staples — no fillers.",
	},
	{
		title: "Soft & chewy",
		description: "Bakery-style cookies that stay tender on day three. (If they last that long.)",
	},
	{
		title: "Baker-approved",
		description: "Designed by snack-obsessed bakers. Loved by gluten-free families everywhere.",
	},
];

const defaultIcons = [Sparkles, Cookie, Heart];
const accentColors = ["#f47b7b", "#7fb8d6", "#f8a98a"];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t-2 border-[#3a4a8c]/15 pt-16">
			<div className="text-center">
				<span className="inline-block rounded-full bg-[#3a4a8c] text-[#fcefa8] px-4 py-1.5 text-[11px] tracking-[0.22em] font-bold uppercase shadow-pop">
					Why You&apos;ll Love It
				</span>
				<h2 className="mt-4 mb-12 font-heading font-black text-3xl sm:text-4xl text-[#3a4a8c] tracking-tight">
					Better-for-you, built to <span className="font-display text-[#e8456a]">delight</span>.
				</h2>
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					const accent = accentColors[index % accentColors.length];
					return (
						<div
							key={feature.title}
							className="group rounded-3xl border-2 border-[#3a4a8c]/15 bg-[#fff8e7] p-7 text-center shadow-pop hover:-translate-y-1 transition-transform"
						>
							<div
								className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#3a4a8c]/15"
								style={{ backgroundColor: accent }}
							>
								<Icon className="h-6 w-6 text-white" />
							</div>
							<h3 className="mb-2 font-heading font-bold text-xl text-[#3a4a8c]">{feature.title}</h3>
							<p className="text-sm text-[#3a4a8c]/75 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
