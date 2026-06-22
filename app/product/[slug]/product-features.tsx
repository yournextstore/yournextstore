import { Droplet, type LucideIcon, Snowflake, Sparkles } from "lucide-react";

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
		title: "Atmospheric dye",
		description: "Pigments hand-mixed in small batches; every panel reads a little differently in low light.",
	},
	{
		title: "Heavyweight build",
		description: "Garment-washed cotton at 14oz minimum. Built to outlast the trend cycle, not chase it.",
	},
	{
		title: "Quiet logos",
		description: "Embossed and tonal hits only. Designed to disappear and reappear depending on the room.",
	},
];

const defaultIcons = [Droplet, Snowflake, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<p className="text-center font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-300/70 mb-3">
				[ field notes ]
			</p>
			<h2 className="mb-14 text-center font-display text-3xl sm:text-4xl font-medium tracking-tight">
				Built for in-between weather
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group relative rounded-2xl border border-border bg-secondary/20 p-6 transition-colors hover:border-cyan-300/30"
						>
							<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 transition-colors group-hover:border-cyan-300/50">
								<Icon className="h-5 w-5 text-cyan-200" />
							</div>
							<span className="mb-2 inline-block font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">
								[ 0{index + 1} ]
							</span>
							<h3 className="mb-2 font-display text-lg font-medium">{feature.title}</h3>
							<p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
