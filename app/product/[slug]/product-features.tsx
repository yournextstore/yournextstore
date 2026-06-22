import { Droplet, FlaskConical, type LucideIcon, Shield } from "lucide-react";

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
		title: "Sweat-proof",
		description:
			"A breathable polymer matrix that locks pigment in place through heat, humidity, and motion.",
		icon: Droplet,
	},
	{
		title: "Transfer-resistant",
		description: "Stays on your face — not on your collar, your mask, or your pillowcase.",
		icon: Shield,
	},
	{
		title: "Clinically tested",
		description: "Twelve hours of true all-day wear, verified in third-party studies on every skin tone.",
		icon: FlaskConical,
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="mx-auto max-w-2xl text-center">
				<p className="eyebrow text-bronze">The Science</p>
				<h2 className="mt-4 font-display text-4xl font-light tracking-tight text-ink sm:text-5xl">
					Engineered to outlast.
				</h2>
			</div>
			<div className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
				{features.map((feature) => {
					const Icon = feature.icon ?? Droplet;
					return (
						<div key={feature.title} className="flex flex-col items-start bg-cream p-8 sm:p-10">
							<Icon className="h-6 w-6 text-bronze" />
							<h3 className="mt-6 font-display text-2xl font-medium text-ink">{feature.title}.</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
