import { Cog, type LucideIcon, ShieldCheck, Wrench } from "lucide-react";

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
		title: "Engineered, not assembled",
		description: "Tolerance-checked components, machined in-house. Every joint thought through.",
	},
	{
		title: "Serviceable for life",
		description: "Standard fasteners, documented schematics, and replacement parts on the shelf.",
	},
	{
		title: "Lifetime warranty",
		description: "Backed by our workshop. If a structural part fails, we replace it. No questions.",
	},
];

const defaultIcons = [Cog, Wrench, ShieldCheck];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="mb-12">
				<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
					§ The Standard
				</span>
				<h2 className="mt-3 display-headline text-[clamp(1.75rem,4vw,2.75rem)] text-foreground">
					What we promise.
				</h2>
			</div>
			<div className="grid gap-px bg-border border border-border md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="bg-background p-8 sm:p-10">
							<div className="flex items-center justify-between mb-6">
								<Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
								<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
									0{index + 1}
								</span>
							</div>
							<h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
