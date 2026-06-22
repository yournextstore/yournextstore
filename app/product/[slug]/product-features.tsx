import { FlaskConical, type LucideIcon, Moon, Sparkles } from "lucide-react";

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
		title: "Clinically dosed",
		description: "Active ingredients at the doses studied in published research — not trace amounts.",
	},
	{
		title: "Calm, never groggy",
		description: "Designed to support deep, restorative rest without leaving you foggy in the morning.",
	},
	{
		title: "Hand-batched & traceable",
		description: "Made in small batches in our studio, third-party tested, and traceable to the field.",
	},
];

const defaultIcons = [FlaskConical, Moon, Sparkles];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="text-center max-w-xl mx-auto mb-12">
				<p className="text-[10px] tracking-[0.32em] uppercase text-primary mb-4">— The formulation —</p>
				<h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-[1.1]">
					Small, considered details.
				</h2>
			</div>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="flex flex-col items-center text-center">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-cream/60">
								<Icon className="h-6 w-6 text-primary" strokeWidth={1.4} />
							</div>
							<h3 className="font-serif text-xl text-foreground mb-2">{feature.title}</h3>
							<p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
