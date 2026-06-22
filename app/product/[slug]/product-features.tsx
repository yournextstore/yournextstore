import { Brain, type LucideIcon, MoonStar, Sparkles } from "lucide-react";

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
		title: "soft on the nervous system",
		description: "microdosed melatonin (0.3 mg) plus l-theanine, so you fall — not crash — into sleep.",
	},
	{
		title: "engineered for staying down",
		description: "magnesium glycinate and passionflower keep the 3 a.m. spiral quiet through dawn.",
	},
	{
		title: "made for the chronically awake",
		description:
			"no habit-forming compounds, no morning grogginess. take it nightly or once a week — your nervous system decides.",
	},
];

const defaultIcons = [MoonStar, Brain, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-[var(--yns-ink)]/15 pt-16">
			<div className="text-center mb-14">
				<span className="text-[10px] uppercase tracking-[0.3em] text-[var(--yns-red)]">
					why this one works
				</span>
				<h2 className="mt-4 font-[family-name:var(--font-display)] italic text-4xl sm:text-5xl tracking-tight text-[var(--yns-ink)]">
					soft science<span className="text-[var(--yns-red)] not-italic">.</span>
				</h2>
			</div>
			<div className="grid gap-px bg-[var(--yns-ink)]/10 md:grid-cols-3 border border-[var(--yns-ink)]/10">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col items-start bg-[var(--yns-paper)] p-8 hover:bg-[var(--yns-red)] hover:text-white transition-colors"
						>
							<span className="font-[family-name:var(--font-display)] italic text-3xl text-[var(--yns-red)] group-hover:text-white transition-colors mb-4">
								0{index + 1}
							</span>
							<Icon className="mb-5 h-5 w-5 text-[var(--yns-red)] group-hover:text-white transition-colors" />
							<h3 className="mb-3 text-lg text-[var(--yns-ink)] group-hover:text-white transition-colors lowercase">
								{feature.title}
							</h3>
							<p className="text-sm text-[var(--yns-ink)]/65 group-hover:text-white/85 transition-colors lowercase leading-relaxed">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
