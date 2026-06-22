import { Cpu, Fan, type LucideIcon, Zap } from "lucide-react";

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
		title: "Tuned for performance",
		description: "Every component is binned and validated against synthetic and in-game workloads.",
	},
	{
		title: "Whisper-quiet cooling",
		description: "PWM fan curves and large radiators keep package temps below 70°C under load.",
	},
	{
		title: "Tournament-grade",
		description: "Pre-flashed BIOS, latest drivers, and benchmark validation on every unit.",
	},
];

const defaultIcons = [Zap, Fan, Cpu];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-white/8 pt-16">
			<h2 className="mb-12 text-center font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
				Built different.
			</h2>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-colors hover:border-primary/30"
						>
							<div
								className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
								style={{
									background: "linear-gradient(135deg, rgba(217,70,196,0.18), rgba(168,85,247,0.12))",
									border: "1px solid rgba(217,70,196,0.25)",
								}}
							>
								<Icon className="h-5 w-5 text-primary" />
							</div>
							<h3 className="mb-2 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
