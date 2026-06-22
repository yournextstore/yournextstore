import { BatteryChargingIcon, type LucideIcon, ShieldCheckIcon, SunIcon } from "lucide-react";

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
		title: "Engineered for real rooftops",
		description: "Mono PERC cells with anti-PID coating perform across heat, salt air and partial shading.",
	},
	{
		title: "Built for storage",
		description:
			"Drop-in compatible with our hybrid inverter and battery line — go grid-tied today, off-grid later.",
	},
	{
		title: "25-year peace of mind",
		description:
			"Linear warranty guarantees at least 84.8% rated output at year 25, backed by a US-based service team.",
	},
];

const defaultIcons = [SunIcon, BatteryChargingIcon, ShieldCheckIcon];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<div className="text-center mb-12">
				<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]/70">
					Why this product
				</p>
				<h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
					Engineered to outlast the install
				</h2>
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col gap-3 rounded-2xl border border-border p-6 hover:border-[var(--forest)]/30 hover:shadow-md transition"
						>
							<div className="flex size-11 items-center justify-center rounded-xl bg-[var(--forest)] text-[var(--lime)] group-hover:bg-[var(--lime)] group-hover:text-[var(--forest-deep)] transition-colors">
								<Icon className="h-5 w-5" />
							</div>
							<h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
