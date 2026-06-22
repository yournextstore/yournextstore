import { Dumbbell, Leaf, type LucideIcon, ShieldCheck, Truck } from "lucide-react";

type Feature = {
	title: string;
	description: string;
	icon?: LucideIcon;
	accent?: string;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "30g Protein",
		description: "Whey isolate + casein blend churned in slowly for actual ice cream texture.",
		accent: "var(--yns-cyan)",
		icon: Dumbbell,
	},
	{
		title: "Real Ingredients",
		description: "Allulose and monk fruit only. Six to nine ingredients on every label. No sucralose.",
		accent: "var(--yns-mint)",
		icon: Leaf,
	},
	{
		title: "Ships Frozen",
		description:
			"Insulated boxes with dry ice. Arrives in 2 business days, stays frozen 36 hours after delivery.",
		accent: "var(--yns-honey)",
		icon: Truck,
	},
	{
		title: "Quality Guarantee",
		description: "Don't love it in your first 30 days? We'll ship you a free sampler — no proof, no forms.",
		accent: "var(--yns-peach)",
		icon: ShieldCheck,
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-white/10 pt-16">
			<div className="text-center mb-12">
				<div className="font-display uppercase tracking-[0.2em] text-xs text-[var(--yns-cyan)]">
					Why this pint
				</div>
				<h2 className="mt-3 font-display uppercase text-3xl sm:text-4xl lg:text-5xl leading-[0.95]">
					Crafted with intention.
				</h2>
			</div>
			<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{features.map((feature) => {
					const Icon = feature.icon ?? Dumbbell;
					const accent = feature.accent ?? "var(--yns-cyan)";
					return (
						<div
							key={feature.title}
							className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/25"
						>
							<div
								className="flex h-12 w-12 items-center justify-center rounded-full"
								style={{ background: accent }}
							>
								<Icon className="h-5 w-5 text-black" strokeWidth={2.5} />
							</div>
							<h3 className="mt-5 font-display uppercase text-lg tracking-wide text-white">
								{feature.title}
							</h3>
							<p className="mt-2 text-sm text-white/65 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
