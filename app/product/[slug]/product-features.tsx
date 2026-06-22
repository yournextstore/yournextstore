import { type LucideIcon, MessageCircleIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

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
		title: "Genuine medicines",
		description: "Sourced directly from licensed manufacturers, with batch and expiry verification.",
	},
	{
		title: "Free same-day delivery",
		description: "Orders over $35 ship at no cost, often delivered within hours in your city.",
	},
	{
		title: "Talk to a pharmacist",
		description: "Free, confidential consultations with our in-house pharmacy team, 7 days a week.",
	},
];

const defaultIcons = [ShieldCheckIcon, TruckIcon, MessageCircleIcon];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-foreground">
				Care you can count on
			</h2>
			<div className="grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group flex flex-col items-center rounded-3xl bg-secondary/40 p-6 text-center transition-colors hover:bg-mint-gradient"
						>
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-[color:var(--mint-deep)]/10">
								<Icon className="h-6 w-6 text-[color:var(--mint-deep)]" />
							</div>
							<h3 className="mb-2 font-display text-lg font-bold text-foreground">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
